import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { routes } from "../../routes/routes";
import { router } from "expo-router";
import { colors } from "../../theme/colors";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/config";
import { Formik } from "formik";
import { LoginSchema } from "../../helpers/validation";
import showToast from "../../components/ToastMessage";
import { storeData } from "../../services/local";
import Loading from "../../components/Loader";
import { FontAwesome6 } from '@expo/vector-icons';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (values) => {
    const { email, password } = values;
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        storeData("user", JSON.stringify(user));
        storeData("token", user.stsTokenManager.accessToken);
        router.push(routes.home.index.path);
        showToast(
          "success",
          "Login SuccessFully",
          "User Logged in SuccessFully 🥳"
        );
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.message;
        showToast("error", "Login Error", errorMessage);
      });
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <KeyboardAvoidingView
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          {/* <Image
            source={require("../../assets/loginImage.jpg")}
            style={styles.image}
          /> */}
          <View style={{ alignItems:'center', marginBottom:30}}>
          <FontAwesome6 name="charging-station" size={150} color={colors.primary} />
          </View>
          <Text style={styles.title}>Welcome Back !</Text>
          <Text style={styles.description}>
            Please sign in to continue. Please sign in to continue. Please sign
            in to continue
          </Text>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={handleSignIn}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <>
                <View style={styles.inputContainer}>
                  <Input
                    style={styles.input}
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={errors.email}
                  />
                  <Input
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={errors.password}
                  />
                </View>
                <Button title="Sign In" onPress={handleSubmit} />
              </>
            )}
          </Formik>

          <Pressable
            style={styles.signUpLink}
            onPress={() => router.push(routes.auth.register.path)}
          >
            <Text style={styles.signUpText}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.darkerGray,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    borderColor: colors.gray,
  },
  signUpLink: {
    marginTop: 20,
  },
  signUpText: {
    color: "black",
    fontSize: 16,
  },
  image: {
    height: 300,
    width: "100%",
    objectFit: "contain",
  },
});

export default Login;
