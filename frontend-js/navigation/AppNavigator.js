import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from '../screens/LoginScreen';
import FeedScreen from '../screens/FeedScreen';
import PostUploadScreen from '../screens/PostUploadScreen';
import AboutScreen from '../screens/AboutScreen';
import MembershipFormScreen from '../screens/MembershipFormScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationScreen'; // create this if needed

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications" size={32} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen name="Home" component={FeedScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Post" component={PostUploadScreen} />
      <Tab.Screen name="Membership" component={MembershipFormScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              headerShown: true,
              title: 'Notifications',
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
