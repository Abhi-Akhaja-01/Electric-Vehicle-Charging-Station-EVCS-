import { Stack } from "expo-router";
import { colors } from "../theme/colors";

export default () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="stationDetails" />
      <Stack.Screen name="slotBooking" />

    </Stack>
  );
};
