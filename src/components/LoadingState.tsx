// أَعُوذُ بِٱللَّهِ مِنْ الْشَيْطَانٍ الْرَجِيمٍ ✧ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✧ اعوز بالله من الشياطين و ان يحضرون ✧ بسم الله الرحمن الرحيم ✧ الله لا إله إلا هو الحي القيوم 
// Bismillahi ar-Rahmani ar-Rahim Audhu billahi min ash-shayatin wa an yahdurun Bismillah ar-Rahman ar-Rahim Allah la ilaha illa huwa al-hayy al-qayyum. Tamsa Allahu ala ayunihim
// version: 1.0.0
// ======================================================
// - Bismel1Mobile
// - Gusgraph
// - Author: Gus Kazem
// - https://Gusgraph.com
// - File Path: LoadingState.tsx - src/components/LoadingState.tsx
// =====================================================
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const scan = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          duration: 1401,
          easing: Easing.inOut(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(scan, {
          duration: 701,
          easing: Easing.inOut(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    const rotationLoop = Animated.loop(
      Animated.timing(rotation, {
        duration: 1801,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    );

    scanLoop.start();
    rotationLoop.start();

    return () => {
      scanLoop.stop();
      rotationLoop.stop();
    };
  }, [rotation, scan]);

  const scanTranslate = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-47, 47],
  });
  const outerRotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const middleRotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });
  const innerRotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.botCore}>
          <View style={styles.coreRing}>
            <Animated.View style={[styles.orbitRing, styles.orbitOuter, { transform: [{ rotate: outerRotate }] }]} />
            <Animated.View style={[styles.orbitRing, styles.orbitMiddle, { transform: [{ rotate: middleRotate }] }]} />
            <Animated.View style={[styles.orbitRing, styles.orbitInner, { transform: [{ rotate: innerRotate }] }]} />
            <View style={styles.coreDot} />
          </View>
          <View style={styles.signalStack}>
            <View style={[styles.signalBar, styles.signalShort]} />
            <View style={[styles.signalBar, styles.signalMid]} />
            <View style={[styles.signalBar, styles.signalLong]} />
          </View>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.scanLine, { transform: [{ translateX: scanTranslate }] }]} />
          <View style={styles.marketBars}>
            <View style={[styles.marketBar, styles.marketBarOne]} />
            <View style={[styles.marketBar, styles.marketBarTwo]} />
            <View style={[styles.marketBar, styles.marketBarThree]} />
            <View style={[styles.marketBar, styles.marketBarFour]} />
            <View style={[styles.marketBar, styles.marketBarFive]} />
          </View>
        </View>
        <Text style={styles.text}>{label}</Text>
        <Text style={styles.subText}>Scanning secure market data</Text>
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 19,
  },
  panel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 15,
    borderWidth: 1,
    gap: 9,
    overflow: 'hidden',
    paddingHorizontal: 19,
    paddingVertical: 17,
    width: '100%',
  },
  botCore: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
  },
  coreRing: {
    alignItems: 'center',
    backgroundColor: colors.accentMuted,
    borderColor: colors.cyan,
    borderRadius: 23,
    borderWidth: 1,
    height: 47,
    justifyContent: 'center',
    shadowColor: colors.cyan,
    shadowOpacity: 0.37,
    shadowRadius: 17,
    width: 47,
  },
  orbitRing: {
    borderRadius: 23,
    borderWidth: 1,
    position: 'absolute',
  },
  orbitOuter: {
    borderBottomColor: colors.success,
    borderLeftColor: 'transparent',
    borderRightColor: colors.cyan,
    borderTopColor: 'transparent',
    height: 37,
    width: 37,
  },
  orbitMiddle: {
    borderBottomColor: 'transparent',
    borderLeftColor: colors.purple,
    borderRightColor: 'transparent',
    borderTopColor: colors.success,
    height: 29,
    width: 29,
  },
  orbitInner: {
    borderBottomColor: colors.cyan,
    borderLeftColor: 'transparent',
    borderRightColor: colors.magenta,
    borderTopColor: 'transparent',
    height: 19,
    width: 19,
  },
  coreDot: {
    backgroundColor: colors.cyan,
    borderColor: colors.success,
    borderRadius: 5,
    borderWidth: 1,
    height: 9,
    shadowColor: colors.success,
    shadowOpacity: 0.73,
    shadowRadius: 11,
    width: 9,
  },
  signalStack: {
    gap: 5,
  },
  signalBar: {
    backgroundColor: colors.success,
    borderRadius: 9,
    height: 5,
  },
  signalShort: {
    opacity: 0.55,
    width: 27,
  },
  signalMid: {
    opacity: 0.73,
    width: 43,
  },
  signalLong: {
    opacity: 0.91,
    width: 61,
  },
  track: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    height: 37,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 137,
  },
  scanLine: {
    backgroundColor: colors.cyan,
    borderRadius: 9,
    height: 29,
    opacity: 0.23,
    position: 'absolute',
    width: 17,
  },
  marketBars: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 7,
  },
  marketBar: {
    borderRadius: 7,
    width: 7,
  },
  marketBarOne: {
    backgroundColor: colors.cyan,
    height: 13,
  },
  marketBarTwo: {
    backgroundColor: colors.success,
    height: 23,
  },
  marketBarThree: {
    backgroundColor: colors.purple,
    height: 17,
  },
  marketBarFour: {
    backgroundColor: colors.success,
    height: 29,
  },
  marketBarFive: {
    backgroundColor: colors.cyan,
    height: 19,
  },
  text: {
    color: colors.text,
    fontSize: typography.label,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  subText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
});
