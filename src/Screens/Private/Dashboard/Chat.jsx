import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';

const Chat = ({navigation}) => {
  const [messages, setMessages] = useState([
    {id: '1', text: 'Hi there!', sender: 'other'},
    {id: '2', text: 'Hello! How are you?', sender: 'me'},
    {
      id: '3',
      text: 'I’m good, thanks! Looking at properties.',
      sender: 'other',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [
      ...prev,
      {id: Date.now().toString(), text: inputText, sender: 'me'},
    ]);
    setInputText('');
  };

  const renderItem = ({item}) => {
    const isMe = item.sender === 'me';
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // offset for header
    >
      <View style={{flex: 1, backgroundColor: COLOR.white}}>
        <Header
          title={'Chat'}
          showBack
          onBackPress={() => navigation.goBack()}
        />

        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{padding: 10, marginHorizontal: 10}}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message..."
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={COLOR.grey}
          />
          <TouchableOpacity onPress={handleSend}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/3682/3682321.png',
              }}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: COLOR.black,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: COLOR.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  sendIcon: {
    width: 28,
    height: 28,
    marginLeft: 8,
    tintColor: COLOR.primary,
  },
});
