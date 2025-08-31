import React, {useContext, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLOR} from '../Constants/Colors'; // adjust import if you have COLORS
import {AuthContext} from '../Backend/AuthContent';
import GooglePlacePicker from '../Components/GooglePicker';

const LocationModal = ({visible, onCreateAccount, onCancel}) => {
  const [selectedAddress,setSelectedAddress] = useState(null);
  const {setCurrentAddress} = useContext(AuthContext);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Your Location</Text>

          <View style={{marginBottom:20}}>
              <GooglePlacePicker
                onPlaceSelected={(location) => {
                  setSelectedAddress(location);
                }}
              />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.createBtn]}
              onPress={() => {
                setCurrentAddress(selectedAddress)
                onCancel();
              }}>
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  createBtn: {
    backgroundColor: COLOR?.primary || '#4CAF50',
  },
  cancelBtn: {
    backgroundColor: COLOR?.danger || '#f44336',
  },
  btnText: {
    color: '#fff',
    fontWeight: '500',
  },
});
