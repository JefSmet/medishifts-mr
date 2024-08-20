import React, { useState } from 'react';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { StyleSheet, Dimensions } from 'react-native';
import { API_BASE_URL } from '@env';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch(API_BASE_URL + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          // Als de response niet ok is, gooi een error met de status tekst
          return response.text().then(text => { 
            throw new Error(text);
          });
        }
        return response.json(); // Probeer alleen te parsen als het een geldige JSON-response is
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log('Error:', error.message); // Log de error message
      });
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
