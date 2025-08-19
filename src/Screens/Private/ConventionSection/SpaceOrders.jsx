import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';

const dummyOrders = [
  {
    id: '1',
    propertyName: 'Grand Convention Hall',
    image:
      'https://kobe-cc.jp/kcc/wp-content/uploads/2017/10/img_01-6-1024x622.jpg',
    customerName: 'Ramesh Kumar',
    phone: '9876543210',
    address: '123 MG Road, Bangalore',
    slots: ['10:00 - 12:00', '12:00 - 2:00'],
    price: '₹5000',
    status: 'Pending',
  },
  {
    id: '2',
    propertyName: 'Green Farm House',
    image: 'https://www.ahstatic.com/photos/9884_ho_00_p_1024x768.jpg',
    customerName: 'Sita Devi',
    phone: '9876500000',
    address: '456 Ring Road, Delhi',
    slots: ['Full Day'],
    price: '₹12000',
    status: 'Pending',
  },
];

const OrderCard = ({order}) => {
  const [status, setStatus] = useState(order.status);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleAccept = () => {
    setStatus('Accepted');
  };

  const handleReject = () => {
    setModalVisible(true);
  };

  const submitReject = () => {
    setStatus(`Cancelled: ${rejectReason || 'No reason provided'}`);
    setModalVisible(false);
    setRejectReason('');
  };

  return (
    <View style={styles.card}>
      {/* Property & Price */}
      <View style={styles.cardHeader}>
        <Image source={{uri: order.image}} style={styles.image} />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={styles.propertyName}>{order.propertyName}</Text>
          <Text style={styles.price}>{order.price}</Text>
          <Text
            style={[
              styles.status,
              status === 'Accepted'
                ? {color: 'green'}
                : status.includes('Cancelled')
                ? {color: 'red'}
                : {color: '#e67e22'},
            ]}>
            Status: {status}
          </Text>
        </View>
      </View>

      {/* Customer Details */}
      <View style={styles.details}>
        <Text style={styles.label}>Customer: {order.customerName}</Text>
        <Text style={styles.label}>Phone: {order.phone}</Text>
        <Text style={styles.label}>Address: {order.address}</Text>
        <Text style={styles.label}>Slots:</Text>
        {order.slots.map((slot, idx) => (
          <Text key={idx} style={styles.slot}>
            • {slot}
          </Text>
        ))}
      </View>

      {/* Action Buttons */}
      {status === 'Pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reject Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reason for Rejection</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reason..."
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={submitReject}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SpaceOrders = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title={'Space Orders'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{padding: 15}}>
        {dummyOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SpaceOrders;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: COLOR.primary || '#007AFF',
    marginTop: 2,
    fontWeight: '600',
  },
  status: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  details: {
    padding: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  slot: {
    marginLeft: 10,
    fontSize: 13,
    color: '#555',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  acceptBtn: {
    flex: 1,
    marginRight: 5,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectBtn: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: COLOR.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 80,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
