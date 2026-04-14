import { StyleSheet, Text, TextInput } from "react-native";
import React from "react";
import { colors } from "../theme/colors";

const Input = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
  error = "",
}) => {
  return (
    <>
      <TextInput
        style={[
          input.inputContainer,
          style,
          {
            borderColor: error ? "#FF3333" : colors.gray,
            shadowColor: error ? "#FF333390" : "#0006",
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={input.error}>{error}</Text>}
    </>
  );
};

export default Input;

const input = StyleSheet.create({
  inputContainer: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
    backgroundColor: colors.white,
  },
  error: {
    color: "#FF3333",
    fontSize: 13,
    marginTop: -13,
    marginBottom: 12,
    left: 4,
  },
});
