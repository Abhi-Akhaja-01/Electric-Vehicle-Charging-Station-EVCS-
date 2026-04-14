import React from "react";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "../../theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:true,
        tabBarActiveTintColor:colors.primary,
        tabBarStyle:{
          height:65,
          position:"absolute",
          paddingBottom:10,
          borderTopLeftRadius:20,
          borderTopRightRadius:20,
          shadowColor:colors.primary + 90,
          borderWidth:1,
          borderColor:colors.primary + 40,
          borderTopWidth:1,
          // backgroundColor:colors.primary
        },
        tabBarLabelStyle:{
          marginTop:-10,
          fontWeight:700,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown:false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-lightning-bolt"
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="station"
        options={{
          title: "Station",
          headerShown:false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="charging-station" size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myBooking"
        options={{
          title: "Bookings",
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.primary },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="lightning-bolt" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account Details",
          headerTintColor:colors.white,
          headerStyle:{
            backgroundColor:colors.primary,
          },
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
