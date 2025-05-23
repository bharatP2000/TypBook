import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Our Organization</Text>
      <Text style={styles.paragraph}>
        We are a non-profit organization committed to making a difference in our community.
        Our mission is to empower individuals through education, healthcare, and social initiatives.
      </Text>
      <Text style={styles.paragraph}>
        Join us in creating a better future. We regularly conduct events, awareness programs, and support initiatives for underprivileged communities.
      </Text>
      <Text style={styles.paragraph}>
        For more info, contact us at: contact@ourngo.org
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
});
