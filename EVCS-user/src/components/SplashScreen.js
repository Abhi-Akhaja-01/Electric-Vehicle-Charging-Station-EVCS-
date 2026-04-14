import React, { useRef, useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const  CustomSplashScreen = () => {
  const animation = useRef(null);
  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#FFF',
        }}
        source={require('../assets/lottie/splash.json')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default CustomSplashScreen
