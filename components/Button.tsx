import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const handlePress = useCallback(() => {
    if (!loading && !disabled) {
      onPress();
    }
  }, [loading, disabled, onPress]);

  const sizeStyles: Record<string, any> = {
    sm: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      fontSize: 12,
    },
    md: {
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      fontSize: 14,
    },
    lg: {
      paddingHorizontal: SPACING['2xl'],
      paddingVertical: SPACING.lg,
      fontSize: 16,
    },
  };

  const variantStyles: Record<string, any> = {
    primary: {
      colors: [RIMAC_COLORS.primary, RIMAC_COLORS.primaryLight] as const,
      textColor: RIMAC_COLORS.white,
    },
    secondary: {
      colors: [RIMAC_COLORS.primaryLight, RIMAC_COLORS.primary] as const,
      textColor: RIMAC_COLORS.white,
    },
    outline: {
      colors: [RIMAC_COLORS.white, RIMAC_COLORS.white] as const,
      textColor: RIMAC_COLORS.primary,
      borderColor: RIMAC_COLORS.primary,
    },
    ghost: {
      colors: ['transparent', 'transparent'] as const,
      textColor: RIMAC_COLORS.primary,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const buttonContent = (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        currentSize,
        variant === 'outline' && {
          borderWidth: 2,
          borderColor: currentVariant?.borderColor || RIMAC_COLORS.primary,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: currentVariant.textColor, fontSize: currentSize.fontSize },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (variant === 'outline' || variant === 'ghost') {
    return buttonContent;
  }

  return (
    <LinearGradient
      colors={currentVariant.colors as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, currentSize, style]}
    >
      {buttonContent}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
