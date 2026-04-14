import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import DefaultView from "../../components/DefaultView";
import { removeData, retrieveData } from "../../services/local";
import { router } from "expo-router";
import { routes } from "../../routes/routes";
import { useEffect, useState } from "react";
import { colors } from "../../theme/colors";

const Account = () => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    await removeData("user");
    await removeData("token");
    router.push(routes.auth.login.path);
  };
  const getUser = async () => {
    const currentUser = await retrieveData("user");
    setUser(currentUser);
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <DefaultView style={{ padding: 20 }}>
      <View
        style={{
          padding: 20,
          borderWidth: 0.5,
          borderColor: colors.primary + 50,
          borderRadius: 7,
          marginBottom: 20,
          backgroundColor: colors.primary
        }}
      >
        <View style={styles.userLogo}>
          <Text style={styles.logoText}>
            {JSON.parse(user)?.email.slice(0, 1)}
          </Text>
        </View>
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {JSON.parse(user)?.email}
        </Text>
      </View>
      <Pressable
        style={styles.row}
        onPress={() => router.push(routes.myPayments.index.name)}
      >
        <MaterialIcons name="payment" size={24} color={colors.primary} />
        <Text style={styles.rowText}>My Payments</Text>
      </Pressable>
      <Pressable style={[styles.row, { borderBottomWidth: 1 }]} onPress={() => Linking.openURL(`tel:8200363641`)}>
        <MaterialIcons name="support-agent" size={24} color={colors.primary} />
        <Text style={[styles.rowText, { marginLeft: 7 }]}>Contact Us</Text>
      </Pressable>
      <Pressable style={[styles.row, { borderBottomWidth: 1 }]} onPress={logout}>
        <SimpleLineIcons name="logout" size={18} color={colors.primary} />
        <Text style={[styles.rowText, { marginLeft: 7 }]}>Logout</Text>
      </Pressable>
    </DefaultView>
  );
};

export default Account;

const styles = StyleSheet.create({
  logoText: {
    fontSize: 30,
    textTransform: "uppercase",
  },
  userLogo: {
    height: 80,
    width: 80,
    borderRadius: 100,
    backgroundColor: colors.white,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  rowText: {
    fontWeight: "bold",
    color: colors.primary,
  },
});
