import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Player } from '../components/ScoreModal';
import { NeonButton, NeonButtonSolid } from '../components/NeonButton';

interface TurnSummaryScreenProps {
  players: Player[];
  passadorIndex: number;
  correctCount: number;
  onNextTurn: () => void;
  onQuit: () => void;
}

export const TurnSummaryScreen: React.FC<TurnSummaryScreenProps> = ({
  players,
  passadorIndex,
  correctCount,
  onNextTurn,
  onQuit,
}) => {
  const passador = players[passadorIndex];

  // Sort players by score descending to display the ranking
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score);
  const highestScore = rankedPlayers[0]?.score || 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>FIM DE TURNO</Text>
        <Text style={styles.subtitle}>Rodada encerrada para o passador atual.</Text>

        {/* Turn Summary Box */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>RESUMO DO TURNO</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Passador:</Text>
            <Text style={styles.summaryValue}>{passador.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Palavras acertadas:</Text>
            <Text style={[styles.summaryValue, { color: '#39FF14' }]}>{correctCount}</Text>
          </View>
        </View>

        {/* Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.leaderboardTitle}>CLASSIFICAÇÃO GERAL</Text>
          {rankedPlayers.map((player, idx) => {
            const isLeader = player.score > 0 && player.score === highestScore;
            return (
              <View
                key={player.id}
                style={[
                  styles.rankItem,
                  isLeader && styles.rankItemLeader,
                ]}
              >
                <View style={styles.rankLeft}>
                  <Text style={[styles.rankNumber, isLeader && styles.rankNumberLeader]}>
                    #{idx + 1}
                  </Text>
                  <Text style={[styles.playerName, isLeader && styles.playerNameLeader]}>
                    {player.name}
                  </Text>
                  {isLeader && <Text style={styles.leaderBadge}>👑 LÍDER</Text>}
                </View>
                <Text style={[styles.playerScore, isLeader && styles.playerScoreLeader]}>
                  {player.score} {player.score === 1 ? 'pt' : 'pts'}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <NeonButtonSolid
          title="Próximo Jogador"
          onPress={onNextTurn}
          variant="green"
          style={styles.nextBtn}
        />
        <NeonButton
          title="Finalizar Jogo"
          onPress={onQuit}
          variant="red"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C14',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BB86FC',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#BB86FC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8A9E',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#161625',
    borderWidth: 1.5,
    borderColor: '#BB86FC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#BB86FC',
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#8A8A9E',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  leaderboardSection: {
    width: '100%',
  },
  leaderboardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161625',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  rankItemLeader: {
    borderColor: '#39FF14',
    backgroundColor: 'rgba(57, 255, 20, 0.03)',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A8A9E',
    marginRight: 10,
    width: 20,
  },
  rankNumberLeader: {
    color: '#39FF14',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playerNameLeader: {
    color: '#39FF14',
    fontWeight: 'bold',
  },
  leaderBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#39FF14',
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderWidth: 0.8,
    borderColor: '#39FF14',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  playerScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerScoreLeader: {
    color: '#39FF14',
    textShadowColor: '#39FF14',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0C0C14',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#161625',
    gap: 8,
  },
  nextBtn: {
    marginBottom: 4,
  },
});
