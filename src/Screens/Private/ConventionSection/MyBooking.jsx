import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';

// Enable Layout Animation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const BookingCard = ({booking, onUpdateService}) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = status => {
    switch (status) {
      case 'accepted':
      case 'success':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const yesNo = value => (value === 1 ? 'Yes' : 'No');

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Image
          source={{
            uri:
              booking?.convention_hall?.type_images?.[0]?.image_url ||
              'https://via.placeholder.com/50',
          }}
          style={styles.image}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={styles.vendorName}>{booking.full_name}</Text>
          <Text style={styles.price}>₹{booking.amount}</Text>
        </View>
        <Text
          style={[
            styles.status,
            {
              color: getStatusColor(booking.order_status),
              textTransform: 'capitalize',
            },
          ]}>
          {booking.order_status}
        </Text>
      </View>

      {/* Booking Details */}
      <View style={styles.details}>
        <Text style={styles.label}>📅 Date: {booking.booking_date}</Text>
        <Text style={styles.label}>
          👥 Attendees: {booking.number_of_attendess}
        </Text>
        <Text style={styles.label}>📍 Address: {booking.address || 'N/A'}</Text>
        <Text style={styles.label}>📞 Mobile: {booking.mobail_number}</Text>
        <Text style={styles.label}>
          📞 Alternate Mobile: {booking.alt_number}
        </Text>
      </View>

      {/* Services Section - Expandable */}
      <TouchableOpacity onPress={toggleExpand} style={styles.expandToggle}>
        <Text style={styles.sectionTitle}>Services Required</Text>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.servicesSection}>
          {[
            {label: 'Catering Needed', key: 'catering_needed'},
            {label: 'Chef Needed', key: 'chef_needed'},
            {label: 'Photographer Needed', key: 'photograper_needed'},
            {label: 'Groceries Needed', key: 'groceries_needed'},
            {label: 'Decorations Needed', key: 'decore_needed'},
          ].map(service => (
            <View style={styles.serviceRow} key={service.key}>
              <Text style={styles.serviceLabel}>{service.label}:</Text>
              <View style={styles.toggleGroup}>
                {/* YES Button */}
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    booking[service.key] === 1 && styles.selectedYes,
                  ]}
                  onPress={() => onUpdateService(booking.id, service.key, 1)}>
                  <Text
                    style={[
                      styles.toggleText,
                      booking[service.key] === 1 && styles.selectedText,
                    ]}>
                    Yes
                  </Text>
                </TouchableOpacity>

                {/* NO Button */}
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    booking[service.key] === 0 && styles.selectedNo,
                  ]}
                  onPress={() => onUpdateService(booking.id, service.key, 0)}>
                  <Text
                    style={[
                      styles.toggleText,
                      booking[service.key] === 0 && styles.selectedText,
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {booking.comment ? (
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Comment:</Text>
              <Text style={[styles.serviceValue, {flex: 1}]}>
                {booking.comment}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const MyBooking = ({navigation}) => {
  const isFocus = navigation.isFocused();
  const {getRequest, postRequest} = useApi();
  const [loader, setLoader] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const {showToast} = useToast();
  // Fetch bookings
  const getBooking = async (pageNum = 1, append = false) => {
    if (pageNum > lastPage) return;
    if (append) setLoadingMore(true);
    else setLoader(true);

    await getRequest(`public/api/payment_list?page=${pageNum}`)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          console.log(apiData, 'BHVVHY');

          setLastPage(apiData.last_page);
          setPage(apiData.current_page);
          if (append) {
            setBookings(prev => [...prev, ...apiData.data]);
          } else {
            setBookings(apiData.data);
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
  const onUpdateService = async (bookingId, field, value) => {
    try {
      // Find the booking object to get current states of all services
      const currentBooking = bookings.find(b => b.id === bookingId);

      if (!currentBooking) return;

      console.log(response,"responseresponse")

      if (response.data.success) {
        // Update UI immediately
        showToast(
          response?.data.message || 'Failed to update service',
          'success',
        );
        getBooking(1, false);
      } else {
        showToast(
          response?.data.message || 'Failed to update service',
          'success',
        );
      }
    } catch (err) {
      console.error('Update Service Error:', err);
      alert('Error updating service');
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
        title={'My Bookings'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={bookings}
        keyExtractor={item => item.id?.toString()}
        renderItem={({item}) => (
          <BookingCard booking={item} onUpdateService={onUpdateService} />
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
            <Text>No bookings found.</Text>
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

export default MyBooking;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: COLOR.primary || '#007AFF',
    fontWeight: '600',
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  details: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  expandToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  expandIcon: {
    fontSize: 18,
    color: '#444',
  },
  servicesSection: {
    padding: 12,
    backgroundColor: '#fdfdfd',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceLabel: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  selectedYes: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  selectedNo: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  toggleText: {
    fontSize: 14,
    color: '#444',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  serviceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
