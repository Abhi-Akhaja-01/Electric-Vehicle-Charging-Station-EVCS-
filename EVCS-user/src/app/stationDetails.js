import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import DefaultView from "../components/DefaultView";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../theme/colors";
import Button from "../components/Button";
import { routes } from "../routes/routes";
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const StationDetail = () => {
  const stationDetails = useLocalSearchParams();
  const availablePlugs = stationDetails.plugs.split(",");
  const _map = React.useRef(null);

  return (
    <DefaultView style={styles.container}>
      <View style={{flexDirection:'row', alignContent:'center', gap:15, paddingBottom:20, alignItems:'center'}}>
      <Ionicons name="arrow-back" size={30} color={colors.primary} 
          onPress={() =>
            router.push({
              pathname: routes.station.index.path,
            })
          }
      />
        <Text style={{fontSize:20, fontWeight:'bold', color:colors.primary}}>Station Detail</Text>
      </View>
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
        style={{ marginVertical: 10 }}
        onPress={() =>
          router.push({
            pathname: routes.slotBooking.index.name,
            params: stationDetails,
          })
        }
      />
    </DefaultView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  imageContainer: {
    height: 200,
    width: "100%",
  },
  stationImage: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
  },
  stationViewContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  commonTitle: {
    fontSize: 16,
    fontWeight: "800",
    paddingBottom: 10,
    textDecorationLine: "underline",
  },
  plugs: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 13,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.primary,
  },
  labelText: {
    fontWeight: "800",
  },
  boxRow: { flexDirection: "row", gap: 5, flexWrap: "wrap", marginTop: 10 },
  mapContainer: {
    height: 100,
    width: "100%",
  },
});

export default StationDetail;
