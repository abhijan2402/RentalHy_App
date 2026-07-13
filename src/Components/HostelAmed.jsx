import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AmedSection from './AmedSection';

const HostelAmed = ({ AllData }) => {
  const generalInfo = [
    { icon: '📏', label: 'Minimum Room Size', value: AllData?.room_size_min },
    { icon: '📐', label: 'Maximum Room Size', value: AllData?.room_size_max },
    { icon: '🏠', label: 'Hostel Type', value: AllData?.hostel_type },
    { icon: '🛋️', label: 'Furnishing Status', value: AllData?.furnishing_status },
  ];

  const priceInfo = [
    { icon: '🛏️', label: 'Single Room', value: AllData?.single_room_price },
    { icon: '🛏️', label: 'Double Sharing', value: AllData?.double_sharing_price },
    { icon: '🛏️', label: 'Triple Sharing', value: AllData?.triple_sharing_price },
    { icon: '🛏️', label: 'Four Sharing', value: AllData?.four_sharing_price },
    { icon: '🔐', label: 'Security Deposit', value: AllData?.security_deposit },
  ];

  const stayInfo = [
    { icon: '☀️', label: 'One Day Stay', value: AllData?.one_day_stay },
    { icon: '🗓️', label: 'One Week Stay', value: AllData?.one_week_stay },
    { icon: '📅', label: 'One Month Stay', value: AllData?.one_month_stay },
  ];

  const facilityInfo = [
    { icon: '🚿', label: 'Bathroom Type', value: AllData?.bathroom_type },
    { icon: '🍳', label: 'Kitchen', value: AllData?.kitchen ? 'Yes' : 'No' },
    { icon: '📶', label: 'Wi-Fi', value: AllData?.wifi ? 'Yes' : 'No' },
    { icon: '❄️', label: 'Air Conditioning', value: AllData?.ac ? 'Yes' : 'No' },
    { icon: '🧺', label: 'Laundry Service', value: AllData?.laundry_service ? 'Yes' : 'No' },
    { icon: '🧹', label: 'Housekeeping', value: AllData?.housekeeping ? 'Yes' : 'No' },
    { icon: '♨️', label: 'Hot Water', value: AllData?.hot_water ? 'Yes' : 'No' },
    { icon: '⚡', label: 'Power Backup', value: AllData?.power_backup ? 'Yes' : 'No' },
    { icon: '🅿️', label: 'Parking', value: AllData?.parking ? 'Yes' : 'No' },
    { icon: '🏋️', label: 'Gym', value: AllData?.gym ? 'Yes' : 'No' },
    { icon: '🎮', label: 'Play Area', value: AllData?.play_area ? 'Yes' : 'No' },
    { icon: '📺', label: 'Television', value: AllData?.tv ? 'Yes' : 'No' },
    { icon: '🍽️', label: 'Dining Table', value: AllData?.dining_table ? 'Yes' : 'No' },
    { icon: '🛡️', label: 'Security', value: AllData?.security ? 'Yes' : 'No' },
    { icon: '💧', label: 'RO Water', value: AllData?.ro_water ? 'Yes' : 'No' },
    { icon: '📚', label: 'Study Area', value: AllData?.study_area ? 'Yes' : 'No' },
    { icon: '🍲', label: 'Mess', value: AllData?.mess ? 'Yes' : 'No' },
  ];

  const mealInfo = [
    { label: 'Breakfast', value: AllData?.breakfast ? 'Yes' : 'No' },
    { label: 'Lunch', value: AllData?.lunch ? 'Yes' : 'No' },
    { label: 'Dinner', value: AllData?.dinner ? 'Yes' : 'No' },
    { label: 'Tea/Coffee', value: AllData?.tea_coffee ? 'Yes' : 'No' },
    { label: 'Snacks', value: AllData?.snacks ? 'Yes' : 'No' },
  ];

  const mealTiming = [
    { label: 'Breakfast Timing', value: AllData?.breakfast_timing || 'N/A' },
    { label: 'Tea/Coffee Timing', value: AllData?.tea_coffee_timing || 'N/A' },
    { label: 'Lunch Timing', value: AllData?.lunch_timing || 'N/A' },
    { label: 'Snacks Timing', value: AllData?.snacks_timing || 'N/A' },
    { label: 'Dinner Timing', value: AllData?.dinner_timing || 'N/A' },
  ];

  const policyInfo = [
    { label: 'Documents Required', value: AllData?.documents_required || 'N/A' },
    { label: 'Rules & Policies', value: AllData?.rules_policies || 'N/A' },
    { label: 'Gate Closing Time', value: AllData?.gate_closing_time || 'N/A' },
    { label: 'Visitors Allowed', value: AllData?.visitors_allowed ? 'Yes' : 'No' },
    { label: 'Smoking/Alcohol Policy', value: AllData?.smoking_alcohol_policy || 'N/A' },
  ];

  const extraInfo = [
    { label: 'Single Room Day Price', value: AllData?.single_room_day_price || 'N/A' },
    { label: 'Open Time', value: AllData?.get_open_time || 'N/A' },
    { label: 'Alcohol', value: AllData?.alcohol || 'N/A' },
    { label: 'Pet Allowed', value: AllData?.pet_allowed || 'N/A' },
    { label: 'Floor', value: AllData?.floor || 'N/A' },
    { label: 'Map Link', value: AllData?.map_link || 'N/A' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hostel Details</Text>

      <AmedSection title="General Information" icon="🏠" data={generalInfo} />
      <AmedSection title="Room Prices" icon="💳" data={priceInfo} />
      <AmedSection title="Dormantory Package" icon="🗓️" data={stayInfo} />
      <AmedSection title="Facilities" icon="✨" data={facilityInfo} />
      <AmedSection title="Meals Available" icon="🍽️" data={mealInfo} />
      <AmedSection title="Meal Timings" icon="🕐" data={mealTiming} />
      <AmedSection title="Documents & Policies" icon="📜" data={policyInfo} />
      <AmedSection title="Additional Information" icon="ℹ️" data={extraInfo} />
    </View>
  );
};

export default HostelAmed;

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});
