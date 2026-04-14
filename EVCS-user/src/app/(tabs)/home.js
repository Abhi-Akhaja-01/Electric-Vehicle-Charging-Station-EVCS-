import React, {useEffect, useMemo, useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
  Alert,
  Linking
} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";

import {colors} from "../../theme/colors";
import Loader from "../../components/Loader";
import {getFullCollection} from "../../services/firebase";
import Feather from "@expo/vector-icons/Feather";
import {router} from "expo-router";
import {routes} from "../../routes/routes";

const {width, height} = Dimensions.get("window");
const CARD_HEIGHT = 250;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const Home = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [state, setState] = useState({
    markers: [],
    region: {
      latitude: 22.62938671242907,
      longitude: 88.4354486029795,
      latitudeDelta: 10.04864195044303443,
      longitudeDelta: 10.040142817690068
    }
  });

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      let userCoords = null;
      try {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          userCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          };
          setUserLocation(userCoords);
          setState((prev) => ({
            ...prev,
            region: {
              latitude: userCoords.latitude,
              longitude: userCoords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }
          }));
          _map.current?.animateToRegion(
            {
              ...userCoords,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            },
            1000
          );
        } else {
          Alert.alert(
            "Location Permission Needed",
            "Please allow location access to show your position on the map.",
            [
              {
                text: "Cancel",
                onPress: () => {
                  // fallback to first station
                  getStations(null); // fallback without userCoords
                },
                style: "cancel"
              },
              {
                text: "Allow",
                onPress: () => {
                  Linking.openSettings(), getStations(null);
                }
              }
            ],
            {cancelable: false}
          );
          return;
        }

        // After location (whether success or not), get stations
        getStations(userCoords);
      } catch (error) {
        console.log("Location error:", error);
        getStations(null); // fallback
      }
    };

    initialize();
  }, []);

  const getStations = (userCoords = null) => {
    getFullCollection("stations")
      .then((stations) => {
        setStations(stations);

        const markers = stations.map((data) => ({
          coordinate: {
            latitude: data.lat,
            longitude: data.lng
          }
        }));

        let region = null;

        if (userCoords) {
          region = {
            ...userCoords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          };
        } else if (stations.length > 0) {
          region = {
            latitude: stations[0].lat,
            longitude: stations[0].lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          };
          _map.current?.animateToRegion(region, 1000);
        }

        setState({
          markers,
          region: region || state.region
        });
      })
      .catch((error) => {
        console.error("Error getting stations:", error);
      })
      .finally(() => {
        setLoading(false); // Loader ends here
      });
  };

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    mapAnimation.addListener(({value}) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= state.markers.length) {
        index = state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const {coordinate} = state.markers[index];
          // console.log("coordinate", coordinate);
          _map.current.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: state.region.latitudeDelta,
              longitudeDelta: state.region.longitudeDelta
            },
            2000
          );
        }
      }, 10);
    });
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;
    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }
    _scrollView.current.scrollTo({x: x, y: 0, animated: true});
  };

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

  const interpolations =
    state.markers.length > 0 &&
    state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH
      ];

      const scale = mapAnimation.interpolate({
        inputRange,
        outputRange: [1, 1.5, 1],
        extrapolate: "clamp"
      });

      return {scale};
    });

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <Pressable
        style={styles.searchContainer}
        onPress={() => router.push(routes.station.index.path)}
      >
        <Text style={{color: colors.black + 50}}>Search station...</Text>
        <Feather name="search" size={20} color={colors.black + 50} />
      </Pressable>
      <MapView
        ref={_map}
        initialRegion={state.region}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={true}
      >
        {stations.length > 0 &&
          stations.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index]?.scale || 1
                }
              ]
            };
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.lat,
                  longitude: marker.lng
                }}
                onPress={(e) => onMarkerPress(e)}
                description={marker.description}
                title={marker.title}
              >
                <Animated.View style={[styles.markerWrap]}>
                  <Animated.Image
                    source={{
                      uri: "https://static.vecteezy.com/system/resources/previews/035/635/295/original/ev-charging-station-map-icon-free-png.png"
                    }}
                    style={[styles.marker, scaleStyle]}
                    resizeMode="contain"
                  />
                </Animated.View>
              </Marker>
            );
          })}
        {userLocation && (
          <Marker coordinate={userLocation} title="You" pinColor="blue" />
        )}
      </MapView>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 30}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation
                }
              }
            }
          ],
          {useNativeDriver: true}
        )}
      >
        {stations.map((station, index) => (
          <View style={styles.card} key={index}>
            <Image
              source={{uri: station.stationImage}}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>
                {station.stationName}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {station.address}
              </Text>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: routes.stationDetails.index.path,
                      params: {
                        ...station,
                        slotsBooked: JSON.stringify(station.slotsBooked),
                        stationImage: station.stationImage.replaceAll(
                          "%2F",
                          "@"
                        )
                      }
                    })
                  }
                  style={[
                    styles.bookNow,
                    {
                      borderColor: colors.primary,
                      borderWidth: 1
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: "#ffff"
                      }
                    ]}
                  >
                    Book Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    paddingVertical: 10
    // backgroundColor: colors.overlay,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    borderRadius: 7,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    padding: 10,
    elevation: 10
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    objectFit: "cover",
    borderRadius: 6
  },
  textContent: {
    flex: 2
  },
  cardtitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
    marginTop: 5
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50
  },
  marker: {
    width: 30,
    height: 30
  },
  button: {
    alignItems: "center",
    marginTop: 5
  },
  bookNow: {
    width: "100%",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: colors.primary
  },
  textSign: {
    fontSize: 14,
    fontWeight: "bold"
  },
  searchContainer: {
    position: "absolute",
    height: 50,
    width: width - 40,
    alignSelf: "center",
    backgroundColor: colors.white,
    top: 50,
    zIndex: 100,
    borderRadius: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.primary + 40
  }
});
