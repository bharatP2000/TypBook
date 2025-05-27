import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { convertToBase64 } from '../utils/convertToBase64';

export default function PostUploadScreen() {
  const [image, setImage] = useState(null);
  const [text, settext] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const token = user?.token;
  // console.log(token);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadPost = async () => {
    if (!image && !text) {
      return Alert.alert('Please select an image and enter a text.');
    }

    let base64Image = null;
    if (image) {
      base64Image = await convertToBase64(image);
    }

    const mutation = `
      mutation CreatePost($text: String, $imageBase64: String) {
        createPost(text: $text, imageBase64: $imageBase64) {
          id
          text
          imageBase64
          createdAt
        }
      }
    `;

    const variables = {
      text: text,
      imageBase64: base64Image, // already base64
    };
    try {
      const res = await fetch('http://192.168.0.137:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query: mutation, variables }),
      });
  
      const json = await res.json();
      console.log('GraphQL Response: Success');
      if (json.errors) throw new Error(json.errors[0].message);
      if (!json.data || !json.data.createPost) {
        throw new Error('Post creation failed. No data returned.');
      }
      Alert.alert('Post uploaded!');
      setImage(null);
      settext('');
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Upload failed', err.message);
    }
  

    // API call placeholder
  };

  const popupOptions = [
    { label: 'Media', icon: 'image' },
    { label: 'Event', icon: 'event' },
    { label: 'Celebrate', icon: 'emoji-events' },
    { label: 'Job', icon: 'work' },
    { label: 'Poll', icon: 'poll' },
    { label: 'Document', icon: 'description' },
    { label: 'Services', icon: 'person' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Top Profile Row */}
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              {user?.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.avatar}
                />
              ) : (
                <MaterialIcons name="person" size={48} color="#888" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>{user?.username || 'Username'}</Text>
            </View>

            <TouchableOpacity
              onPress={uploadPost}
              disabled={!text && !image}
              style={[
                styles.postButton,
                { opacity: text || image ? 1 : 0.5 },
              ]}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>


          {/* Text Input */}
          <TextInput
            placeholder="What's on your mind?"
            value={text}
            onChangeText={settext}
            multiline
            style={styles.textInput}
          />
          {/* Image Preview */}
          {/* {image && <Image source={{ uri: image }} style={styles.preview} />} */}
          {image ? (
        // Show only the selected image as full preview
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: image }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setImage(null)}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            ) : (<Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <View style={styles.popupMenu}>
                  {popupOptions.map((item) => (
                    <View style={styles.popupItem} key={item.label}>
                      <MaterialIcons name={item.icon} size={24} color="#333" />
                      <Text style={styles.popupText}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>)}
        </ScrollView>
      {/* Floating Media & Plus Buttons */}
      {!image && (
        <View style={styles.floatingButtons}>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Ionicons name="image" size={28} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
            <Ionicons name="add" size={32} color="#555" />
          </TouchableOpacity>
        </View>
      )}

        {/* Popup Modal */}
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  privacy: {
    fontSize: 12,
    color: 'gray',
  },
  postButton: {
    backgroundColor: '#e53935',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  textInput: {
    fontSize: 18,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 400, // or any fixed value you prefer (like 250 or 350)
    backgroundColor: '#000', // optional for contrast
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 6,
    zIndex: 2,
  },
  
  floatingButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 30,
    marginLeft: 10,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popupMenu: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 24,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  popupText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
});
