import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../services/config";
import { retrieveData } from "../services/local";
import { colors } from "../theme/colors";
import Button from "../components/Button";

const convertIntoDateString = (given_seconds) => {
  if (!given_seconds) return "-";
  const timeString = new Date(given_seconds * 1000).toDateString();
  return timeString;
};

const MyPayments = () => {
  const [myPaymentsData, setMyPaymentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyPaymentsData = async () => {
    setLoading(true);
    try {
      const user = await retrieveData("user");
      const uid = JSON.parse(user).uid;
      
      const collectionRef = collection(firestore, "payments");
      const q = query(collectionRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      // Sort by creation date descending
      documents.sort((a,b) => {
         if (!a.createdAt || !b.createdAt) return 0;
         return b.createdAt.seconds - a.createdAt.seconds;
      });

      setMyPaymentsData(documents.slice(0, 1));
      console.log("payment documents fetched:", documents.slice(0, 1).length);
    } catch (error) {
      console.error("Error getting payment documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPaymentsData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {myPaymentsData.length >= 1 ? (
          <FlatList
            data={myPaymentsData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary + 80,
                  borderRadius: 10,
                  overflow: "hidden",
                  marginBottom: 20,
                  backgroundColor: "#fff"
                }}
              >
                <Button
                  title={item.status === 'succeeded' ? "Paid" : item.status === 'pending' ? "COD" : item.status}
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: item.status === "succeeded" || item.paymentType === "Card" ? "#28a745" : "#ffc107",
                    right: 13,
                    height: 25,
                    top: 14,
                    borderWidth: 0,
                  }}
                  textStyle={{ fontWeight: "bold", fontSize: 11, color: colors.white }}
                  disabled={true}
                />
                
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    backgroundColor: colors.primary,
                    color: colors.white,
                    padding: 15,
                    paddingRight: 80
                  }}
                >
                  {item.stationName}
                </Text>
                
                <View style={styles.rowWrapper}>
                  <Text style={styles.label}>Amount Paid :</Text>
                  <Text style={styles.value}>
                    ₹{item.amount}
                  </Text>
                </View>

                <View style={styles.rowWrapper}>
                  <Text style={styles.label}>Payment Method :</Text>
                  <Text
                    style={[styles.valueBadge, { backgroundColor: item.paymentType === "COD" ? "#28a745" : colors.primary }]}
                  >
                    {item.paymentType === "COD" ? "Pay at Station (COD)" : "Paid Online (Card)"}
                  </Text>
                </View>

                <View style={styles.rowWrapper}>
                  <Text style={styles.label}>Schedule Date :</Text>
                  <Text style={styles.value}>
                    {item.bookingDate ? convertIntoDateString(item.bookingDate.seconds) : "-"}
                  </Text>
                </View>

                <View style={[styles.rowWrapper, { marginBottom: 15 }]}>
                  <Text style={styles.label}>Transaction Date :</Text>
                  <Text style={styles.value}>
                    {item.createdAt ? convertIntoDateString(item.createdAt.seconds) : "-"}
                  </Text>
                </View>

              </View>
            )}
          />
        ) : loading ? (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={{ marginTop: 50, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: colors.gray }}>No Payment Records found.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
  },
  label: {
    fontWeight: "bold",
    color: colors.black,
  },
  value: {
    fontWeight: "bold",
    color: colors.primary,
  },
  valueBadge: {
    fontWeight: "bold",
    backgroundColor: colors.primary,
    color: colors.white,
    padding: 5,
    borderRadius: 5,
  }
});

export default MyPayments;
