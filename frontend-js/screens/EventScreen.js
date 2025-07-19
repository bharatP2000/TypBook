import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import dayjs from 'dayjs';
import { AuthContext } from '../context/AuthContext';
import AddEventModal from '../components/addEventModal';
import { GRAPHQL_URL } from '../utils/config';


const EventScreen = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  

  const { user } = useContext(AuthContext);
  const userId = user?.id;
  console.log(userId);
  useEffect(() => {
    if (!showModal) {
      fetchEvents(); // Refetch events whenever modal closes
    }
  }, [showModal]);



  const fetchEvents = async () => {
    try {
      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // include token if needed:
          // 'Authorization': `Bearer ${yourToken}`
        },
        body: JSON.stringify({
          query: `
            query {
              getEvents{
                id
                description
                date
                cancelled
                createdBy{
                  id
                }
              }
            }
          `,
        }),
      });

      const result = await res.json();
      console.log("Results", result.data);
      if (result.data && result.data.getEvents) {
        setEvents(result.data.getEvents);
      } else {
        console.error('Error fetching events:', result.errors);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };


  const filteredEvents = events.filter(ev => {
    if (!ev || !ev.date) return false;

    const eventDate = dayjs(Number(ev.date));
    const isUpcoming = eventDate.isAfter(dayjs());
    const isCompleted = eventDate.isBefore(dayjs());
    const isCancelled = ev.cancelled;

    if (activeTab === 'upcoming') return isUpcoming && !isCancelled;
    if (activeTab === 'completed') return isCompleted && !isCancelled;
    if (activeTab === 'cancelled') return isCancelled;

    return false;
  });


  const handleAddOrEdit = async () => {
    if (isEditing) {
      setEvents(prev =>
        prev.map(event =>
          event.id === editingEventId
            ? { ...event, description, date: date.toISOString() }
            : event
        )
      );
    } else {
      const newEvent = {
        id: Date.now().toString(),
        description,
        date: date.toISOString(),
        cancelled: false,
      };
      setEvents(prev => [...prev, newEvent]);
    }

    resetModalState();
    await fetchEvents();
  };

  const resetModalState = () => {
    setShowModal(false);
    setDescription('');
    setDate(new Date());
    setIsEditing(false);
    setEditingEventId(null);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => {
          setEvents(prev => prev.filter(event => event.id !== id));
        },
        style: 'destructive',
      },
    ]);
  };

  const handleEdit = (event) => {
    if (!event || !event.date) return;
    setIsEditing(true);
    setEditingEventId(event.id);
    setDescription(event.description);
    setDate(new Date(event.date));
    setShowModal(true);
  };

  const handleCancelEvent = async (id) => {
    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${yourToken}` if needed
        },
        body: JSON.stringify({
          query: `
            mutation CancelEvent($id: ID!) {
              cancelEvent(id: $id) {
                id
                cancelled
              }
            }
          `,
          variables: { id },
        }),
      });

      const result = await res.json();
      console.log("Cancelled Event Response:", result);

      if (result.data?.cancelEvent) {
        setEvents(prev =>
          prev.map(event =>
            event.id === id ? result.data.cancelEvent : event
          )
        );
      } else {
        console.error("Cancel mutation failed:", result.errors);
      }
    } catch (error) {
      console.error("Network error during cancel:", error);
    }
  };


  const renderEvent = ({ item }) => {
    const isPast = dayjs(Number(item.date)).isBefore(dayjs());
    const isCreator = item.createdBy.id.toString() === userId;
    console.log("items", item.createdBy.id);
    console.log("userId", userId);
    console.log("isCreator", isCreator);

    return (
      <View style={styles.card}>
        <Text style={[styles.date, item.cancelled && { textDecorationLine: 'line-through', color: 'red' }]}>
          {dayjs(Number(item.date)).format('MMM D, YYYY')} at {dayjs(Number(item.date)).format('hh:mm A')}
        </Text>
        <Text style={[styles.description, item.cancelled && { textDecorationLine: 'line-through', color: 'red' }]}>
          {item.description}
        </Text>

        {/* Only show buttons if current user is the creator */}
        {isCreator && (
          <View style={styles.actions}>
            {!item.cancelled && !isPast && (
              <>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCancelEvent(item.id)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
              <Text style={[styles.actionText, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'upcoming' ? '#fff' : '#007AFF' }]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'completed' ? '#fff' : '#007AFF' }]}>Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'cancelled' ? '#fff' : '#007AFF' }]}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={renderEvent}
        ListEmptyComponent={<Text style={styles.empty}>No events found</Text>}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      {/* Modal */}
      <AddEventModal
        visible={showModal}
        onClose={resetModalState}
        description={description}
        setDescription={setDescription}
        date={date}
        setDate={setDate}
        isEditing={isEditing}
        editingEventId={editingEventId}
        setEvents={setEvents}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  date: { fontWeight: 'bold', marginBottom: 4 },
  description: { color: '#333' },
  actions: { flexDirection: 'row', marginTop: 8 },
  actionBtn: { marginRight: 16 },
  actionText: { color: '#007AFF', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabIcon: {
    color: 'white',
    fontSize: 30,
    lineHeight: 32,
  },
});

export default EventScreen;
