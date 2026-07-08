import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';

const vendorOptions = [
  {
    id: 7,
    title: 'Property Analytics',
    description: 'View listing, booking and revenue insights',
    icon: 'https://cdn-icons-png.flaticon.com/128/602/602175.png',
    navigate: 'PropertyAnalytics',
  },
  {
    id: 222,
    title: 'Manage Space',
    description: 'Create and manage your listed spaces',
    icon: 'https://cdn-icons-png.flaticon.com/128/3009/3009489.png',
    navigate: 'Management',
  },
  {
    id: 18,
    title: 'Convention/Hall Orders',
    description: 'Review convention and hall orders',
    icon: 'https://cdn-icons-png.flaticon.com/128/9752/9752284.png',
    navigate: 'SpaceOrders',
  },
  {
    id: 8,
    title: 'Hostel Management',
    description: 'Manage hostel listings and reviews',
    icon: 'https://cdn-icons-png.flaticon.com/128/10607/10607354.png',
    navigate: 'HostelReviewManagement',
  },
  {
    id: 119,
    title: 'Hotel Management',
    description: 'Manage hotel listings and reviews',
    icon: 'https://cdn-icons-png.flaticon.com/128/3009/3009489.png',
    navigate: 'HotelManagement',
  },
  {
    id: 190,
    title: 'Hotel Booking Management',
    description: 'Track and manage hotel reservations',
    icon: 'https://cdn-icons-png.flaticon.com/128/2460/2460875.png',
    navigate: 'HotelBookings',
  },
  {
    id: 19,
    title: 'Space Management',
    description: 'View and maintain your properties',
    icon: 'https://cdn-icons-png.flaticon.com/128/1067/1067566.png',
    navigate: 'SpaceManagement',
  },
  {
    id: 10,
    title: 'Bank Account Details',
    description: 'Manage payout and bank information',
    icon: 'https://cdn-icons-png.flaticon.com/128/2830/2830289.png',
    navigate: 'BankAccount',
  },
];

const VendorManagement = ({ navigation }) => (
  <View style={styles.container}>
    <Header
      title="Vendor Management"
      showBack
      onBackPress={() => navigation.goBack()}
    />

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      <View style={styles.introCard}>
        <View style={styles.introIconContainer}>
          <Text style={styles.introIcon}>🏪</Text>
        </View>
        <View style={styles.introTextContainer}>
          <Text style={styles.introTitle}>Your vendor workspace</Text>
          <Text style={styles.introDescription}>
            Manage spaces, bookings, operations and payouts from one place.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Management tools</Text>
      <View style={styles.grid}>
        {vendorOptions.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            style={styles.optionCard}
            onPress={() => navigation.navigate(item.navigate)}>
            <View style={styles.optionTopRow}>
              <View style={styles.iconContainer}>
                <Image source={{ uri: item.icon }} style={styles.icon} />
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
            <Text style={styles.optionTitle}>{item.title}</Text>
            <Text style={styles.optionDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
);

export default VendorManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.primary,
    borderRadius: 18,
    padding: 17,
    shadowColor: '#590205',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4,
  },
  introIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 13,
  },
  introIcon: {
    fontSize: 25,
  },
  introTextContainer: {
    flex: 1,
  },
  introTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLOR.white,
    marginBottom: 4,
  },
  introDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.82)',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 11,
    marginLeft: 3,
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48.4%',
    minHeight: 154,
    backgroundColor: COLOR.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#e9ebef',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#111827',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
    elevation: 2,
  },
  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  iconContainer: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#fff3eb',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  arrow: {
    fontSize: 25,
    lineHeight: 25,
    color: '#a0a6af',
  },
  optionTitle: {
    minHeight: 36,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: '#25282e',
  },
  optionDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
    color: '#7a818c',
  },
});
