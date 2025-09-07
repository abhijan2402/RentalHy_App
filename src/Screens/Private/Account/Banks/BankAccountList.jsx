import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Header from '../../../../Components/FeedHeader';
import {COLOR} from '../../../../Constants/Colors';
import CustomButton from '../../../../Components/CustomButton';
import { useApi } from '../../../../Backend/Api';
import { useToast } from '../../../../Constants/ToastContext';
import { AuthContext } from '../../../../Backend/AuthContent';

const BankAccountList = ({navigation}) => {
  const {postRequest} = useApi();

  const {user} = useContext(AuthContext)

  console.log(user)
  const {showToast} = useToast();
  const [buttonLoader , setButtonLoader] = useState(false);
  const [form, setForm] = useState({
    accountNumber: '',
    accountHolderName: '',
    ifscCode: '',
    branch: '',
    accountType: 'Saving',
  });

  const handleUpdate = async () => {
    setButtonLoader(true);
    const formdata = new FormData();
    formdata.append('account_number', form.accountNumber);
    formdata.append('account_holder_name', form.accountHolderName);
    formdata.append('ifsc_code', form.ifscCode);
    formdata.append('branch', form.branch);
    formdata.append('account_type', form.accountType);
    await postRequest('public/api/account/store', formdata , true).then(res => {
      if (res.data?.status === true || res?.data?.success === true) {
        showToast('Bank account details updated successfully!' , "success");
        navigation.goBack();
      } else {
        showToast(res.message || 'Failed to update bank details.', "error");
      }
    }).catch(err => {
      console.error(err);
      showToast('An error occurred. Please try again.', "error");
    });
    setButtonLoader(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Bank Account"
        showBack
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Account Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            keyboardType="numeric"
            value={form.accountNumber}
            onChangeText={text => setForm({...form, accountNumber: text})}
          />
        </View>

        {/* Account Holder Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account holder name"
            value={form.accountHolderName}
            onChangeText={text => setForm({...form, accountHolderName: text})}
          />
        </View>

        {/* IFSC Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IFSC Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter IFSC code"
            autoCapitalize="characters"
            value={form.ifscCode}
            onChangeText={text => setForm({...form, ifscCode: text})}
          />
        </View>

        {/* Branch */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Branch</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter branch name"
            value={form.branch}
            onChangeText={text => setForm({...form, branch: text})}
          />
        </View>

        {/* Account Type (Two Options) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type of Account</Text>
          <View style={styles.typeContainer}>
            {/* Saving Button */}
            <TouchableOpacity
              style={[
                styles.typeButton,
                form.accountType === 'Saving' && styles.typeButtonActive,
              ]}
              onPress={() => setForm({...form, accountType: 'Saving'})}>
              <Text
                style={[
                  styles.typeButtonText,
                  form.accountType === 'Saving' && styles.typeButtonTextActive,
                ]}>
                Saving
              </Text>
            </TouchableOpacity>

            {/* Current Button */}
            <TouchableOpacity
              style={[
                styles.typeButton,
                form.accountType === 'Current' && styles.typeButtonActive,
              ]}
              onPress={() => setForm({...form, accountType: 'Current'})}>
              <Text
                style={[
                  styles.typeButtonText,
                  form.accountType === 'Current' && styles.typeButtonTextActive,
                ]}>
                Current
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Update Button */}
      <CustomButton title={'Update'} loading={buttonLoader} onPress={handleUpdate} />
    </View>
  );
};

export default BankAccountList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginRight: 10,
    marginTop: 10,
  },
  typeButtonActive: {
    backgroundColor: COLOR.royalBlue || '#007BFF',
    borderColor: COLOR.royalBlue || '#007BFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: COLOR.royalBlue || '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
