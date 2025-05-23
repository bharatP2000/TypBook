import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

export default function MembershipFormScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !phone || !reason) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://<YOUR_IP>:5000/api/memberships', {
        name,
        email,
        phone,
        reason,
      });
      Alert.alert('Membership form submitted!');
      setName('');
      setEmail('');
      setPhone('');
      setReason('');
    } catch (err) {
      console.error(err);
      Alert.alert('Submission failed. Try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Membership Form</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Why do you want to join?"
        value={reason}
        onChangeText={setReason}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
});
