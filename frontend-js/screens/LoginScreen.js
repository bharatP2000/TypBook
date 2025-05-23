import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
        await login({ email, password });
        Alert.alert('Success', 'Logged in successfully!');
      } catch (err) {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
  };

  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image 
                source={require('../assets/Typlogo.png')} 
                style={styles.logo} 
                resizeMode="contain"
            />
        </View>
        
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={18} color="#D32F2F" style={styles.icon} />
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={18} color="#D32F2F" style={styles.icon} />
            <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.input}
            />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
    },
    logoContainer:{
        justifyContent:"center",
        alignItems:"center"
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        justifyContent: 'center'
      },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#D32F2F',
      marginBottom: 30,
      textAlign: 'center',
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
      color: '#333',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#D32F2F',
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 40,
    },
    button: {
      backgroundColor: '#D32F2F',
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  