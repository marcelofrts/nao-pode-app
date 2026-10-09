import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Card } from '../data/defaultCards';

interface CardViewProps {
  card: Card;
  style?: ViewStyle;
}

export const CardView: React.FC<CardViewProps> = ({ card, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Target Word Header */}
      <View style={styles.targetContainer}>
        <Text style={styles.targetLabel}>PALAVRA PRINCIPAL</Text>
        <Text style={styles.targetWord}>{card.word}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Forbidden Words List */}
      <View style={styles.forbiddenContainer}>
        <Text style={styles.forbiddenLabel}>NÃO PODE DIZER:</Text>
        {card.forbidden.map((word, index) => (
          <View key={`${card.id}-forbidden-${index}`} style={styles.forbiddenWordRow}>
            <Text style={styles.forbiddenNumber}>{index + 1}</Text>
            <Text style={styles.forbiddenWord}>{word}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161625',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#BB86FC',
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  targetContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  targetLabel: {
    fontSize: 11,
    color: '#8A8A9E',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  targetWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF007F',
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: '#FF007F',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C4E',
    marginVertical: 18,
  },
  forbiddenContainer: {
    width: '100%',
  },
  forbiddenLabel: {
    fontSize: 12,
    color: '#FF3131',
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 14,
    textAlign: 'center',
    textShadowColor: '#FF3131',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  forbiddenWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E34',
    borderWidth: 1.5,
    borderColor: '#FF3131',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#FF3131',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  forbiddenNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3131',
    marginRight: 12,
    width: 18,
    textAlign: 'center',
  },
  forbiddenWord: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
