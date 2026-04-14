import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  Dimensions,
} from "react-native";
import { colors } from "../theme/colors";

const Button = (props) => {
  const { onPress, title, disabled = false, loading, loadingMessage } = props;
  const [translateValue] = React.useState(new Animated.Value(0));
  const WIDTH = Dimensions.get("screen").width;

  const loadingPosition = useRef(null);

  const toggleAnimation = () => {
    const toValue = loadingPosition.current === 0 ? WIDTH - 125 : 0;
    Animated.timing(translateValue, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
    loadingPosition.current = toValue;
  };

  useEffect(() => {
    let intervalId = null;
    if (loading) {
      toggleAnimation();
      intervalId = setInterval(() => {
        toggleAnimation();
      }, 500);
    } else {
      clearInterval(intervalId);
    }
  }, [loading]);

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      style={[styles.button, { ...props.style, opacity: disabled || loading ? 0.5 : 1 }]}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading && (
        <Animated.View
          style={[
            styles.animationView,
            {
              transform: [{ translateX: translateValue }],
            },
          ]}
        >
          <View style={styles.animationInnerView} />
        </Animated.View>
      )}
      <Text style={[styles.buttonText,{...props.textStyle}]}>
        {loading ? loadingMessage || "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 13,
    height:48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent:"center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  animationView: {
    width: 50,
    position: "absolute",
    alignItems: "center",
    left: 0,
    bottom: 1,
  },
  animationInnerView: {
    width: "100%",
    backgroundColor: colors.white,
    height: 3,
    borderRadius: 2,
  },
});

export default Button;
