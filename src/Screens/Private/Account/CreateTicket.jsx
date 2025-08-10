import {StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import CustomButton from '../../../Components/CustomButton';
import {COLOR} from '../../../Constants/Colors';

const CreateTicket = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    // TODO: Call API to create ticket
    console.log('New Ticket:', {title, description});

    // After submission, navigate back or show success
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Create Ticket'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ticket title"
          placeholderTextColor={COLOR.grey}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter ticket description"
          placeholderTextColor={COLOR.grey}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </ScrollView>
      <CustomButton title="Submit Ticket" onPress={handleSubmit} />
    </View>
  );
};

export default CreateTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: COLOR.black,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLOR.black,
    marginBottom: 16,
    backgroundColor: COLOR.white,
  },
  textArea: {
    height: 120,
  },
});
