import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GRAPHQL_URL } from '../utils/config';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    console.log("email:", password)
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                id
                username
                email
                token
              }
            }
          `,
          variables: { email, password }
        }),
      });

      const json = await response.json();
      const data = json.data.login;
      // console.log(data);
      if (data && data.token) {
        await AsyncStorage.setItem('token', data.token);
        setUser(data);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'Could not connect to server.');
      }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
