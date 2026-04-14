import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { router } from "expo-router";
import { routes } from "../routes/routes";

const Card = ({ station }) => (
  <Pressable
    style={styles.card}
    onPress={() =>
      router.push({
        pathname: routes.stationDetails.index.path,
        params: {
          ...station,
          slotsBooked: JSON.stringify(station.slotsBooked),
          stationImage: station.stationImage.replaceAll("%2F", "@"),
        },
      })
    }
  >
    <Image
      source={{ uri: station.stationImage }}
      resizeMode="cover"
      style={styles.image}
    />
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{station.stationName}</Text>
        <MaterialCommunityIcons
          name="google-circles-group"
          size={25}
          color="black"
        />
      </View>
      <Text style={styles.location}>
        {station.address}, {station.city}, {station.state} - {station.pinCode}
      </Text>
      <Text style={styles.location}>
        Open: {station.openTime} - Close: {station.closeTime}
      </Text>
      <View style={styles.chipsContainer}>
        {station.plugs.map((plug, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{plug}</Text>
          </View>
        ))}
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 6,
    marginVertical: 10,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 15,
    borderRadius: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 13,
    marginBottom: 5,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  chip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  chipText: {
    fontSize: 14,
    color: colors.white,
  },
});

export default Card;
