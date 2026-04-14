import React, { useState } from 'react';
import { View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { TouchableOpacity, Text } from 'react-native';

const { width } = Dimensions.get('window');

export default function Payment({ onPaymentSuccess }) {
  const [cardDetails, setCardDetails] = useState(null);
  const { confirmPayment } = useStripe();

  async function fetchPaymentIntent() {
    try {
      // const response = await fetch('https://079f-2409-40c1-10ba-46f2-ed83-dfc7-a543-b828.ngrok-free.app/create-payment-intent', {
      const response = await fetch('https://evcs-backend-2.onrender.com/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodType: 'Card',
          amount: 5000,            
          currency: 'usd',     
        })
        
      });
      console.log("response",response)
      const { clientSecret } = await response.json();
      console.log(clientSecret);
      
      return clientSecret;
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      return null;
    }
  }

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }
    // Fetch client secret from your backend
    const clientSecret = await fetchPaymentIntent();
    // console.log("clientSecret",clientSecret);
    
    if (clientSecret) {
      const paymentMethod = {
        card: {
          number: '4242424242424242',
          exp_month: '12',
          exp_year: '25',
          cvc: '123',
        },
        billing_details: {
          email: 'test@example.com',
        },
      };
    
      const {error , paymentIntent} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        // payment_method: paymentMethod, // Pass the payment method here
      });
    
      console.log(paymentIntent);
        
      if (error) {
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Payment successful', `Status: ${paymentIntent.status}`);
        onPaymentSuccess();
      }
    }
  };

  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242', 
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          borderWidth: 1,
          borderColor: '#CCCCCC',
          borderRadius: 8,
        }}
        style={{
          width: width - 32, // Adjust width for padding
          height: 50,
          marginVertical: 20,
        }}
        onCardChange={(details) => setCardDetails(details)}
        onFocus={(focusedField) => console.log('Focused field:', focusedField)}
      />
      <TouchableOpacity
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          backgroundColor: '#007bff',
        }}
        onPress={handlePayPress}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
});
