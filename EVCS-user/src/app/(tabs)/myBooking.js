import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { collection, doc, getDocs, query, updateDoc, orderBy, limit } from "firebase/firestore";
import { firestore } from "../../services/config";
import { retrieveData } from "../../services/local";
import { colors } from "../../theme/colors";
import Button from "../../components/Button";
import showToast from "../../components/ToastMessage"; 

const WIDTH = Dimensions.get("screen").width;

const convertIntoDateString = (given_seconds) => {
  const timeString = new Date(given_seconds * 1000).toDateString();
  return timeString;
};
const MyBooking = () => {
  const [myBookingData, setMyBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const fetchMyBookingData = async () => {
    setLoading(true);
    try {
      const user = await retrieveData("user");
      const collectionRef = collection(
        firestore,
        `users/${JSON.parse(user).uid}/booking`
      );
      const q = query(collectionRef, orderBy("date", "desc"), limit(3));
      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setMyBookingData(documents);
      console.log("documents", documents.length);
    } catch (error) {
      console.error("Error getting documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookingData();
  }, []);

  const handleCancelRequest = async (data) => {
    try {
      const user = await retrieveData("user");
      setUpdatingBookingId(data.id);
      const docRef = doc(
        firestore,
        `users/${JSON.parse(user).uid}/booking/${data.id}`
      );
      await updateDoc(docRef, {
        ...data,
        status: "reject-request",
      });
      await fetchMyBookingData();
      showToast(
        "success",
        "Slot Cancel",
        "Your slot cancel request successfully submitted"
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {myBookingData.length >= 1 ? (
          <FlatList
            data={myBookingData}
            keyExtractor={(_, index) => index}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary + 50,
                  borderRadius: 10,
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <Button
                  title={
                    item.status === "reject-request"
                      ? "Cancel Requested"
                      : item.status === "cancelled"
                      ? "Cancelled"
                      : "Cancel"
                  }
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor:
                      item.status === "reject-request" ? "#FF000080" : "#fff3",
                    right: 13,
                    height: 25,
                    top: 14,
                    borderWidth: item.status === "reject-request" ? 1 : 0,
                    borderColor: "red",
                  }}
                  textStyle={{ fontWeight: "bold", fontSize: 11 }}
                  disabled={item.status === "cancelled"}
                  loading={updatingBookingId === item.id}
                  loadingMessage="Rejecting"
                  onPress={() => handleCancelRequest(item)}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    backgroundColor: colors.primary,
                    color: colors.white,
                    padding: 15,
                  }}
                >
                  {item.stationDetails.stationName}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginTop: 15,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.black,
                    }}
                  >
                    Scheduled Date :
                  </Text>
                  {/* {console.log("Date: ",item.date)} */}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.primary,
                    }}
                  >
                    {convertIntoDateString(item.date.seconds)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.black,
                    }}
                  >
                    Scheduled Time :
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.primary,
                    }}
                  >
                    {item.timing}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.black,
                    }}
                  >
                    Selected Plug :
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      backgroundColor: colors.primary,
                      color: colors.white,
                      padding: 5,
                      borderRadius: 5,
                    }}
                  >
                    {item.plug}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginBottom: 15,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.black,
                    }}
                  >
                    Payment Method :
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      backgroundColor: item.paymentType === "COD" ? "#28a745" : colors.primary,
                      color: colors.white,
                      padding: 5,
                      borderRadius: 5,
                    }}
                  >
                    {item.paymentType === "COD" ? "Pay at station (COD)" : "Paid Online (Card)"}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : loading ? (
          <View>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View>
            <Text>No Booking Records are found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

export default MyBooking;
