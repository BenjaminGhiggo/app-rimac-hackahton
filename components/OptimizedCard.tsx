import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';

interface OptimizedCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'outline';
  style?: ViewStyle;
}

const OptimizedCardComponent: React.FC<OptimizedCardProps> = ({
  children,
  variant = 'glass',
  style,
}) => {
  const memoizedChildren = useMemo(() => children, [children]);

  if (variant === 'glass') {
    return (
      <View style={[styles.cardContainer, style]}>
        <BlurView intensity={80} tint="light" style={styles.glassCard}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.glassGradient}
          >
            {memoizedChildren}
          </LinearGradient>
        </BlurView>
      </View>
    );
  }

  if (variant === 'outline') {
    return (
      <View style={[styles.cardContainer, styles.outlineCard, style]}>
        {memoizedChildren}
      </View>
    );
  }

  return (
    <View style={[styles.cardContainer, styles.solidCard, style]}>
      {memoizedChildren}
    </View>
  );
};

export const OptimizedCard = React.memo(OptimizedCardComponent);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  glassCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  glassGradient: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  outlineCard: {
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
    padding: SPACING.lg,
    backgroundColor: RIMAC_COLORS.white,
  },
  solidCard: {
    backgroundColor: RIMAC_COLORS.white,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default OptimizedCard;

