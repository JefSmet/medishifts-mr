import React, { useState } from 'react';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { StyleSheet, Dimensions } from 'react-native';
import { API_BASE_URL } from '@env';
import {api, setAuthToken} from '../utils/setAuthToken';
import {storeToken} from '../utils/tokenStorage';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isWeb = Platform.OS === 'web';

  const handleLogin = async () => {
    try {
      // Maak een login-aanroep naar je backend API
      const response = await api.post('/login', { username, password });

      if (response.data.success) {
        const token = response.data.token;
        
        // Sla de token op in AsyncStorage (mobiel) of sessionStorage (web)
        await storeToken(token);
        
        // Stel de token in voor toekomstige API-aanroepen
        setAuthToken(token);
        
        // Navigeren naar een andere pagina of scherm na succesvolle login
        if (isWeb) {
          window.location.href = '/dashboard'; // Voor web: navigeer naar dashboard
        } else {
          navigation.navigate('Dashboard'); // Voor mobiel: gebruik React Navigation
        }
      } else {
        Alert.alert('Login mislukt', 'Onjuiste inloggegevens');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Er is iets misgegaan. Probeer het opnieuw.');
    }
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.formContainer}>
        <Text category="h1" style={styles.headerText}>
          Login
        </Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <Button style={styles.loginButton} onPress={handleLogin}>
          Login
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#222B45',
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#3366FF',
    borderColor: 'transparent',
  },
});

export default LoginScreen;
