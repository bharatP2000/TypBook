import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
    const [userProfile, setUserProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const userId = user?.userId;
    useEffect(() => {
        if (userId) {
            fetchUserProfile(userId);
            fetchUserPosts(userId);
        }
    }, [userId]);

    const fetchUserProfile = async () => {
        const query = `
        query {
            getUser(id: "${userId}") {
            username
            profilePic
            coverPhoto
            nativePlace
            address
            mobile
            }
        }
        `;
        const res = await fetch('http://192.168.0.137:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        });
        const json = await res.json();
        setUserProfile(json.data.getUser);
    };

    const fetchUserPosts = async () => {
        const query = `
            query {
                getUserPosts {
                    id
                    text
                    imageBase64
                    createdAt
                }
            }
            `;
        const res = await fetch('http://192.168.0.137:5000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        const json = await res.json();
        setPosts(json.data.getUserPosts);
    };

    if (!userProfile) return <Text>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
        {/* Cover Photo */}
        <Image source={{ uri: userProfile.coverPhoto }} style={styles.coverPhoto} />

        {/* Profile Picture and Username */}
        <View style={styles.profileSection}>
            <Image source={{ uri: userProfile.profilePic }} style={styles.profilePic} />
            <Text style={styles.username}>{user.username}</Text>
        </View>

        {/* User Info */}
        <View style={styles.infoSection}>
            <Text>📍 Native Place: {userProfile.nativePlace}</Text>
            <Text>🏠 Address: {userProfile.address}</Text>
            <Text>📞 Mobile: {userProfile.mobile}</Text>
            {/* Add edit logic as needed */}
        </View>

        {/* Activity Section */}
        <Text style={styles.sectionTitle}>Activity</Text>
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.post}>
                {item.imageBase64 && (
                <Image source={{ uri: item.imageBase64 }} style={styles.postImage} />
                )}
                <Text>{item.text}</Text>
            </View>
            )}
        />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  coverPhoto: { width: '100%', height: 180 },
  profileSection: {
    alignItems: 'center', marginTop: -40
  },
  profilePic: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#fff'
  },
  username: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  infoSection: { paddingHorizontal: 20, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 10 },
  post: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  postImage: { width: '100%', height: 200, marginVertical: 5 },
});
