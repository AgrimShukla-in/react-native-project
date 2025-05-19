import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import  COLORS from '../constants/colors'; // assuming you have your COLORS defined

// components/LoadingDots.jsx

export default function LoadingDots() {  // <— Capitalized!
  const animValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = animValues.map((anim, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 150),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );
    Animated.stagger(100, animations).start();
  }, [animValues]);

  return (
    <View style={styles.container}>
      {animValues.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
              transform: [
                {
                  scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.3] })
                }
              ]
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: COLORS.background },
  dot:       { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, marginHorizontal: 6 },
});
