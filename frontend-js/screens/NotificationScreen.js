import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { GRAPHQL_URL } from '../utils/config';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const fetchNotifications = async () => {
    setLoading(true);
    // console.log("Inside Notification");
    const query = `
        query GetAllNotifications($skip: Int, $limit: Int) {
            getAllNotifications(skip: $skip, limit: $limit) {
                id
                message
                createdAt
                user {
                    username
                    profilePicture
                }
            }
        }
    `;
    // console.log("Before Variable");
    const variables = { skip, limit };
    try {
      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();
    //   console.log('Full GraphQL Response:', JSON.stringify(json, null, 2));
      setNotifications(prev => [...prev, ...json.data.getAllNotifications]);
      setSkip(prev => prev + limit);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
      <Image
        source={{ uri: item.user.profilePicture }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text>{item.message}</Text>
        <Text style={{ color: 'gray', fontSize: 12 }}>{moment(Number(item.createdAt)).fromNow()}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity onPress={fetchNotifications} style={{ padding: 10, alignItems: 'center' }}>
              <Text style={{ color: 'blue' }}>See more</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}
