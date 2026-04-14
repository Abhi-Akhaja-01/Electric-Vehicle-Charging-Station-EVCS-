import { StyleSheet, View, ScrollView, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const DefaultView = ({ children, style }) => {
  return (
    <SafeAreaProvider style={{...style, backgroundColor:colors.white }}>
      <StatusBar style="auto"/>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          <View>{children}</View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    height: "100%",
    backgroundColor:colors.white
  },
});

export default DefaultView;
