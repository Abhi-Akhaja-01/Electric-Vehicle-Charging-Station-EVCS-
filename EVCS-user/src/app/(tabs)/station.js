import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import DefaultView from "../../components/DefaultView";
import { getFullCollection } from "../../services/firebase";
import Loader from "../../components/Loader";
import { colors } from "../../theme/colors";
import Card from "../../components/StationCard";
import { Stack, router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { routes } from "../../routes/routes";

const Station = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getStations = () => {
    setLoading(true);
    getFullCollection("stations")
      .then((stations) => {
        setStations(stations);
      })
      .catch((error) => {
        console.error("Error getting stations:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getStations();
  }, []);

  const filteredStations = stations.filter(station =>
    station.stationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {loading && <Loader />}
      <DefaultView>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "All station",
          headerTintColor: colors.white,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerLeft: (_props) => (
            <View style={{marginLeft:10}}>
            <Ionicons name="arrow-back" size={30} color={colors.white} onPress={()=>router.push(routes.home.index.path)} />
            </View>
          ),
        }}
      />
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search station..."
              onChangeText={setSearchTerm}
              value={searchTerm}
            />
          </View>
          {filteredStations.map((station) => (
            <Card key={station.id} station={station} />
          ))}
        </View>
      </DefaultView>
    </>
  );
};

export default Station;

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.gray,
  },
  searchInput: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth:1,
    borderColor:colors.primary
  },
  container: {
    padding: 20,
    backgroundColor: colors.overlay,
    marginBottom:50
  },
});
