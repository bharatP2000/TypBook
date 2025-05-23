import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    console.log("email:", password)
    try {
      const response = await fetch('http://192.168.189.147:5000/graphql', {
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
