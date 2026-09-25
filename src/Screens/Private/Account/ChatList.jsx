import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import { useApi } from '../../../Backend/Api';
import { useIsFocused } from '@react-navigation/native';

const ChatList = ({ navigation, route }) => {
  const { getRequest } = useApi();
  const isFocused = useIsFocused();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const getChatList = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await getRequest('public/api/chat-list');
      if (response?.success) {
        setChatList(
          Array.isArray(response?.data?.data) ? response.data.data : [],
        );
      } else {
        setChatList([]);
        setLoadError(response?.error || 'Unable to load your conversations.');
      }
    } catch (error) {
      setChatList([]);
      setLoadError('Unable to load your conversations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getChatList();
    }
    // API context methods are not referentially stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

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
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message || 'No messages yet'}
          </Text>
          {!item?.is_read ? <Text style={styles.unreadText}>Unread</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Chats"
        showBack={route?.name !== 'ChatHome'}
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLOR.primary}
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={chatList}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={[
            styles.listContent,
            chatList.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>💬</Text>
              </View>
              <Text style={styles.emptyTitle}>
                {loadError ? 'Could not load chats' : 'No conversations yet'}
              </Text>
              <Text style={styles.emptyMessage}>
                {loadError ||
                  'Open a property, choose “Contact Landlord in Chat,” and your conversation will appear here.'}
              </Text>
              {loadError ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Retry loading chats"
                  style={styles.retryButton}
                  onPress={getChatList}>
                  <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
              ) : null}
            </View>
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
  loadingIndicator: {
    marginTop: 30,
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
  },
  userName: {
    fontSize: 16,
    color: COLOR.black || '#000',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 13,
    color: COLOR.grey,
    marginTop: 2,
    flex: 1,
    marginRight: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadText: {
    color: COLOR.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    padding: 10,
    flexGrow: 1,
  },
  emptyListContent: {
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 70,
  },
  emptyIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1E8',
    marginBottom: 18,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    color: COLOR.black,
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyMessage: {
    color: '#69707D',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    minWidth: 112,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.primary,
    marginTop: 18,
  },
  retryText: {
    color: COLOR.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
