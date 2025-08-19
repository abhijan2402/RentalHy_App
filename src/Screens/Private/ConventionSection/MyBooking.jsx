import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';

const dummyBookings = [
  {
    id: '1',
    vendorName: 'Grand Convention Hall',
    vendorImage:
      'https://kobe-cc.jp/kcc/wp-content/uploads/2017/10/img_01-6-1024x622.jpg',
    date: '25 Aug 2025',
    slots: ['10:00 - 12:00', '12:00 - 2:00'],
    attendees: 150,
    address: '123 MG Road, Bangalore',
    price: '₹5000',
    status: 'Pending',
  },
  {
    id: '2',
    vendorName: 'Green Farm House',
    vendorImage: 'https://www.ahstatic.com/photos/9884_ho_00_p_1024x768.jpg',
    date: '30 Aug 2025',
    slots: ['Full Day'],
    attendees: 60,
    address: '456 Ring Road, Delhi',
    price: '₹12000',
    status: 'Accepted',
  },
];

const BookingCard = ({booking}) => {
  const getStatusColor = status => {
    switch (status) {
      case 'Accepted':
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      case 'Cancelled':
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
          <Text style={styles.vendorName}>{booking.vendorName}</Text>
          <Text style={styles.price}>{booking.price}</Text>
        </View>
        <Text style={[styles.status, {color: getStatusColor(booking.status)}]}>
          {booking.status}
        </Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.label}>📅 Date: {booking.date}</Text>
        <Text style={styles.label}>👥 Attendees: {booking.attendees}</Text>
        <Text style={styles.label}>📍 Address: {booking.address}</Text>
        <Text style={styles.label}>⏰ Slots:</Text>
        {booking.slots.map((slot, idx) => (
          <Text key={idx} style={styles.slot}>
            • {slot}
          </Text>
        ))}
      </View>
    </View>
  );
};

const MyBooking = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title={'My Bookings'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{padding: 15}}>
        {dummyBookings.map(booking => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </ScrollView>
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
    fontSize: 14,
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
