import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

type NeonVariant = 'purple' | 'pink' | 'green' | 'red' | 'cyan' | 'gray';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: NeonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const COLORS = {
  purple: { border: '#BB86FC', text: '#BB86FC', bg: 'rgba(187, 134, 252, 0.1)' },
  pink: { border: '#FF007F', text: '#FF007F', bg: 'rgba(255, 0, 127, 0.1)' },
  green: { border: '#39FF14', text: '#39FF14', bg: 'rgba(57, 255, 20, 0.1)' },
  red: { border: '#FF3131', text: '#FF3131', bg: 'rgba(255, 49, 49, 0.1)' },
  cyan: { border: '#00E5FF', text: '#00E5FF', bg: 'rgba(0, 229, 255, 0.1)' },
  gray: { border: '#4E4E6A', text: '#8A8A9E', bg: 'rgba(78, 78, 106, 0.1)' },
};

const SOLID_COLORS = {
  purple: { bg: '#BB86FC', text: '#0C0C14' },
  pink: { bg: '#FF007F', text: '#0C0C14' },
  green: { bg: '#39FF14', text: '#0C0C14' },
  red: { bg: '#FF3131', text: '#FFFFFF' },
  cyan: { bg: '#00E5FF', text: '#0C0C14' },
  gray: { bg: '#4E4E6A', text: '#FFFFFF' },
};

export const NeonButton: React.FC<NeonButtonProps> = ({
  title,
  onPress,
  variant = 'purple',
  style,
  textStyle,
  disabled = false,
}) => {
  const currentColors = disabled ? COLORS.gray : COLORS[variant];
  const activeOpacity = disabled ? 1 : 0.7;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={activeOpacity}
      style={[
        styles.button,
        {
          borderColor: currentColors.border,
          backgroundColor: currentColors.bg,
          shadowColor: currentColors.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: currentColors.text }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const NeonButtonSolid: React.FC<NeonButtonProps> = ({
  title,
  onPress,
  variant = 'purple',
  style,
  textStyle,
  disabled = false,
}) => {
  const currentColors = disabled ? SOLID_COLORS.gray : SOLID_COLORS[variant];
  const borderColors = disabled ? COLORS.gray : COLORS[variant];
  const activeOpacity = disabled ? 1 : 0.7;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={activeOpacity}
      style={[
        styles.button,
        {
          borderColor: borderColors.border,
          backgroundColor: currentColors.bg,
          shadowColor: borderColors.border,
          borderWidth: 0,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: currentColors.text, fontWeight: 'bold' }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
