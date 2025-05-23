import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';

const dummyData = [
  {
    id: '1',
    username: 'john_doe',
    profilePic: '',
    postImage: '',
    caption: 'Look at this cute kitten!',
    likes: 0,
    comments: 0,
  },
  {
    id: '2',
    username: 'jane_smith',
    profilePic: '',
    postImage: '',
    caption: 'Another adorable kitty!',
    likes: 0,
    comments: 0,
  },
  {
    id: '3',
    username: 'john_doe',
    profilePic: '',
    postImage: '',
    caption: 'Look at this cute kitten!',
    likes: 0,
    comments: 0,
  },
  {
    id: '4',
    username: 'jane_smith',
    profilePic: '',
    postImage: '',
    caption: 'Another adorable kitty!',
    likes: 0,
    comments: 0,
  },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState(dummyData);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    }));
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Header: profile pic + username */}
      <View style={styles.header}>
        <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
        <Text style={styles.username}>{item.username}</Text>
      </View>

      {/* Post image */}
      <Image source={{ uri: item.postImage }} style={styles.postImage} />

      {/* Caption */}
      <Text style={styles.caption}>{item.caption}</Text>

      {/* Like and Comment buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionBtn}>
          <Text>👍 Like ({item.likes})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item.id)} style={styles.actionBtn}>
          <Text>💬 Comment ({item.comments})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPost}
      contentContainerStyle={{ padding: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3, // shadow on Android
    shadowColor: '#000', // shadow on iOS
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
  },
  username: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 250,
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
