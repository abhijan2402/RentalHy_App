import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const HostelAmed = ({AllData}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hostel Details</Text>

      {/* Room Sizes */}
      <Text style={styles.specText}>
        • Room Size Min: {AllData?.room_size_min || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Room Size Max: {AllData?.room_size_max || 'N/A'}
      </Text>

      {/* Hostel Type */}
      <Text style={styles.specText}>
        • Hostel Type: {AllData?.hostel_type || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Furnishing Status: {AllData?.furnishing_status || 'N/A'}
      </Text>

      {/* Room Prices */}
      <Text style={styles.specText}>
        • Single Room Price: {AllData?.single_room_price || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Double Sharing Price: {AllData?.double_sharing_price || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Triple Sharing Price: {AllData?.triple_sharing_price || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Four Sharing Price: {AllData?.four_sharing_price || 'N/A'}
      </Text>

      {/* Security Deposit */}
      <Text style={styles.specText}>
        • Security Deposit: {AllData?.security_deposit || 'N/A'}
      </Text>

      {/* Stays */}
      <Text style={styles.specText}>
        • One Day Stay: {AllData?.one_day_stay || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • One Week Stay: {AllData?.one_week_stay || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • One Month Stay: {AllData?.one_month_stay || 'N/A'}
      </Text>

      {/* Map Link */}
      <Text style={styles.specText}>
        • Map Link: {AllData?.map_link || 'N/A'}
      </Text>

      {/* Bathroom and Kitchen */}
      <Text style={styles.specText}>
        • Bathroom Type: {AllData?.bathroom_type || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Kitchen: {AllData?.kitchen ? 'Yes' : 'No'}
      </Text>

      {/* Facilities */}
      <Text style={styles.specText}>
        • Wifi: {AllData?.wifi ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>• AC: {AllData?.ac ? 'Yes' : 'No'}</Text>
      <Text style={styles.specText}>
        • Laundry Service: {AllData?.laundry_service ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Housekeeping: {AllData?.housekeeping ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Hot Water: {AllData?.hot_water ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Power Backup: {AllData?.power_backup ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Parking: {AllData?.parking ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>• Gym: {AllData?.gym ? 'Yes' : 'No'}</Text>
      <Text style={styles.specText}>
        • Play Area: {AllData?.play_area ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>• TV: {AllData?.tv ? 'Yes' : 'No'}</Text>
      <Text style={styles.specText}>
        • Dining Table: {AllData?.dining_table ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Security: {AllData?.security ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • RO Water: {AllData?.ro_water ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Study Area: {AllData?.study_area ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Mess: {AllData?.mess ? 'Yes' : 'No'}
      </Text>

      {/* Meals */}
      <Text style={styles.specText}>
        • Breakfast: {AllData?.breakfast ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Lunch: {AllData?.lunch ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Dinner: {AllData?.dinner ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Tea/Coffee: {AllData?.tea_coffee ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Snacks: {AllData?.snacks ? 'Yes' : 'No'}
      </Text>

      {/* Meal Timings */}
      <Text style={styles.specText}>
        • Breakfast Timing: {AllData?.breakfast_timing || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Tea/Coffee Timing: {AllData?.tea_coffee_timing || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Lunch Timing: {AllData?.lunch_timing || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Snacks Timing: {AllData?.snacks_timing || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Dinner Timing: {AllData?.dinner_timing || 'N/A'}
      </Text>

      {/* Documents and Policies */}
      <Text style={styles.specText}>
        • Documents Required: {AllData?.documents_required || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Rules & Policies: {AllData?.rules_policies || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Gate Closing Time: {AllData?.gate_closing_time || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Visitors Allowed: {AllData?.visitors_allowed ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.specText}>
        • Smoking/Alcohol Policy: {AllData?.smoking_alcohol_policy || 'N/A'}
      </Text>

      {/* Extra Info */}
      <Text style={styles.specText}>
        • Single Room Day Price: {AllData?.single_room_day_price || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Open Time: {AllData?.get_open_time || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Alcohol: {AllData?.alcohol || 'N/A'}
      </Text>
      <Text style={styles.specText}>
        • Pet Allowed: {AllData?.pet_allowed || 'N/A'}
      </Text>
      <Text style={styles.specText}>• Floor: {AllData?.floor || 'N/A'}</Text>
    </View>
  );
};

export default HostelAmed;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingHorizontal: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  specText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
