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
        renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => {
                    markAsSeen(item.id); // backend call
                    navigation.navigate('PostDetail', { postId: item.post.id });
                }}
                style={{
                    backgroundColor: item.seen ? '#fff' : '#e6f0ff',
                    padding: 10,
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                }}
            >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.user.profilePic }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                <Text>{item.message}</Text>
                </View>
                <Text style={{ color: '#888', marginLeft: 10 }}>
                {moment(item.createdAt).fromNow(true)} {/* e.g., "2h", "3w" */}
                </Text>
            </View>
            </TouchableOpacity>
            )}
        />
    </View>
  );
}
