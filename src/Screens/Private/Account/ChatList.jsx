import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import { useApi } from '../../../Backend/Api';
import { AuthContext } from '../../../Backend/AuthContent';

const ChatList = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { getRequest } = useApi();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getChatList = async () => {
    setLoading(true);
    try {
      const response = await getRequest('public/api/chat-list');
      if (response?.data?.data?.length > 0) {
        console.log(response.data?.data, "RESPSPPPP");

        setChatList(response.data?.data);
      } else {
        console.log('Unexpected response:', response);
      }
    } catch (error) {
      console.log('Error fetching chat list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatList();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatContainer}
      onPress={() =>
        navigation.navigate('Chat', {
          receiver_id: item?.user_id,
        })
      }>
      {/* <Image source={{uri: item.image}} style={styles.avatar} /> */}
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{item.user_name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message || 'No messages yet'}
          </Text>
          <Text style={{ color: COLOR.blue }}>{item?.is_read ? "" : "Unread"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Chats" showBack onBackPress={() => navigation.goBack()} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLOR.primary}
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={chatList}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={
            <Text
              style={{ textAlign: 'center', marginTop: 20, color: COLOR.gray }}>
              No chats available
            </Text>
          }
        />
      )}
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white || '#fff',
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    color: COLOR.black || '#000',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 13,
    color: COLOR.gray || '#666',
    marginTop: 2,
  },
});
