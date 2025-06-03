// components/ProfileHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileHeader({ user, userProfile, selectImage, openImage }) {
  const profilePicture = userProfile?.profilePicture;
  const coverPicture = userProfile?.coverPicture;

  return (
    <View>
      {/* Cover Photo */}
      <View style={{ position: 'relative' }}>
        <TouchableOpacity onPress={() => openImage(coverPicture)}>
          <Image source={{ uri: coverPicture }} style={styles.coverPhoto} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraIconOverlaycover}
          onPress={() => selectImage('coverPicture')}
        >
          <Icon name="photo-camera" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture and Username */}
      <View style={styles.profileSection}>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => openImage(profilePicture)}>
            <Image source={{ uri: profilePicture }} style={styles.profilePic} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraIconOverlay}
            onPress={() => selectImage('profilePicture')}
          >
            <Icon name="photo-camera" size={18} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      {/* User Info */}
      <View style={styles.infoSection}>
        <Text>📍 Native Place: {userProfile.nativePlace}</Text>
        <Text>🏠 Address: {userProfile.address}</Text>
        <Text>📞 Mobile: {userProfile.mobileNumber}</Text>
      </View>

      <Text style={styles.sectionTitle}>Activity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  coverPhoto: { width: '100%', height: 250, backgroundColor: "#666" },
  profileSection: { marginTop: -100, marginHorizontal: 10 },
  profilePic: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#fff'
  },
  cameraIconOverlaycover: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    backgroundColor: '#ddd',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconOverlay: {
    position: 'absolute',
    left: 100,
    bottom: 5,
    backgroundColor: '#ddd',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  infoSection: { paddingHorizontal: 20, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 10 },
});
