import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'

import { MaterialIcons } from '@expo/vector-icons'

const DevMenu = () => {
  const router = useRouter()

  return (
    <Pressable onPress={() => router.push('_sitemap')}>
      <MaterialIcons name="developer-mode" size={24} color="black" />
    </Pressable>
  )
}
export default DevMenu
