import { ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const Loader = () => {
  return (
    <ActivityIndicator
      style={styles.loader}
      size="large"
      color={colors.primary}
    />
  );
};
export default Loader;

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    margin: "auto",
    zIndex: 2,
    backgroundColor: colors.overlay,
    height: "100%",
    width: "100%",
  },
});
