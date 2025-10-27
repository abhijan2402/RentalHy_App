import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Section = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionHeader}>{title}</Text>
    {data.map((item, index) => (
      <InfoRow key={index} label={item.label} value={item.value} />
    ))}
  </View>
);

const HostelAmed = ({ AllData }) => {
  const generalInfo = [
    { label: 'Room Size Min', value: AllData?.room_size_min || 'N/A' },
    { label: 'Room Size Max', value: AllData?.room_size_max || 'N/A' },
    { label: 'Hostel Type', value: AllData?.hostel_type || 'N/A' },
    { label: 'Furnishing Status', value: AllData?.furnishing_status || 'N/A' },
  ];

  const priceInfo = [
    { label: 'Single Room Price', value: AllData?.single_room_price || 'N/A' },
    { label: 'Double Sharing Price', value: AllData?.double_sharing_price || 'N/A' },
    { label: 'Triple Sharing Price', value: AllData?.triple_sharing_price || 'N/A' },
    { label: 'Four Sharing Price', value: AllData?.four_sharing_price || 'N/A' },
    { label: 'Security Deposit', value: AllData?.security_deposit || 'N/A' },
  ];

  const stayInfo = [
    { label: 'One Day Stay', value: AllData?.one_day_stay || 'N/A' },
    { label: 'One Week Stay', value: AllData?.one_week_stay || 'N/A' },
    { label: 'One Month Stay', value: AllData?.one_month_stay || 'N/A' },
  ];

  const facilityInfo = [
    { label: 'Bathroom Type', value: AllData?.bathroom_type || 'N/A' },
    { label: 'Kitchen', value: AllData?.kitchen ? 'Yes' : 'No' },
    { label: 'Wifi', value: AllData?.wifi ? 'Yes' : 'No' },
    { label: 'AC', value: AllData?.ac ? 'Yes' : 'No' },
    { label: 'Laundry Service', value: AllData?.laundry_service ? 'Yes' : 'No' },
    { label: 'Housekeeping', value: AllData?.housekeeping ? 'Yes' : 'No' },
    { label: 'Hot Water', value: AllData?.hot_water ? 'Yes' : 'No' },
    { label: 'Power Backup', value: AllData?.power_backup ? 'Yes' : 'No' },
    { label: 'Parking', value: AllData?.parking ? 'Yes' : 'No' },
    { label: 'Gym', value: AllData?.gym ? 'Yes' : 'No' },
    { label: 'Play Area', value: AllData?.play_area ? 'Yes' : 'No' },
    { label: 'TV', value: AllData?.tv ? 'Yes' : 'No' },
    { label: 'Dining Table', value: AllData?.dining_table ? 'Yes' : 'No' },
    { label: 'Security', value: AllData?.security ? 'Yes' : 'No' },
    { label: 'RO Water', value: AllData?.ro_water ? 'Yes' : 'No' },
    { label: 'Study Area', value: AllData?.study_area ? 'Yes' : 'No' },
    { label: 'Mess', value: AllData?.mess ? 'Yes' : 'No' },
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

      <Section title="General Information" data={generalInfo} />
      <Section title="Room Prices" data={priceInfo} />
      <Section title="Stay Duration" data={stayInfo} />
      <Section title="Facilities" data={facilityInfo} />
      <Section title="Meals Available" data={mealInfo} />
      <Section title="Meal Timings" data={mealTiming} />
      <Section title="Documents & Policies" data={policyInfo} />
      <Section title="Additional Information" data={extraInfo} />
    </View>
  );
};

export default HostelAmed;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 6,
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: '60%',
  },
  value: {
    fontSize: 14,
    color: '#555',
    width: '40%',
    textAlign: 'right',
  },
});
