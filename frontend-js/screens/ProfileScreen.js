import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { GRAPHQL_URL } from '../utils/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updateUserProfileFields } from '../utils/userProfileUpdateApi';
import { pickImage } from '../utils/imagePicker';


export default function ProfileScreen() {
    const [userProfile, setUserProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const token = user?.token
    console.log("Profile Screen", userId);
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
                profilePicture
                coverPicture
                nativePlace
                address
                mobileNumber
            }
        }
        `;
        const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        });
        const json = await res.json();
        console.log("Profile Screen", json);
        setUserProfile(json.data.getUser);
    };

    const fetchUserPosts = async (userId) => {
        const query = `
            query GetPostsByUser($userId: ID!) {
                getPostsByUser(userId: $userId) {
                    id
                    text
                    imageBase64
                    createdAt
                    user {
                        username
                    }
                }
            }
        `;
    
        const variables = { userId };
    
        const res = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });
    
        const json = await res.json();
        console.log("Profile fetched post", json);
        setPosts(json.data.getPostsByUser);
    };

    const selectImage = async (field) => {
        const imageData = await pickImage();
        if (!imageData) return;
      
        const updateObj = {};
        updateObj[field] = imageData.base64;
        // console.log(updateObj);
        try {
          const updatedProfile = await updateUserProfileFields(updateObj, token);
          if (updatedProfile) {
            setUserProfile(prev => ({ ...prev, ...updatedProfile }));
          }
        } catch (error) {
          console.error('Failed to update image:', error);
        }
    };
      
    

    if (!userProfile) return <Text>Loading...</Text>;
    const profilePicture = userProfile?.profilePicture;
    const coverPicture = userProfile?.coverPicture;
    console.log(profilePicture);
    const renderPost = ({ item }) => {
        // console.log('🖼️ Rendering post:', item);
        return (
            <View style={styles.postContainer}>
            {/* Header: profile pic + username */}
            <View style={styles.header}>
                {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profilePicPost} />
                ) : (
                <View style={styles.profilePicPost}>
                    <Icon name="person" size={24} color="#888" />
                </View>
                )}
                <Text style={styles.usernamePost}>{item.user?.username || 'Unknown'}</Text>
            </View>

            {/* Post image */}
            {item.imageBase64 ? (
                <Image
                source={{ uri: item.imageBase64 }}
                style={styles.postImage}
                />
            ) : null}

            {/* Caption */}
            {item.text ? (
                <Text style={styles.caption}>{item.text}</Text>
            ) : null}

            {/* Like and Comment buttons */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                <Text>👍 Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                <Text>💬 Comment</Text>
                </TouchableOpacity>
            </View>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
        {/* Cover Photo */}
            <View style={{position: 'relative'}}>
                <TouchableOpacity onPress={() => openProfilePicture()}>
                    <Image source={{ uri: coverPicture }} style={styles.coverPhoto} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cameraIconOverlaycover} onPress={() => selectImage('coverPicture')}>
                    <Icon name="photo-camera" size={18} color="#000" />
                </TouchableOpacity>
            </View>
            

            {/* Profile Picture and Username */}
            <View style={styles.profileSection}>
                <View style={{ position: 'relative' }}>
                {/* View profile picture fullscreen */}
                    <TouchableOpacity onPress={() => openProfilePicture()}>
                        <Image source={{ uri: profilePicture }} style={styles.profilePic}/>
                    </TouchableOpacity>
                {/* Camera icon for editing */}
                    <TouchableOpacity style={styles.cameraIconOverlay} onPress={() => selectImage('profilePicture')}>
                        <Icon name="photo-camera" size={18} color="#000" />
                    </TouchableOpacity>
                </View>
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
                renderItem={renderPost}
                contentContainerStyle={{ padding: 10 }}
                ListEmptyComponent={<Text>No posts found.</Text>}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      },
      profilePicPost: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
      },
      usernamePost: {
        marginLeft: 10,
        fontWeight: 'bold',
      },
      postImage: {
        width: '100%',
        height: 250,
        backgroundColor: '#eee',
      },
      caption: {
        padding: 10,
        fontSize: 14,
        color: '#333',
      },

      actions: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
      actionBtn: {
        paddingHorizontal: 10,
      },
    container: { flex: 1, backgroundColor: '#fff' },
    coverPhoto: { width: '100%', height: 250, backgroundColor:"#666" },
    profileSection: { marginTop: -100, marginHorizontal: 10 },
    profilePic: {
        width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#fff'
    },
    cameraIconOverlaycover: {
        position: 'absolute',
        right:20,
        bottom:10,
        backgroundColor: '#ddd',
        borderRadius: 20,
        padding: 6,
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 1, // Ensures it's above the image
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIconOverlay: {
        position: 'absolute',
        left:100,
        bottom:5,
        backgroundColor: '#ddd',
        borderRadius: 20,
        padding: 6,
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 1, // Ensures it's above the image
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: { fontSize: 20, fontWeight: 'bold', marginVertical: 8},
    infoSection: { paddingHorizontal: 20, marginVertical: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 10 },
});
