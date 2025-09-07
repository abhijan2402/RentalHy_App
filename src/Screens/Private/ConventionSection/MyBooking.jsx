import {StyleSheet, Text, View, Image, ScrollView, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import { useApi } from '../../../Backend/Api';

export const BookingCard = ({booking}) => {
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


  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image source={{uri: booking.vendorImage}} style={styles.image} />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={styles.vendorName}>{booking.full_name}</Text>
          <Text style={styles.price}>{booking.amount}</Text>
        </View>
        <Text style={[styles.status, {color: getStatusColor(booking.status) , textTransform: 'capitalize'}]}>
          {booking.status}
        </Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.label}>📅 Date: {booking.booking_date}</Text>
        <Text style={styles.label}>👥 Attendees: {booking.number_of_attendess}</Text>
        <Text style={styles.label}>📍 Address: {booking.address}</Text>
        <Text style={styles.label}>⏰ Slots:</Text>
        {/* {booking.slots.map((slot, idx) => (
          <Text key={idx} style={styles.slot}>
            • {slot}
          </Text>
        ))} */}
      </View>
    </View>
  );
};

const MyBooking = ({navigation}) => {
  const isFocus = navigation.isFocused();
  const {getRequest} = useApi();
  const [loader, setLoader] = useState(true);
  const [bookings , setBookings] = useState([]);

const getBooking = async () => {
    setLoader(true);
   await getRequest('public/api/payment_list')
      .then(res => {
        if (res.data.status || res.data.success) {
          setBookings(res.data.data);
        } else {
          alert(res.data.message || 'Failed to fetch bookings');
        }
      })
      .catch(err => {
        console.error('Booking Error:', err);
        alert('An error occurred while fetching bookings');
      })
      .finally(() => setLoader(false));
  }

  useEffect(() => {
    if(isFocus){
      getBooking();
    }
  }, [isFocus]);

  if (loader) {
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
        data={bookings?.data || []}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
            <Text>No bookings found.</Text>
          </View>
        )}
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
  slot: {
    marginLeft: 10,
    fontSize: 13,
    color: '#555',
  },
});
