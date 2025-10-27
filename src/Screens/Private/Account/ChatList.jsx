import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../../Components/FeedHeader';

const ChatList = ({navigation}) => {
  return (
    <View>
      <Header
        title="Chats"
        showBack
        onBackPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
