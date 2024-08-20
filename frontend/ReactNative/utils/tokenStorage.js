import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

// Functies om tokens op te slaan, op te halen en te verwijderen
export const storeToken = async (token) => {
  if (isWeb) {
    sessionStorage.setItem('jwtToken', token);
  } else {
    try {
      await AsyncStorage.setItem('jwtToken', token);
    } catch (e) {
      console.error(e);
    }
  }
};

export const getToken = async () => {
  if (isWeb) {
    return sessionStorage.getItem('jwtToken');
  } else {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
    } catch (e) {
      console.error(e);
    }
  }
};

export const removeToken = async () => {
  if (isWeb) {
    sessionStorage.removeItem('jwtToken');
  } else {
    try {
      await AsyncStorage.removeItem('jwtToken');
    } catch (e) {
      console.error(e);
    }
  }
};

// Event listener voor het afsluiten van de browser (alleen voor web)
if (isWeb) {
  window.addEventListener('beforeunload', () => {
    removeToken();
  });
}
