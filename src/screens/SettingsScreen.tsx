import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { getGameSettings, saveGameSettings, GameSettings } from '../services/storage';
import { NeonButton } from '../components/NeonButton';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'time',
    defaultTime: 60,
    cardsPerRound: 10,
  });

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await getGameSettings();
      setSettings(saved);
    };
    loadSettings();
  }, []);

  const handleSave = async (updatedSettings: GameSettings) => {
    setSettings(updatedSettings);
    await saveGameSettings(updatedSettings);
  };

  const adjustTime = (amount: number) => {
    const newTime = Math.max(10, Math.min(300, settings.defaultTime + amount));
    handleSave({ ...settings, defaultTime: newTime });
  };

  const adjustCards = (amount: number) => {
    const newCards = Math.max(1, Math.min(50, settings.cardsPerRound + amount));
    handleSave({ ...settings, cardsPerRound: newCards });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>CONFIGURAÇÕES</Text>

        {/* Game Mode Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MODALIDADE DE JOGO</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                settings.mode === 'time' && styles.modeButtonActivePurple,
              ]}
              onPress={() => handleSave({ ...settings, mode: 'time' })}
            >
              <Text
                style={[
                  styles.modeText,
                  settings.mode === 'time' && styles.modeTextActive,
                ]}
              >
                POR TEMPO
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                settings.mode === 'rounds' && styles.modeButtonActivePink,
              ]}
              onPress={() => handleSave({ ...settings, mode: 'rounds' })}
            >
              <Text
                style={[
                  styles.modeText,
                  settings.mode === 'rounds' && styles.modeTextActive,
                ]}
              >
                POR RODADAS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Controls based on selected mode */}
        {settings.mode === 'time' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TEMPO DA RODADA</Text>
            <Text style={styles.subtext}>Tempo disponível para cada passador dar dicas.</Text>
            <View style={styles.adjustmentContainer}>
              <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(-10)}>
                <Text style={styles.adjustBtnText}>-10s</Text>
              </TouchableOpacity>
              <Text style={styles.valueText}>{settings.defaultTime}s</Text>
              <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(10)}>
                <Text style={styles.adjustBtnText}>+10s</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RODADAS POR TURNO</Text>
            <Text style={styles.subtext}>Quantidade de cartas que cada passador deve jogar no seu turno.</Text>
            <View style={styles.adjustmentContainer}>
              <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustCards(-1)}>
                <Text style={styles.adjustBtnText}>-1</Text>
              </TouchableOpacity>
              <Text style={styles.valueText}>{settings.cardsPerRound} Cartas</Text>
              <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustCards(1)}>
                <Text style={styles.adjustBtnText}>+1</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Dica de Jogo</Text>
          <Text style={styles.infoBody}>
            Em ambos os modos, quando a rodada termina, a pontuação é exibida e o celular deve ser passado para o próximo jogador.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <NeonButton title="Voltar" onPress={onBack} variant="purple" />
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BB86FC',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
    textShadowColor: '#BB86FC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  section: {
    backgroundColor: '#161625',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtext: {
    fontSize: 13,
    color: '#8A8A9E',
    marginBottom: 16,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#4E4E6A',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(78, 78, 106, 0.05)',
  },
  modeButtonActivePurple: {
    borderColor: '#BB86FC',
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
  },
  modeButtonActivePink: {
    borderColor: '#FF007F',
    backgroundColor: 'rgba(255, 0, 127, 0.1)',
  },
  modeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A8A9E',
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  adjustmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  adjustBtn: {
    width: 60,
    height: 44,
    borderWidth: 1.2,
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00E5FF',
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.2)',
    backgroundColor: 'rgba(187, 134, 252, 0.02)',
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#BB86FC',
    marginBottom: 6,
  },
  infoBody: {
    fontSize: 13,
    color: '#8A8A9E',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0C0C14',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#161625',
  },
});
