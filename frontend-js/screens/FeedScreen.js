import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { GRAPHQL_URL } from '../utils/config';

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchPosts = async () => {
    const query = `
      query {
        getPosts {
          id
          text
          imageBase64
          createdAt
          user {
            username
            profilePicture
          }
        }
      }
    `;

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      // console.log('📦 Raw GraphQL response:', JSON.stringify(json, null, 2));

      if (json.errors) throw new Error(json.errors[0].message);

      const postsData = json.data?.getPosts;
      // console.log('✅ Parsed posts:', postsData);

      setPosts(postsData);
    } catch (err) {
      console.error('❌ Failed to fetch posts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPosts(); // Refresh only when screen is focused
    }
  }, [isFocused]);

  const renderPost = ({ item }) => {
    console.log('🖼️ Rendering post:', item);

    return (
      <View style={styles.postContainer}>
        {/* Header: profile pic + username */}
        <View style={styles.header}>
          <Image source={{ uri: item.user?.profilePicture }} style={styles.profilePic} />
          <Text style={styles.username}>{item.user?.username || 'Unknown'}</Text>
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPost}
      contentContainerStyle={{ padding: 10 }}
      ListEmptyComponent={<Text>No posts found.</Text>}
    />
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
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  username: {
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
});
