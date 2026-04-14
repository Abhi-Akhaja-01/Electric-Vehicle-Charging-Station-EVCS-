import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
export const sliderData = [
    {
      imageSource: <MaterialCommunityIcons name="car-electric" size={300} color={colors.primary} />,
      header: "Accelerate Your Electric Journey",
      paragraph: "Find, charge, and manage your electric vehicle with ease. Locate nearby charging stations, track your charging sessions, and plan your trips efficiently."
    },
    {
      imageSource: <FontAwesome6 name="charging-station" size={250} color={colors.primary} />,
      header: "Power Up with Ease",
      paragraph: "Experience seamless electric vehicle charging. Discover charging stations, schedule charging, and monitor your energy usage all in one app."
    },
    {
      imageSource: <MaterialIcons name="electrical-services" size={300} color={colors.primary} />,
      header: "Effortless Charging, Everywhere",
      paragraph: "Unlock a world of convenient charging. Locate stations, manage charging sessions, and enjoy real-time updates for a hassle-free EV experience."
    }
  ];