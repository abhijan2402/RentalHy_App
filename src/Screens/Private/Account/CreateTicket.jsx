import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import Header from '../../../Components/FeedHeader';
import CustomButton from '../../../Components/CustomButton';
import { COLOR } from '../../../Constants/Colors';
import { useApi } from '../../../Backend/Api';
import { useToast } from '../../../Constants/ToastContext';
import { AuthContext } from '../../../Backend/AuthContent';

const CreateTicket = ({ navigation }) => {
  const { postRequest } = useApi();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    setLoader(true)
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description');
      setLoader(false);
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('user_id', user?.id);
    formData.append('user_type', 'existing');
    const response = await postRequest('public/api/support/issues', formData, true);
    if (response?.data?.status == 'success') {
      showToast("Ticket Created Successfully", "success")
      setLoader(false);
      navigation.goBack();
    } else {
      showToast("Error while creating ticket !", "error")
      setLoader(false)
      navigation.goBack();
    }
    setLoader(false)

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
      <CustomButton title="Submit Ticket" onPress={handleSubmit} loading={loader} />
      <View style={{ marginBottom: 50 }}>

      </View>
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
