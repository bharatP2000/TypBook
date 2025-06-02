// components/FullscreenImageModal.js
import React from 'react';
import { Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function FullscreenImageModal({ visible, imageBase64, onClose }) {
  const formattedUri = imageBase64
    ? `data:image/jpeg;base64,${imageBase64}`
    : null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={onClose}
        activeOpacity={1}
      >
        {formattedUri && (
          <Image
            source={{ uri: formattedUri }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
  },
});
