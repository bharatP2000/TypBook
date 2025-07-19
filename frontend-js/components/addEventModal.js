import React, { useState, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GRAPHQL_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const AddEventModal = ({
  visible,
  onClose,
  description,
  setDescription,
  date,
  setDate,
  isEditing,
  editingEventId,
  setEvents, // update local list after add/edit
}) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;

    const query = isEditing
      ? `
          mutation UpdateEvent($id: ID!, $description: String!, $date: String!) {
            updateEvent(id: $id, description: $description, date: $date) {
              id
              description
              date
              createdAt
              cancelled
              createdBy { id }
            }
          }
        `
      : `
          mutation AddEvent($description: String!, $date: String!) {
            addEvent(description: $description, date: $date) {
              id
              description
              date
              createdAt
              cancelled
              createdBy { id }
            }
          }
        `;

    const variables = isEditing
      ? { id: editingEventId, description, date: date.toISOString() }
      : { description, date: date.toISOString() };

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL Error:', result.errors);
        return;
      }

      const updatedEvent = isEditing
        ? result.data.updateEvent
        : result.data.addEvent;

      // ✅ Update local event list
      setEvents(prev =>
        isEditing
          ? prev.map(ev => (ev.id === updatedEvent.id ? updatedEvent : ev))
          : [updatedEvent, ...prev]
      );

      // Reset and close modal
      setDescription('');
      setDate(new Date());
      onClose();
    } catch (error) {
      console.error('Network Error:', error);
    }
  };


  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Event</Text>

          <TextInput
            placeholder="Event Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <TouchableOpacity onPress={showDatePicker} style={styles.input}>
            <Text>{dayjs(date).format('MMM D, YYYY hh:mm A')}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            date={date}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <Button title="Add Event" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onClose} color="gray" />
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});


export default AddEventModal;
