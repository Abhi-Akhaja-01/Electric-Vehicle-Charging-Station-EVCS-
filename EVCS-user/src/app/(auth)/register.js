import React, { useState } from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { Formik } from "formik";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { router } from "expo-router";
import { routes } from "../../routes/routes";
import { colors } from "../../theme/colors";
import { auth } from "../../services/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { RegisterSchema } from "../../helpers/validation";
import DefaultView from "../../components/DefaultView";
import showToast from "../../components/ToastMessage";
import { storeData } from "../../services/local";
import Loader from "../../components/Loader";
import { createCollection } from "../../services/firebase";
import { FontAwesome6 } from '@expo/vector-icons';

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async ({ email, password, displayName }) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createCollection("users", user.uid, {
        uid: user.uid,
        email,
        displayName,
      });
      showToast(
        "success",
        "Register Successfully",
        "User registered successfully 🥳"
      );
      await storeData("user", JSON.stringify(user));
      await storeData("token", user.stsTokenManager.accessToken);
      router.push(routes.home.index.path);
    } catch (error) {
      showToast("error", "Register Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <KeyboardAvoidingView
        style={styles.container}
      >
        <DefaultView style={styles.innerContainer}>
                <View style={{ alignItems:'center', marginBottom:30, marginTop:60}}>
          <FontAwesome6 name="charging-station" size={150} color={colors.primary} />
          </View>
          <Text style={styles.title}>Sign Up !</Text>
          <Text style={styles.description}>
            Please sign in to continue. Please sign in to continue. Please sign
            in to continue
          </Text>
          <Formik
            initialValues={{
              displayName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSignUp}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <>
                <Input
                  style={styles.input}
                  placeholder="Name"
                  value={values.displayName}
                  onChangeText={handleChange("displayName")}
                  onBlur={handleBlur("displayName")}
                  error={errors.displayName}
                />

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
                <Input
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  error={errors.confirmPassword}
                />
                <Button title="Sign Up" onPress={handleSubmit} />
              </>
            )}
          </Formik>

          <Pressable
            style={styles.signUpLink}
            onPress={() => router.push(routes.auth.login.path)}
          >
            <Text style={styles.signUpText}>
              Already Have an account? Sign In
            </Text>
          </Pressable>
        </DefaultView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    display:'flex',
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
    paddingVertical: 20,
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

export default Register;
