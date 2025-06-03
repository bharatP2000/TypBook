import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { GRAPHQL_URL } from '../utils/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updateUserProfileFields } from '../utils/userProfileUpdateApi';
import { pickImage } from '../utils/imagePicker';
import { useIsFocused } from '@react-navigation/native';
import ProfileHeader from '../components/profileHeader';
import { ActivityIndicator } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

export default function ProfileScreen() {
    const [userProfile, setUserProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const isFocused = useIsFocused();
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const token = user?.token;
    const [visible, setVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    // console.log("Profile Screen", userId);
    useEffect(() => {
        let timeout;
        if (isFocused && userId) {
            fetchUserProfile();
            timeout = setTimeout(() => {
                fetchUserPosts(userId);
            }, 300);
        }
        return () => clearTimeout(timeout);
    }, [isFocused, userId]);

    const openImage = (uri) => {
        setCurrentImage([{ uri }]);
        setVisible(true);
    };

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
      

    

    if (!userProfile) return <ActivityIndicator size="large" color="#000" />;
    const profilePicture = userProfile?.profilePicture;
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
        <>
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No posts found.</Text>}
            ListHeaderComponent={
                () => (
                <ProfileHeader
                    user={user}
                    userProfile={userProfile}
                    selectImage={selectImage}
                    openImage={openImage}
                />
                )
            }
            contentContainerStyle={{ paddingBottom: 40 }}
        />
        <ImageViewing
            images={currentImage || []}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        />
        </>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        margin: 15,
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
