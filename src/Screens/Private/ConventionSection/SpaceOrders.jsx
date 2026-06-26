import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import moment from 'moment';

const booleanFields = {
  ac_available: 'AC Available',
  royalty_decoration: 'Royalty Decoration',
  royalty_kitchen: 'Royalty Kitchen',
  generator_available: 'Generator Available',
  water_for_cooking: 'Water For Cooking',
  drinking_water_available: 'Drinking Water Available',
  provides_catering_persons: 'Provides Catering Persons',
  photographers_required: 'Photographers Required',
  children_games: 'Children Games',
  parking_available: 'Parking Available',
  parking_guard: 'Parking Guard',
  alcohol_allowed: 'Alcohol Allowed',
  swimming_pool: 'Swimming Pool',
  food_available: 'Food Available',
  outside_food_allowed: 'Outside Food Allowed',
  cctv_available: 'CCTV Available',
  sound_system_available: 'Sound System Available',
  sound_system_allowed: 'Sound System Allowed',
  adult_games: 'Adult Games',
  kitchen_setup: 'Kitchen Setup',
  free_cancellation: 'Free Cancellation',
  pay_later: 'Pay Later',
  child_pool: 'Child Pool',
  security_guard: 'Security Guard',
  pet_friendly: 'Pet Friendly',
  breakfast_included: 'Breakfast Included',
  restaurant: 'Restaurant',
  cafeteria: 'Cafeteria',
  elevator: 'Elevator',
  reception_24_hours: '24 Hours Reception',
  gym_available: 'Gym Available',
  tv_available: 'TV Available',
  meeting_room: 'Meeting Room',
  free_wifi: 'Free Wifi',
  play_ground: 'Play Ground',
  refrigerator: 'Refrigerator',
  wellness_centre: 'Wellness Centre',
  wheel_chair_access: 'Wheel Chair Access',
};

const formatLabel = key => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace('24 Hours', '24 Hours');
};

const InfoRow = ({label, value}) => {
  if (value === null || value === undefined || value === '') return null;

  return (
    <Text style={styles.label}>
      <Text style={styles.bold}>{label}: </Text>
      {String(value)}
    </Text>
  );
};

const OrderCard = ({order, postRequest, showToast}) => {
  const [status, setStatus] = useState(order.order_status || order.status);
  const normalizedStatus = String(status || '').toLowerCase();
  const canShowMobile =
    normalizedStatus === 'success' || normalizedStatus === 'accepted';
  const [buttonLoader, setButtonLoader] = useState({
    type: 'accept',
    loading: false,
  });

  const [modalVisible, setModalVisible] = useState({
    visible: false,
    orderId: null,
  });

  const [rejectReason, setRejectReason] = useState('');

  const hall = order?.convention_hall;

  const handleAccept = async orderData => {
    setButtonLoader({type: 'accept', loading: true});

    const res = await postRequest(`public/api/payments/${orderData.id}/accept`);
console.log(res,"RESSLLLL");

    if (res?.data?.success || res?.data?.status) {
      setStatus('accepted');
      showToast('Order accepted successfully', 'success');
    } else {
      showToast(res?.data?.message || 'Failed to accept order', 'error');
    }

    setButtonLoader({type: 'accept', loading: false});
  };

  const handleReject = orderData => {
    setModalVisible({visible: true, orderId: orderData.id});
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    const orderId = modalVisible.orderId;

    setModalVisible({visible: false, orderId: null});
    setButtonLoader({type: 'reject', loading: true});

    const formData = new FormData();
    formData.append('reason', rejectReason || 'No reason provided');

    const res = await postRequest(
      `public/api/payments/${orderId}/reject`,
      formData,
      true,
    );

    if (res?.data?.success || res?.data?.status) {
      setStatus('cancelled');
      showToast('Order rejected successfully', 'success');
    } else {
      showToast(res?.data?.message || 'Failed to reject order', 'error');
    }

    setRejectReason('');
    setButtonLoader({type: 'reject', loading: false});
  };

  const priceFields = Object.entries(hall || {}).filter(([key, value]) => {
    return key.includes('_price') && value !== null && value !== undefined && value !== '';
  });

  const dateFields = hall?.dates ? Object.entries(hall.dates) : [];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: hall?.type_images?.[0]?.image_url || hall?.image_url || '',
          }}
          style={styles.image}
        />

        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={styles.propertyName}>{hall?.title || 'N/A'}</Text>

          <Text style={styles.price}>₹{order?.amount || '0.00'}</Text>

          <Text
            style={[
              styles.status,
              normalizedStatus === 'accepted' || normalizedStatus === 'success'
                ? {color: 'green'}
                : normalizedStatus.includes('cancelled')
                ? {color: 'red'}
                : {color: '#e67e22'},
            ]}>
            Status: {status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.sectionTitle}>Booking Information</Text>
        <InfoRow label="Payment Mode" value={order?.payment_mode} />
        <InfoRow label="Amount" value={`₹${order?.amount}`} />
        <InfoRow label="Order Status" value={order?.order_status} />
        <InfoRow label="Booking Date" value={order?.booking_date} />
        <InfoRow label="Event Time" value={order?.event_time} />
        <InfoRow label="Created At" value={moment(order?.created_at).format("DD-MM-YYYY")} />

        <Text style={styles.sectionTitle}>Customer Information</Text>

        <InfoRow label="Customer" value={order?.full_name} />
        {canShowMobile ? (
          <>
            <InfoRow label="Phone" value={order?.mobail_number} />
            <InfoRow label="Alt Number" value={order?.alt_number} />
          </>
        ) : null}
        <InfoRow label="Address" value={order?.address} />
        <InfoRow label="Pin Code" value={order?.pin_code} />
        <InfoRow label="Attendees" value={order?.number_of_attendess} />
        <InfoRow label="Comment" value={order?.comment} />

      </View>

      {normalizedStatus === 'pending' ? (
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
            {buttonLoader.loading && buttonLoader.type === 'reject' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Reject</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal
        transparent
        visible={modalVisible.visible}
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
                onPress={() => {
                  setModalVisible({visible: false, orderId: null});
                  setRejectReason('');
                }}>
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
    if (pageNum > lastPage && append) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoader(true);
    }

    await getRequest(`public/api/vendor/payment_list?page=${pageNum}`)
      .then(res => {
        console.log(res?.data, 'SPACE ORDERS RESPONSE');

        if (res?.data?.success) {
          const apiData = res.data.data;

          setLastPage(apiData.last_page);
          setPage(apiData.current_page);

          if (append) {
            setDummyOrders(prev => [...prev, ...apiData.data]);
          } else {
            setDummyOrders(apiData.data);
          }
        } else {
          alert(res?.data?.message || 'Failed to fetch bookings');
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
      <View style={styles.centerView}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Space Orders"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={dummyOrders}
        keyExtractor={item => item.id?.toString()}
        renderItem={({item}) => (
          <OrderCard
            order={item}
            postRequest={postRequest}
            showToast={showToast}
          />
        )}
        contentContainerStyle={{padding: 15}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyView}>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
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
    backgroundColor: '#eee',
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
    textTransform: 'capitalize',
  },
  details: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    color: '#000',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#444',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#222',
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
    backgroundColor: COLOR.primary || '#d9534f',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageBox: {
    marginRight: 10,
    width: 100,
  },
  smallImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  imageType: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    color: '#555',
    textTransform: 'capitalize',
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
