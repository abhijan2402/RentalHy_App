import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';

const OrderCard = ({order, postRequest, showToast}) => {
  const [status, setStatus] = useState(order.order_status);
  const [buttonLoader, setButtonLoader] = useState({
    type: 'accept',
    loading: false,
  });
  const [modalVisible, setModalVisible] = useState({
    visible: false,
    orderId: null,
  });
  const [rejectReason, setRejectReason] = useState('');

  const handleAccept = async order => {
    setButtonLoader({type: 'accept', loading: true});
    const res = await postRequest(`public/api/payments/${order.id}/accept`);
    if (res.data.success || res.data.status) {
      setStatus('accepted');
      showToast('Order accepted successfully', 'success');
    } else {
      showToast(res.data.message || 'Failed to accept order', 'error');
    }
    setButtonLoader({type: 'accept', loading: false});
  };

  const handleReject = order => {
    setModalVisible({visible: true, orderId: order.id});
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }
    setModalVisible({visible: false, orderId: null});
    setRejectReason('');
    setButtonLoader({type: 'reject', loading: true});
    const formData = new FormData();
    formData.append('reason', rejectReason || 'No reason provided');
    const res = await postRequest(
      `public/api/payments/${modalVisible.orderId}/reject`,
      formData,
      true,
    );
    console.log('Reject Response:', res);
    if (res.data.success || res.data.status) {
      setStatus('cancelled');
      showToast('Order rejected successfully', 'success');
    } else {
      showToast(res.data.message || 'Failed to reject order', 'error');
    }
    setButtonLoader({type: 'reject', loading: false});
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: order?.convention_hall?.type_images[0]?.image_url || '',
          }}
          style={styles.image}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={styles.propertyName}>
            {order?.convention_hall?.title}
          </Text>
          <Text style={styles.price}>{order?.amount}</Text>
          <Text
            style={[
              styles.status,
              status === 'accepted' || status === 'success'
                ? {color: 'green'}
                : status.includes('cancelled')
                ? {color: 'red'}
                : {color: '#e67e22'},
              {textTransform: 'capitalize'},
            ]}>
            Status: {status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.label}>Customer: {order.full_name}</Text>
        <Text style={styles.label}>Phone: {order.mobail_number}</Text>
        <Text style={styles.label}>
          Address: {order?.address || order?.convention_hall?.address}
        </Text>
        {/* <Text style={styles.label}>Slots:</Text> */}
        {/* {order.slots.map((slot, idx) => (
          <Text key={idx} style={styles.slot}>
            • {slot}
          </Text>
        ))} */}
      </View>

      {status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleAccept(order)}
            disabled={buttonLoader.loading && buttonLoader.type === 'accept'}>
            {buttonLoader.loading && buttonLoader.type === 'accept' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Accept</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleReject(order)}
            disabled={buttonLoader.loading && buttonLoader.type === 'reject'}>
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        transparent={true}
        visible={modalVisible?.visible ? true : false}
        animationType="slide"
        onRequestClose={() => setModalVisible({visible: false, orderId: null})}>
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
  const [dummyOrders, setDummyOrders] = useState([]);
  const isFocus = navigation.isFocused();
  const {getRequest, postRequest} = useApi();
  const {showToast} = useToast();
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const getBooking = async (pageNum = 1, append = false) => {
    if (pageNum > lastPage) return;
    if (append) setLoadingMore(true);
    else setLoader(true);

    await getRequest(`public/api/vendor/payment_list?page=${pageNum}`)
      .then(res => {
        console.log(res?.data, 'SPACE ORDERS RESPONSE');

        if (res.data.success) {
          const apiData = res.data.data;
          setLastPage(apiData.last_page);
          setPage(apiData.current_page);

          if (append) {
            setDummyOrders(prev => [...prev, ...apiData.data]);
          } else {
            setDummyOrders(apiData.data);
          }
        } else {
          alert(res.data.message || 'Failed to fetch bookings');
        }
      })
      .catch(err => {
        console.error('Booking Error:', err);
        alert('An error occurred while fetching bookings');
      })
      .finally(() => {
        setLoader(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    if (isFocus) {
      setPage(1);
      getBooking(1, false);
    }
  }, [isFocus]);

  const loadMore = () => {
    if (!loadingMore && page < lastPage) {
      getBooking(page + 1, true);
    }
  };

  if (loader && !loadingMore) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title={'Space Orders'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={dummyOrders}
        keyExtractor={item => item.id?.toString()}
        renderItem={({item}) => (
          <OrderCard
            key={item.id}
            order={item}
            postRequest={postRequest}
            showToast={showToast}
          />
        )}
        contentContainerStyle={{padding: 15}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Text>No Order found.</Text>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={COLOR.primary || '#007AFF'}
              style={{marginVertical: 15}}
            />
          ) : null
        }
      />
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
