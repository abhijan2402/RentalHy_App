import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ConventionAmed = ({AllData}) => {
  return (
    <View>
      <>
        {AllData?.seating_capacity ? (
          <Text style={styles.specText}>
            • Seating Capacity: {AllData.seating_capacity}
          </Text>
        ) : null}

        {AllData?.swimming_pool ? (
          <Text style={styles.specText}>• Swimming Pool: Yes</Text>
        ) : null}

        {AllData?.cctv_available ? (
          <Text style={styles.specText}>• CCTV Available: Yes</Text>
        ) : null}

        {AllData?.sound_system_available ? (
          <Text style={styles.specText}>• Sound System Available: Yes</Text>
        ) : null}

        {AllData?.adult_games ? (
          <Text style={styles.specText}>• Adult Games: Yes</Text>
        ) : null}

        {AllData?.kitchen_setup ? (
          <Text style={styles.specText}>• Kitchen Setup: Yes</Text>
        ) : null}

        {AllData?.free_cancellation ? (
          <Text style={styles.specText}>• Free Cancellation: Yes</Text>
        ) : null}

        {AllData?.pay_later ? (
          <Text style={styles.specText}>• Pay Later: Yes</Text>
        ) : null}

        {AllData?.child_pool ? (
          <Text style={styles.specText}>• Child Pool: Yes</Text>
        ) : null}

        {AllData?.security_guard ? (
          <Text style={styles.specText}>• Security Guard: Yes</Text>
        ) : null}

        {AllData?.pet_friendly ? (
          <Text style={styles.specText}>• Pet Friendly: Yes</Text>
        ) : null}

        {AllData?.restaurant ? (
          <Text style={styles.specText}>• Restaurant: Yes</Text>
        ) : null}

        {AllData?.cafeteria ? (
          <Text style={styles.specText}>• Cafeteria: Yes</Text>
        ) : null}

        {AllData?.elevator ? (
          <Text style={styles.specText}>• Elevator: Yes</Text>
        ) : null}

        {AllData?.reception_24_hours ? (
          <Text style={styles.specText}>• 24-Hour Reception: Yes</Text>
        ) : null}

        {AllData?.gym_available ? (
          <Text style={styles.specText}>• Gym Available: Yes</Text>
        ) : null}

        {AllData?.tv_available ? (
          <Text style={styles.specText}>• TV Available: Yes</Text>
        ) : null}

        {AllData?.meeting_room ? (
          <Text style={styles.specText}>• Meeting Room: Yes</Text>
        ) : null}

        {AllData?.free_wifi ? (
          <Text style={styles.specText}>• Free Wi-Fi: Yes</Text>
        ) : null}

        {AllData?.play_ground ? (
          <Text style={styles.specText}>• Playground: Yes</Text>
        ) : null}

        {AllData?.refrigerator ? (
          <Text style={styles.specText}>• Refrigerator: Yes</Text>
        ) : null}

        {AllData?.wellness_centre ? (
          <Text style={styles.specText}>• Wellness Centre: Yes</Text>
        ) : null}

        {AllData?.wheel_chair_access ? (
          <Text style={styles.specText}>• Wheelchair Access: Yes</Text>
        ) : null}

        {/* Unavailability Dates */}
        {AllData?.dates && Object.keys(AllData.dates).length > 0 && (
          <View style={{marginVertical: 10, width: '40%', left: 20}}>
            <Text>Unavailability Dates</Text>
          </View>
        )}
        {AllData?.dates &&
          Object.entries(AllData.dates).map(([date, value]) => (
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                justifyContent: 'space-around',
              }}
              key={date}>
              <Text>{date} :</Text>
              <Text>{value}</Text>
            </View>
          ))}
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
