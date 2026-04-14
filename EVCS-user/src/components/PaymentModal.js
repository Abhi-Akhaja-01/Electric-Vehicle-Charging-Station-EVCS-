import { View, Modal, StyleSheet, Text } from "react-native";
import React, { useRef } from "react";
import { colors } from "../theme/colors";
import Button from "./Button";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { routes } from "../routes/routes";

const PaymentModal = ({
  isPaymentLoading = false,
  isOpenModal = false,
  onCloseModal,
}) => {
  const animation = useRef(null);

  return (
    <Modal animationType={"fade"} transparent={true} visible={isOpenModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          {isPaymentLoading ? (
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: "100%",
                height: "70%",
                backgroundColor: "#FFF",
              }}
              source={require("../assets/lottie/card-animation.json")}
            />
          ) : (
            <LottieView
              autoPlay={false}
              ref={animation}
              style={{
                width: "100%",
                height: "81%",
                backgroundColor: "#FFF",
              }}
              source={require("../assets/lottie/payment-success.json")}
            />
          )}
          {isPaymentLoading && (
            <Text style={styles.loadingText}>
              Slot Booking Is In Progress...
            </Text>
          )}
          <Button
            title={"View Slots"}
            onPress={() => {
              onCloseModal();
              // we have used 2 redirection because of when we do back from myBooking screen then it's comes again into prev booking page so for avoid this issue we are using 2 time redirection . 
              router.push("account");
              router.push(routes.myBooking.index.path);
            }}
            loading={isPaymentLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black + 90,
  },
  modal: {
    backgroundColor: colors.white,
    height: 380,
    width: "90%",
    borderRadius: 20,
    padding: 20,
  },
  loadingText: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.primary,
  },
});

export default PaymentModal;
