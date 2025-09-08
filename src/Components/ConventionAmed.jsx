import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ConventionAmed = ({AllData}) => {
  return (
    <View>
      <>
        {AllData?.seating_capacity !== undefined && (
          <Text style={styles.specText}>
            • Seating Capacity:{' '}
            {AllData?.seating_capacity && AllData?.seating_capacity}
          </Text>
        )}
        {AllData?.swimming_pool !== undefined && (
          <Text style={styles.specText}>
            • Swimming Pool: {AllData?.swimming_pool ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.cctv_available !== undefined && (
          <Text style={styles.specText}>
            • CCTV Available: {AllData?.cctv_available ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.sound_system_available !== undefined && (
          <Text style={styles.specText}>
            • Sound System Available:{' '}
            {AllData?.sound_system_available ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.adult_games !== undefined && (
          <Text style={styles.specText}>
            • Adult Games: {AllData?.adult_games ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.kitchen_setup !== undefined && (
          <Text style={styles.specText}>
            • Kitchen Setup: {AllData?.kitchen_setup ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.free_cancellation !== undefined && (
          <Text style={styles.specText}>
            • Free Cancellation: {AllData?.free_cancellation ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.pay_later !== undefined && (
          <Text style={styles.specText}>
            • Pay Later: {AllData?.pay_later ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.child_pool !== undefined && (
          <Text style={styles.specText}>
            • Child Pool: {AllData?.child_pool ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.security_guard !== undefined && (
          <Text style={styles.specText}>
            • Security Guard: {AllData?.security_guard ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.pet_friendly !== undefined && (
          <Text style={styles.specText}>
            • Pet Friendly: {AllData?.pet_friendly ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.restaurant !== undefined && (
          <Text style={styles.specText}>
            • Restaurant: {AllData?.restaurant ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.cafeteria !== undefined && (
          <Text style={styles.specText}>
            • Cafeteria: {AllData?.cafeteria ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.elevator !== undefined && (
          <Text style={styles.specText}>
            • Elevator: {AllData?.elevator ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.reception_24_hours !== undefined && (
          <Text style={styles.specText}>
            • 24-Hour Reception: {AllData?.reception_24_hours ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.gym_available !== undefined && (
          <Text style={styles.specText}>
            • Gym Available: {AllData?.gym_available ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.tv_available !== undefined && (
          <Text style={styles.specText}>
            • TV Available: {AllData?.tv_available ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.meeting_room !== undefined && (
          <Text style={styles.specText}>
            • Meeting Room: {AllData?.meeting_room ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.free_wifi !== undefined && (
          <Text style={styles.specText}>
            • Free Wi-Fi: {AllData?.free_wifi ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.play_ground !== undefined && (
          <Text style={styles.specText}>
            • Playground: {AllData?.play_ground ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.refrigerator !== undefined && (
          <Text style={styles.specText}>
            • Refrigerator: {AllData?.refrigerator ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.wellness_centre !== undefined && (
          <Text style={styles.specText}>
            • Wellness Centre: {AllData?.wellness_centre ? 'Yes' : 'No'}
          </Text>
        )}

        {AllData?.wheel_chair_access !== undefined && (
          <Text style={styles.specText}>
            • Wheelchair Access: {AllData?.wheel_chair_access ? 'Yes' : 'No'}
          </Text>
        )}
      </>
    </View>
  );
};

export default ConventionAmed;

const styles = StyleSheet.create({
  specText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
});
