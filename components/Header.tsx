import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  style,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

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
          >
            <ChevronLeft color={RIMAC_COLORS.white} size={28} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {rightAction ? (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={styles.rightAction}
            activeOpacity={0.7}
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
  },
  placeholder: {
    width: 44,
  },
});

export default Header;

