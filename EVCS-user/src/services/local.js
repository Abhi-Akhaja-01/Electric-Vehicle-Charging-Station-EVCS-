import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? value : null;
  } catch (error) {
    return null;
  }
};

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data:", error);
  }
};

export { storeData, retrieveData, removeData };
