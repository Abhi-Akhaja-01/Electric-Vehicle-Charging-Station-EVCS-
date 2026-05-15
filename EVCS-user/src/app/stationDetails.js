import React from "react";
import { Image, StyleSheet, Text, View, ScrollView, Platform, StatusBar as RNStatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../theme/colors";
import Button from "../components/Button";
import { routes } from "../routes/routes";
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { StatusBar } from "expo-status-bar";

const StationDetail = () => {
  const stationDetails = useLocalSearchParams();
  const availablePlugs = stationDetails.plugs.split(",");
  const _map = React.useRef(null);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="auto" />
      {/* Sticky Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 10 }]}>
        <Ionicons name="arrow-back" size={28} color={colors.primary}
          onPress={() =>
            router.push({
              pathname: routes.station.index.path,
            })
          }
        />
        <Text style={styles.headerTitle}>Station Detail</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: stationDetails.stationImage.replaceAll("@", "%2F") }}
              style={styles.stationImage}
            />
          </View>
          <View style={styles.stationViewContainer}>
            <Text style={[styles.commonTitle, { textDecorationLine: "none" }]}>
              {stationDetails.stationName}
            </Text>
            <Text>{stationDetails.address}</Text>
          </View>
          <View style={styles.stationViewContainer}>
            <Text style={styles.commonTitle}>Available Plugs :</Text>
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              {availablePlugs.map((plug, i) => (
                <Text key={i} style={styles.plugs}>
                  {plug}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.stationViewContainer}>
            <Text style={styles.commonTitle}>Availability :</Text>
            <View style={{ flexDirection: "row" }}>
              <Text>{stationDetails.openTime}</Text>
              <Text> - {stationDetails.closeTime}</Text>
            </View>
          </View>
          <View style={styles.stationViewContainer}>
            <Text style={styles.commonTitle}>Price :</Text>
            <Text>{stationDetails.price}</Text>
          </View>
          <View style={styles.stationViewContainer}>
            <Text style={styles.commonTitle}>Location Details :</Text>
            <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
              <Text style={styles.labelText}>Address:</Text>
              <Text>{stationDetails.address}</Text>
            </View>
            <View style={styles.boxRow}>
              <Text style={styles.labelText}>City:</Text>
              <Text>{stationDetails.city}</Text>
            </View>
            <View style={styles.boxRow}>
              <Text style={styles.labelText}>State:</Text>
              <Text>{stationDetails.state}</Text>
            </View>
            <View style={{ height: 200, width: "100%", marginTop: 15, borderRadius: 10, overflow: 'hidden' }}>
              {!isNaN(Number(stationDetails.lat)) && !isNaN(Number(stationDetails.lng)) ? (
                <MapView
                  style={{ width: '100%', height: '100%' }}
                  initialRegion={{
                    latitude: Number(stationDetails.lat),
                    longitude: Number(stationDetails.lng),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={{ latitude: Number(stationDetails.lat), longitude: Number(stationDetails.lng) }} />
                </MapView>
              ) : (
                <View style={{ flex: 1, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' }}>
                  <Text>Location coordinates not available</Text>
                </View>
              )}
            </View>
          </View>
          <Button
            title="Book Slots"
            style={{ marginVertical: 20 }}
            onPress={() =>
              router.push({
                pathname: routes.slotBooking.index.name,
                params: stationDetails,
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    height: 220,
    width: "100%",
    marginBottom: 10,
  },
  stationImage: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
  },
  stationViewContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light,
  },
  commonTitle: {
    fontSize: 16,
    fontWeight: "800",
    paddingBottom: 10,
    color: colors.primary,
  },
  plugs: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    borderRadius: 8,
    fontWeight: '600',
  },
  labelText: {
    fontWeight: "800",
    color: '#555',
  },
  boxRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12
  },
});

export default StationDetail;
