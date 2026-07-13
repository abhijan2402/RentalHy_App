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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import moment from 'moment';

const InfoRow = ({label, value}) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{String(value)}</Text>
    </View>
  );
};

const getStatusStyle = status => {
  if (status === 'accepted' || status === 'success') {
    return {backgroundColor: '#E8F7EE', color: '#167A3E'};
  }
  if (status.includes('cancelled') || status === 'rejected') {
    return {backgroundColor: '#FDECEC', color: '#B42318'};
  }
  return {backgroundColor: '#FFF4E5', color: '#B54708'};
};

const hasPendingCancellationRequest = (order, normalizedStatus) => {
  const normalizedRawStatus = String(order?.order_status_raw || '').toLowerCase();
  const cancellationStatus = String(
    order?.cancel_request_status ||
      order?.cancellation_status ||
      order?.cancel_status ||
      '',
  ).toLowerCase();

  const requestFlag =
    order?.is_cancel_requested ??
    order?.cancel_requested ??
    order?.cancellation_requested;

  return (
    normalizedStatus === 'offline_pending' ||
    normalizedRawStatus === 'offline_pending' ||
    requestFlag === true ||
    requestFlag === 1 ||
    requestFlag === '1' ||
    ['pending', 'requested', 'pending_approval'].includes(cancellationStatus) ||
    (normalizedStatus.includes('cancel') &&
      (normalizedStatus.includes('request') ||
        normalizedStatus.includes('pending'))) ||
    (['accepted', 'success'].includes(normalizedStatus) &&
      Boolean(order?.reject_reason || order?.cancellation_reason))
  );
};

