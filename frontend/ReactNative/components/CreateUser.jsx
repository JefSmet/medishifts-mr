import React, { useState } from 'react';
import {
  Layout,
  Input,
  Button,
  Text,
  Card,
  CheckBox,
} from '@ui-kitten/components';
import { StyleSheet, Alert, View } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';

function handleCreateUser(
  userName,
  password,
  userRole,
  setUserName,
  setPassword,
  setUserRole,
) {
  if (!userName || !password || !userRole) {
    Alert.alert('Validation Error', 'Please fill in all fields.');
    return;
  }

  axios
    .post(API_BASE_URL + 'users', {
      user_name: userName,
      password: password,
      user_role_id: userRole,
    })
    .then(response => {
      if (response.status === 201) {
        Alert.alert('Success', 'User created successfully!');
        setUserName('');
        setPassword('');
        setUserRole('');
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    })
    .catch(error => {
      Alert.alert('Error', `Error creating user: ${error.message}`);
    });
}

function CreateUserForm() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');

  return (
    <Layout style={styles.container}>
      <Card style={styles.card}>
        <Text category="h5" style={styles.header}>
          Create User
        </Text>
        <Input
          label="Username"
          placeholder="Enter username"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
        />
        <Input
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <CheckBox
          style={styles.input}
          checked={userRole === 'admin'}
          onChange={nextChecked => setUserRole(nextChecked ? 'admin' : 'user')}
        >
          Is admin
        </CheckBox>
        <Button
          onPress={() =>
            handleCreateUser(
              userName,
              password,
              userRole,
              setUserName,
              setPassword,
              setUserRole,
            )
          }
          style={styles.button}
        >
          Create User
        </Button>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '90%', // Adjust the width to a percentage or fixed value
    maxWidth: 400, // Ensure the card doesn't get too wide on large screens
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 15,
  },
});

export default CreateUserForm;
