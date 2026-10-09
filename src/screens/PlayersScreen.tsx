import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getSavedPlayers, saveSavedPlayers } from '../services/storage';
import { NeonButton } from '../components/NeonButton';

interface PlayersScreenProps {
  onBack: () => void;
  onStartGame: (players: string[]) => void;
}

export const PlayersScreen: React.FC<PlayersScreenProps> = ({ onBack, onStartGame }) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadPlayers = async () => {
      const saved = await getSavedPlayers();
      setPlayers(saved);
    };
    loadPlayers();
  }, []);

  const handleAddPlayer = async () => {
    setErrorMsg('');
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('O nome do participante não pode ser vazio!');
      return;
    }
    if (players.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Este participante já foi adicionado!');
      return;
    }
    const updated = [...players, trimmed];
    setPlayers(updated);
    setName('');
    await saveSavedPlayers(updated);
  };

  const handleRemovePlayer = async (index: number) => {
    const updated = players.filter((_, idx) => idx !== index);
    setPlayers(updated);
    await saveSavedPlayers(updated);
  };

  const handleStart = () => {
    setErrorMsg('');
    if (players.length < 2) {
      setErrorMsg('Cadastre pelo menos 2 participantes para jogar!');
      return;
    }
    onStartGame(players);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>PARTICIPANTES</Text>
        <Text style={styles.subtitle}>Cadastre as pessoas que irão jogar esta partida.</Text>

        {/* Input Form */}
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>NOME DO JOGADOR</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome..."
              placeholderTextColor="#4E4E6A"
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleAddPlayer}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddPlayer}>
              <Text style={styles.addBtnText}>ADD</Text>
            </TouchableOpacity>
          </View>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        </View>

        {/* Players List */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>LISTA DE JOGADORES ({players.length})</Text>
          {players.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum jogador cadastrado.</Text>
            </View>
          ) : (
            players.map((playerName, index) => (
              <View key={`player-${index}`} style={styles.playerItem}>
                <View style={styles.playerIndexBg}>
                  <Text style={styles.playerIndex}>{index + 1}</Text>
                </View>
                <Text style={styles.playerName}>{playerName}</Text>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemovePlayer(index)}
                >
                  <Text style={styles.removeBtnText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <NeonButton
          title="Iniciar Jogo"
          onPress={handleStart}
          variant="green"
          style={styles.startBtn}
        />
        <NeonButton title="Voltar" onPress={onBack} variant="purple" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C14',
    paddingTop: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 170,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#39FF14',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#39FF14',
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
  formContainer: {
    backgroundColor: '#161625',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#39FF14',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#0C0C14',
    borderWidth: 1.2,
    borderColor: '#2C2C4E',
    borderRadius: 10,
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#39FF14',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#0C0C14',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#FF3131',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  listSection: {
    width: '100%',
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  emptyContainer: {
    backgroundColor: '#161625',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#8A8A9E',
    fontStyle: 'italic',
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161625',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  playerIndexBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderWidth: 1,
    borderColor: '#39FF14',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerIndex: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#39FF14',
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FF3131',
    backgroundColor: 'rgba(255, 49, 49, 0.05)',
    borderRadius: 8,
  },
  removeBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF3131',
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
  startBtn: {
    marginBottom: 4,
  },
});
