import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { Card } from '../data/defaultCards';
import { GameSettings } from '../services/storage';
import { Player, ScoreModal } from '../components/ScoreModal';
import { CardView } from '../components/CardView';
import { NeonButton, NeonButtonSolid } from '../components/NeonButton';

interface GameScreenProps {
  players: Player[];
  settings: GameSettings;
  deck: Card[];
  passadorIndex: number;
  onTurnEnd: (correctCount: number, updatedPlayers: Player[]) => void;
  onQuit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  players: initialPlayers,
  settings,
  deck,
  passadorIndex,
  onTurnEnd,
  onQuit,
}) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isReady, setIsReady] = useState(true);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [playedCount, setPlayedCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(settings.defaultTime);
  const [isPaused, setIsPaused] = useState(false);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);

  const passador = players[passadorIndex];
  const currentCard = deck[(passadorIndex * 15 + currentCardIdx) % deck.length]; // unique card index based on round/passador

  // Ref to hold the active interval
  const timerRef = useRef<any>(null);

  // Time Countdown logic
  useEffect(() => {
    if (settings.mode === 'time' && !isReady && !isPaused && !scoreModalVisible) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [settings.mode, isReady, isPaused, scoreModalVisible]);

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Vibrate or beep if possible, but a alert/modal is fine.
    // End the turn
    Alert.alert('Tempo Esgotado!', 'O tempo do passador acabou.', [
      { text: 'Ver Resumo', onPress: () => finishTurn() },
    ]);
  };

  const startTurn = () => {
    setIsReady(false);
    setTimeRemaining(settings.defaultTime);
    setCurrentCardIdx(0);
    setCorrectCount(0);
    setPlayedCount(0);
    setIsPaused(false);
  };

  const handleSkip = () => {
    // Advance card
    const nextIdx = currentCardIdx + 1;
    setCurrentCardIdx(nextIdx);
    setPlayedCount(prev => prev + 1);

    // If rounds mode, check if we reached the card limit
    if (settings.mode === 'rounds') {
      if (playedCount + 1 >= settings.cardsPerRound) {
        finishTurn();
      }
    }
  };

  const handleAcertou = () => {
    // Open the score modal (this will automatically pause the timer due to scoreModalVisible dependency)
    setScoreModalVisible(true);
  };

  const handleSelectGuesser = (guesserId: string) => {
    // 1. Give point to guesser
    // 2. Give point to passador (clue giver)
    const updated = players.map(player => {
      if (player.id === guesserId || player.id === passador.id) {
        return { ...player, score: player.score + 1 };
      }
      return player;
    });

    setPlayers(updated);
    setCorrectCount(prev => prev + 1);
    setPlayedCount(prev => prev + 1);
    setScoreModalVisible(false);

    // Advance card
    const nextIdx = currentCardIdx + 1;
    setCurrentCardIdx(nextIdx);

    // If rounds mode, check if we reached the card limit
    if (settings.mode === 'rounds') {
      if (playedCount + 1 >= settings.cardsPerRound) {
        // Delay slightly so the UI transitions smoothly
        setTimeout(() => {
          onTurnEnd(correctCount + 1, updated);
        }, 300);
      }
    }
  };

  const finishTurn = () => {
    onTurnEnd(correctCount, players);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const quitGamePrompt = () => {
    Alert.alert(
      'Sair do Jogo?',
      'Se você sair, a pontuação atual da partida será perdida.',
      [
        { text: 'Continuar jogando', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: onQuit },
      ]
    );
  };

  // Turn preparation / wait screen
  if (isReady) {
    return (
      <View style={styles.container}>
        <View style={styles.readyContent}>
          <Text style={styles.readyTitle}>PREPARE-SE!</Text>
          <View style={styles.passadorCard}>
            <Text style={styles.passadorLabel}>PASSADOR DA VEZ</Text>
            <Text style={styles.passadorName}>{passador.name}</Text>
          </View>

          <View style={styles.modeInfo}>
            <Text style={styles.modeLabel}>MODO DE JOGO:</Text>
            <Text style={styles.modeValue}>
              {settings.mode === 'time'
                ? `Por Tempo: ${settings.defaultTime} segundos`
                : `Por Rodadas: ${settings.cardsPerRound} cartas`}
            </Text>
          </View>

          <Text style={styles.readyInstructions}>
            Passe o aparelho para {passador.name}. Quando estiver pronto para dar as dicas, clique no botão abaixo.
          </Text>

          <NeonButtonSolid
            title="COMEÇAR TURNO"
            onPress={startTurn}
            variant="green"
            style={styles.readyBtn}
          />
        </View>

        <View style={styles.footer}>
          <NeonButton title="Sair do Jogo" onPress={quitGamePrompt} variant="red" />
        </View>
      </View>
    );
  }

  // Active playing UI
  return (
    <View style={styles.container}>
      {/* Header Info (Timer or Rounds indicator) */}
      <View style={styles.gameHeader}>
        <View style={styles.headerColumn}>
          <Text style={styles.headerLabel}>PASSADOR</Text>
          <Text style={styles.headerValue} numberOfLines={1}>
            {passador.name}
          </Text>
        </View>

        {settings.mode === 'time' ? (
          <View style={[styles.timerContainer, timeRemaining <= 10 && styles.timerDanger]}>
            <Text style={[styles.timerText, timeRemaining <= 10 && styles.timerDangerText]}>
              {timeRemaining}s
            </Text>
          </View>
        ) : (
          <View style={styles.roundsContainer}>
            <Text style={styles.roundsText}>
              {playedCount + 1}/{settings.cardsPerRound}
            </Text>
            <Text style={styles.roundsLabel}>CARTAS</Text>
          </View>
        )}

        <View style={styles.headerColumnRight}>
          <Text style={styles.headerLabel}>ACERTOS</Text>
          <Text style={[styles.headerValue, { color: '#39FF14' }]}>{correctCount}</Text>
        </View>
      </View>

      {/* Main card */}
      <View style={styles.cardContainer}>
        {isPaused ? (
          <View style={styles.pausedOverlay}>
            <Text style={styles.pausedText}>JOGO PAUSADO</Text>
            <NeonButtonSolid
              title="Retomar"
              onPress={togglePause}
              variant="cyan"
              style={{ width: 160 }}
            />
          </View>
        ) : (
          <CardView card={currentCard} />
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actionsFooter}>
        <View style={styles.buttonsRow}>
          <NeonButton
            title="Pular"
            onPress={handleSkip}
            variant="pink"
            style={styles.actionBtn}
            disabled={isPaused}
          />

          <NeonButton
            title={isPaused ? 'Retomar' : 'Pausar'}
            onPress={togglePause}
            variant="cyan"
            style={styles.actionBtn}
          />
        </View>

        <NeonButtonSolid
          title="ACERTOU!"
          onPress={handleAcertou}
          variant="green"
          style={styles.scoreBtn}
          disabled={isPaused}
        />

        <TouchableOpacity style={styles.quitLink} onPress={quitGamePrompt}>
          <Text style={styles.quitLinkText}>SAIR DA PARTIDA</Text>
        </TouchableOpacity>
      </View>

      {/* Score input Modal */}
      <ScoreModal
        visible={scoreModalVisible}
        players={players}
        passadorId={passador.id}
        onSelectPlayer={handleSelectGuesser}
        onClose={() => setScoreModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C14',
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  readyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  readyTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF007F',
    letterSpacing: 3,
    marginBottom: 30,
    textShadowColor: '#FF007F',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  passadorCard: {
    backgroundColor: '#161625',
    borderWidth: 2,
    borderColor: '#BB86FC',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  passadorLabel: {
    fontSize: 12,
    color: '#8A8A9E',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  passadorName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E34',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8A8A9E',
    marginRight: 6,
  },
  modeValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00E5FF',
  },
  readyInstructions: {
    fontSize: 14,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 35,
  },
  readyBtn: {
    width: '100%',
    maxWidth: 280,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161625',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  headerColumn: {
    flex: 1.5,
  },
  headerColumnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerLabel: {
    fontSize: 9,
    color: '#8A8A9E',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  timerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  timerDanger: {
    borderColor: '#FF3131',
    backgroundColor: 'rgba(255, 49, 49, 0.1)',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00E5FF',
  },
  timerDangerText: {
    color: '#FF3131',
    textShadowColor: '#FF3131',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  roundsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  roundsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF007F',
  },
  roundsLabel: {
    fontSize: 8,
    color: '#8A8A9E',
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pausedOverlay: {
    width: '100%',
    maxWidth: 340,
    height: 380,
    backgroundColor: '#161625',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  pausedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    letterSpacing: 2,
    textShadowColor: '#00E5FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  actionsFooter: {
    backgroundColor: '#0C0C14',
    paddingBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  actionBtn: {
    flex: 1,
  },
  scoreBtn: {
    width: '100%',
    paddingVertical: 18,
    marginVertical: 10,
  },
  quitLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  quitLinkText: {
    fontSize: 11,
    color: '#8A8A9E',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 20,
  },
});
