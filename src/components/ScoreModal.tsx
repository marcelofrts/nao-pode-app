import React from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { NeonButton } from './NeonButton';

export interface Player {
  id: string;
  name: string;
  score: number;
}

interface ScoreModalProps {
  visible: boolean;
  players: Player[];
  passadorId: string;
  onSelectPlayer: (playerId: string) => void;
  onClose: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  visible,
  players,
  passadorId,
  onSelectPlayer,
  onClose,
}) => {
  // Filter out the passador because the passador is giving clues, so they can't guess it.
  const guessers = players.filter(p => p.id !== passadorId);
  const passadorName = players.find(p => p.id === passadorId)?.name || 'Passador';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>QUEM ACERTOU?</Text>
          <Text style={styles.subtitle}>
            Selecione o jogador que adivinhou a palavra. {passadorName} (passador) também ganhará 1 ponto!
          </Text>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {guessers.length === 0 ? (
              <Text style={styles.noPlayersText}>
                Nenhum outro jogador cadastrado. Adicione mais jogadores para poder pontuar!
              </Text>
            ) : (
              guessers.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerItem}
                  onPress={() => onSelectPlayer(player.id)}
                >
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>+1 PONTO</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <NeonButton
            title="Cancelar"
            onPress={onClose}
            variant="red"
            style={styles.cancelButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 12, 20, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    backgroundColor: '#161625',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#39FF14',
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: '#39FF14',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0B0',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  list: {
    width: '100%',
    maxHeight: 250,
    marginBottom: 16,
  },
  listContent: {
    paddingVertical: 4,
  },
  noPlayersText: {
    color: '#8A8A9E',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E34',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderWidth: 1.2,
    borderColor: '#39FF14',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#39FF14',
  },
  cancelButton: {
    width: '100%',
    marginTop: 10,
  },
});
