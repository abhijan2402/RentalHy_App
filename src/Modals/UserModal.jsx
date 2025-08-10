import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {COLOR} from '../Constants/Colors';
import CustomButton from '../Components/CustomButton';

const {height: windowHeight, width: windowWidth} = Dimensions.get('window');

const UserModal = ({visible, onClose, user}) => {
  if (!user) return null;

  return (
    <Modal
      onPress={() => {
        onClose();
      }}
      visible={visible}
      transparent
      animationType="slide">
      <Pressable onPress={onClose} style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View
            style={{
              flexDirection: 'row',
              //   alignItems: 'center',
              width: '95%',
            }}>
            <Image source={{uri: user.image}} style={styles.userImage} />
            <View style={{marginLeft: 5}}>
              <Text style={styles.name}>{user.name}, 47</Text>
              <View>
                <Text style={styles.detail}>{user.gender}</Text>
                {/* <Text style={styles.detail}>Age: {user.age}</Text> */}
              </View>
            </View>
          </View>
          <Text style={styles.bio}>{user.bio}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomButton
              title="Close"
              onPress={onClose}
              style={{
                marginTop: 15,
                width: windowWidth / 2.5,
                backgroundColor: COLOR.white,
                borderWidth: 1,
                borderColor: COLOR.royalBlue,
                borderRadius: 28,
              }}
              textStyle={{color: COLOR.royalBlue}}
            />
            <CustomButton
              title="Chat"
              onPress={() => console.log('Join pressed')}
              style={{
                marginTop: 15,
                width: windowWidth / 2.5,
                borderRadius: 28,
              }}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    // height: windowHeight * 0.5,
    backgroundColor: COLOR.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // alignItems: 'center',
    padding: 20,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: COLOR.black,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  detail: {
    fontSize: 14,
    color: COLOR.black,
    fontWeight: '500',
  },
  chatButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  chatText: {
    color: 'white',
    fontWeight: '600',
  },
  close: {
    marginTop: 15,
  },
});
