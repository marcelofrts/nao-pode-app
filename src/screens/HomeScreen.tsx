import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NeonButtonSolid, NeonButton } from '../components/NeonButton';

interface HomeScreenProps {
  onPlay: () => void;
  onCustomCards: () => void;
  onSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onPlay, onCustomCards, onSettings }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Glowing border text effect */}
        <Text style={styles.logoMain}>NÃO</Text>
        <Text style={styles.logoSub}>PODE</Text>
        <View style={styles.taglineBorder}>
          <Text style={styles.tagline}>O JOGO DAS PALAVRAS PROIBIDAS</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <NeonButtonSolid
          title="Jogar"
          onPress={onPlay}
          variant="green"
          style={styles.playBtn}
          textStyle={styles.playBtnText}
        />
        
        <NeonButton
          title="Minhas Cartas"
          onPress={onCustomCards}
          variant="pink"
          style={styles.menuBtn}
        />

        <NeonButton
          title="Configurações"
          onPress={onSettings}
          variant="purple"
          style={styles.menuBtn}
        />
      </View>

      <Text style={styles.version}>v1.0.0 • Feito para jogar com amigos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C14',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoMain: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FF3131',
    lineHeight: 72,
    letterSpacing: 4,
    textShadowColor: '#FF3131',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  logoSub: {
    fontSize: 64,
    fontWeight: '900',
    color: '#BB86FC',
    lineHeight: 64,
    letterSpacing: 6,
    textShadowColor: '#BB86FC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  taglineBorder: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(44, 44, 78, 0.2)',
  },
  tagline: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8A8A9E',
    letterSpacing: 2,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    marginVertical: 40,
  },
  playBtn: {
    paddingVertical: 18,
    marginBottom: 16,
  },
  playBtnText: {
    fontSize: 18,
    letterSpacing: 1.5,
  },
  menuBtn: {
    marginVertical: 6,
  },
  version: {
    fontSize: 12,
    color: '#4E4E6A',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
