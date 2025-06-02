// utils/imagePicker.js
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function pickImage() {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access photos is required!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];

    if (!asset.base64) {
      Alert.alert('Error', 'Failed to get base64 string of the image');
      return null;
    }

    return {
      uri: asset.uri,
      base64: `data:${asset.type};base64,${asset.base64}`,
      width: asset.width,
      height: asset.height,
      type: asset.type,
    };
  } catch (error) {
    Alert.alert('Error', 'An error occurred while picking the image.');
    console.error('pickImage error:', error);
    return null;
  }
}