const OrderCard = ({order, postRequest, showToast, onOrderUpdated}) => {
  const [status, setStatus] = useState(order.order_status || order.status);
  const normalizedStatus = String(status || '').toLowerCase();
  const statusStyle = getStatusStyle(normalizedStatus);
  const hasCancellationRequest = hasPendingCancellationRequest(
    order,
    normalizedStatus,
  );
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

  useEffect(() => {
    setStatus(order.order_status || order.status);
  }, [order.order_status, order.status]);

  const handleCancellationRequest = async action => {
    setButtonLoader({type: `cancel-${action}`, loading: true});

    const res = await postRequest(
      `public/api/booking/${action}-cancel/${order.id}`,
    );

    if (res?.success && res?.data?.success !== false) {
      showToast(
        res?.data?.message ||
          `Cancellation ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        'success',
      );
      await onOrderUpdated?.();
    } else {
      showToast(
        res?.error ||
          res?.data?.message ||
          `Failed to ${action} cancellation`,
        'error',
      );
    }

    setButtonLoader({type: `cancel-${action}`, loading: false});
  };

  const handleAccept = async orderData => {
    setButtonLoader({type: 'accept', loading: true});

    const res = await postRequest(`public/api/payments/${orderData.id}/accept`);

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

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: hall?.type_images?.[0]?.image_url || hall?.image_url || '',
          }}
          style={styles.image}
        />

        <View style={styles.headerContent}>
          <Text style={styles.propertyName}>{hall?.title || 'N/A'}</Text>
          <Text style={styles.orderId}>Order #{order?.id || '—'}</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.price}>₹{order?.amount || '0.00'}</Text>
            <View style={[styles.statusBadge, {backgroundColor: statusStyle.backgroundColor}]}>
              <Text style={[styles.status, {color: statusStyle.color}]}>
                {status || 'Pending'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={[styles.sectionTitle, styles.firstSectionTitle]}>Booking details</Text>
        <InfoRow label="Payment Mode" value={order?.payment_mode} />
        <InfoRow label="Booking Date" value={order?.booking_date} />
        <InfoRow label="Event Time" value={order?.event_time} />
        <InfoRow
          label="Ordered On"
          value={order?.created_at ? moment(order.created_at).format('DD MMM YYYY') : null}
        />

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Customer details</Text>

        <InfoRow label="Customer" value={order?.full_name} />
        {canShowMobile ? (
          <>
            <InfoRow label="Phone" value={order?.mobail_number} />
            <InfoRow label="Alt Number" value={order?.alt_number} />
          </>
        ) : null}
        <InfoRow label="Address" value={order?.address} />
        <InfoRow label="Pin Code" value={order?.pin_code} />
        <InfoRow label="Guests" value={order?.number_of_attendess} />
        <InfoRow label="Comment" value={order?.comment} />
        <InfoRow
          label="Cancellation reason"
          value={order?.cancellation_reason || order?.reject_reason}
        />
      </View>

      {hasCancellationRequest ? (
        <View style={styles.cancellationRequestBox}>
          <Text style={styles.cancellationRequestTitle}>
            Cancellation requested
          </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptBtn]}
              onPress={() => handleCancellationRequest('approve')}
              disabled={buttonLoader.loading}>
              {buttonLoader.loading &&
              buttonLoader.type === 'cancel-approve' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Approve cancellation</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectBtn]}
              onPress={() => handleCancellationRequest('reject')}
              disabled={buttonLoader.loading}>
              {buttonLoader.loading &&
              buttonLoader.type === 'cancel-reject' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Reject cancellation</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {normalizedStatus === 'pending' && !hasCancellationRequest ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptBtn]}
            onPress={() => handleAccept(order)}
            disabled={buttonLoader.loading && buttonLoader.type === 'accept'}>
            {buttonLoader.loading && buttonLoader.type === 'accept' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Accept</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectBtn]}
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
    if (pageNum > lastPage && append) {
      return;
    }

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
          showToast(res?.data?.message || 'Failed to fetch bookings', 'error');
        }
      })
      .catch(err => {
        console.error('Booking Error:', err);
        showToast('An error occurred while fetching bookings', 'error');
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
    // getRequest is supplied by the API context and is not referentially stable.
    // Re-running for its identity would repeatedly refetch while this screen is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus]);

  const loadMore = () => {
    if (!loadingMore && page < lastPage) {
      getBooking(page + 1, true);
    }
  };

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
            onOrderUpdated={() => getBooking(1, false)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          !loader && dummyOrders.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loader ? (
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" color={COLOR.primary} />
              <Text style={styles.loadingText}>Loading your orders…</Text>
            </View>
          ) : (
            <View style={styles.emptyView}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>⌑</Text>
              </View>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptyText}>New space bookings will appear here.</Text>
            </View>
          )
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={COLOR.primary || '#007AFF'}
              style={styles.footerLoader}
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
    backgroundColor: '#F6F7F9',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyListContent: {
    flex: 1,
  },
  loadingView: {
    paddingTop: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#667085',
    fontSize: 14,
    fontWeight: '500',
  },
  footerLoader: {
    marginVertical: 15,
  },
  cancellationRequestBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E4E7EC',
    paddingTop: 14,
  },
  cancellationRequestTitle: {
    marginHorizontal: 16,
    marginBottom: 10,
    color: '#B54708',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCEBEC',
    marginBottom: 14,
  },
  emptyIconText: {
    color: COLOR.primary,
    fontSize: 30,
    fontWeight: '700',
  },
  emptyTitle: {
    color: '#101828',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#667085',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#EAECF0',
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#101828',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#F2F4F7',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  propertyName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },
  orderId: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 3,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    color: COLOR.primary,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  details: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#344054',
  },
  firstSectionTitle: {
    marginTop: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  infoLabel: {
    flex: 0.45,
    fontSize: 14,
    color: '#667085',
  },
  infoValue: {
    flex: 0.55,
    fontSize: 14,
    color: '#101828',
    fontWeight: '500',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    padding: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  actionButton: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptBtn: {
    flex: 1,
    marginRight: 6,
    backgroundColor: '#198754',
    padding: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectBtn: {
    flex: 1,
    marginLeft: 6,
    backgroundColor: COLOR.primary,
    padding: 11,
    borderRadius: 10,
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
