import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../../../../Components/FeedHeader';
import {COLOR} from '../../../../Constants/Colors';
import CustomButton from '../../../../Components/CustomButton';
import {useApi} from '../../../../Backend/Api';
import {useToast} from '../../../../Constants/ToastContext';
import {AuthContext} from '../../../../Backend/AuthContent';

const BankAccountList = ({navigation}) => {
  const {postRequest, getRequest} = useApi();
  const {user} = useContext(AuthContext);
  const {showToast} = useToast();

  const [buttonLoader, setButtonLoader] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const [form, setForm] = useState({
    accountNumber: '',
    accountHolderName: '',
    ifscCode: '',
    branch: '',
    accountType: 'Saving',
  });

  // Fetch bank accounts and prefill form
  const fetchBankAccounts = async () => {
    try {
      setLoadingAccounts(true);
      console.log('Fetching bank accounts...');

      const res = await getRequest('public/api/account/list', true);
      console.log('Bank Accounts API Response:', res?.data?.data);

      if (res?.data?.status === true || res?.data?.success === true) {
        if (res?.data?.data?.length > 0) {
          const account = res.data.data[0]; // take the first account
          setForm({
            accountNumber: account?.account_number || '',
            accountHolderName: account?.account_holder_name || '',
            ifscCode: account?.ifsc_code || '',
            branch: account?.branch || '',
            accountType: account?.account_type || 'Saving',
          });
        }
      } else {
        showToast(res?.message || 'Failed to fetch bank accounts.', 'error');
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      showToast('An error occurred while fetching bank accounts.', 'error');
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Fetch accounts on mount
  useEffect(() => {
    fetchBankAccounts();
  }, []);

  // Handle update / create new account
  const handleUpdate = async () => {
    setButtonLoader(true);
    const formdata = new FormData();
    formdata.append('account_number', form.accountNumber);
    formdata.append('account_holder_name', form.accountHolderName);
    formdata.append('ifsc_code', form.ifscCode);
    formdata.append('branch', form.branch);
    formdata.append('account_type', form.accountType);

    console.log('Submitting Account Form Data:', form);

    try {
      const res = await postRequest('public/api/account/store', formdata, true);
      console.log('Update API Response:', res);

      if (res.data?.status === true || res?.data?.success === true) {
        showToast('Bank account details updated successfully!', 'success');
        fetchBankAccounts(); // Refresh with updated data
        navigation.goBack();
      } else {
        showToast(res?.message || 'Failed to update bank details.', 'error');
      }
    } catch (err) {
      console.error('Update API Error:', err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setButtonLoader(false);
    }
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
        {loadingAccounts ? (
          <ActivityIndicator size="large" color={COLOR.royalBlue} />
        ) : (
          <>
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
                onChangeText={text =>
                  setForm({...form, accountHolderName: text})
                }
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

            {/* Account Type */}
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
                      form.accountType === 'Saving' &&
                        styles.typeButtonTextActive,
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
                      form.accountType === 'Current' &&
                        styles.typeButtonTextActive,
                    ]}>
                    Current
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Update Button */}
      <CustomButton
        title={'Update'}
        loading={buttonLoader}
        onPress={handleUpdate}
      />
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 15,
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
});
