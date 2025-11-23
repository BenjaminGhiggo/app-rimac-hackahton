import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';

interface OptimizedHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  style?: ViewStyle;
}

const OptimizedHeaderComponent: React.FC<OptimizedHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  style,
}) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <LinearGradient
      colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <View style={styles.content}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={10}
          >
            <ChevronLeft color={RIMAC_COLORS.white} size={28} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction ? (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={styles.rightAction}
            activeOpacity={0.7}
            hitSlop={10}
          >
            {rightAction.icon}
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </LinearGradient>
  );
};

export const OptimizedHeader = React.memo(OptimizedHeaderComponent);

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  rightAction: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  placeholder: {
    width: 44,
  },
});

export default OptimizedHeader;

