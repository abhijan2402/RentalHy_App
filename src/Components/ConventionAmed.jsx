import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ConventionAmed = ({ AllData }) => {
  // ✅ Map of boolean keys with labels
  const booleanFields = {
    ac_available: 'AC Available',
    royalty_decoration: 'Royalty Decoration',
    generator_available: 'Generator Available',
    water_for_cooking: 'Water for Cooking',
    drinking_water_available: 'Drinking Water Available',
    provides_catering_persons: 'Provides Catering Persons',
    photographers_required: 'Photographers Required',
    children_games: 'Children Games',
    parking_available: 'Parking Available',
    parking_guard: 'Parking Guard',
    alcohol_allowed: 'Alcohol Allowed',
    swimming_pool: 'Swimming Pool',
    food_available: 'Food Available',
    outside_food_allowed: 'Outside Food Allowed',
    cctv_available: 'CCTV Available',
    sound_system_available: 'Sound System Available',
    sound_system_allowed: 'Sound System Allowed',
    adult_games: 'Adult Games',
    kitchen_setup: 'Kitchen Setup',
    free_cancellation: 'Free Cancellation',
    pay_later: 'Pay Later',
    child_pool: 'Child Pool',
    security_guard: 'Security Guard',
    pet_friendly: 'Pet Friendly',
    breakfast_included: 'Breakfast Included',
    restaurant: 'Restaurant',
    cafeteria: 'Cafeteria',
    elevator: 'Elevator',
    reception_24_hours: '24-Hour Reception',
    gym_available: 'Gym Available',
    tv_available: 'TV Available',
    meeting_room: 'Meeting Room',
    free_wifi: 'Free Wi-Fi',
    play_ground: 'Playground',
    refrigerator: 'Refrigerator',
    wellness_centre: 'Wellness Centre',
    wheel_chair_access: 'Wheelchair Access',
  };

  const priceFields = [
    { key: 'wedding_price', label: 'Wedding' },
    { key: 'wedding_anniversary_price', label: 'Wedding Anniversary' },
    { key: 'wedding_reception_price', label: 'Wedding Reception' },
    { key: 'birthday_party_price', label: 'Birthday Party' },
    { key: 'engagement_price', label: 'Engagement' },
    { key: 'family_function_price', label: 'Family Function' },
    { key: 'naming_ceremony_price', label: 'Naming Ceremony' },
    { key: 'first_birthday_party_price', label: 'First Birthday Party' },
    { key: 'sangeet_ceremony_price', label: 'Sangeet Ceremony' },
    { key: 'baby_shower_price', label: 'Baby Shower' },
    { key: 'bride_shower_price', label: 'Bride Shower' },
    { key: 'kids_party_price', label: 'Kids Party' },
    { key: 'dhoti_ceremony_price', label: 'Dhoti Ceremony' },
    { key: 'upanayan_price', label: 'Upanayan Ceremony' },
    { key: 'corporate_event_price', label: 'Corporate Event' },
    { key: 'corporate_party_price', label: 'Corporate Party' },
    { key: 'farewell_price', label: 'Farewell Party' },
    { key: 'stage_event_price', label: 'Stage Event' },
    { key: 'children_party_price', label: 'Children Party' },
    { key: 'annual_party_price', label: 'Annual Party' },
    { key: 'family_get_together_price', label: 'Family Get Together' },
    { key: 'new_year_price', label: 'New Year Party' },
    { key: 'brand_promotion_price', label: 'Brand Promotion' },
    { key: 'fresher_party_price', label: 'Fresher Party' },
    { key: 'get_together_price', label: 'Get Together' },
    { key: 'meeting_price', label: 'Meeting' },
    { key: 'conference_price', label: 'Conference' },
    { key: 'diwali_party_price', label: 'Diwali Party' },
    { key: 'kitty_party_price', label: 'Kitty Party' },
    { key: 'bachelor_party_price', label: 'Bachelor Party' },
    { key: 'christmas_party_price', label: 'Christmas Party' },
    { key: 'product_launch_party_price', label: 'Product Launch' },
    { key: 'corporate_offsite_price', label: 'Corporate Offsite' },
    { key: 'lohri_party_price', label: 'Lohri Party' },
    { key: 'class_reunion_price', label: 'Class Reunion' },
    { key: 'valentines_day_party_price', label: "Valentine's Day Party" },
    { key: 'dealer_meet_price', label: 'Dealer Meet' },
    { key: 'house_party_price', label: 'House Party' },
    { key: 'mini_party_price', label: 'Mini Party' },
    { key: 'group_dining_price', label: 'Group Dining' },
    { key: 'adventure_party_price', label: 'Adventure Party' },
    { key: 'residence_price', label: 'Residence' },
    { key: 'corporate_training_price', label: 'Corporate Training' },
    { key: 'business_dining_price', label: 'Business Dining' },
    { key: 'musical_party_price', label: 'Musical Party' },
    { key: 'exhibition_price', label: 'Exhibition' },
    { key: 'cocktail_price', label: 'Cocktail Party' },
    { key: 'holi_party_price', label: 'Holi Party' },
    { key: 'team_outing_price', label: 'Team Outing' },
    { key: 'social_mixer_price', label: 'Social Mixer' },
    { key: 'photo_shoot_price', label: 'Photo Shoot' },
    { key: 'fashion_show_price', label: 'Fashion Show' },
    { key: 'team_building_price', label: 'Team Building' },
    { key: 'training_price', label: 'Training' },
    { key: 'aqeeqah_ceremony_price', label: 'Aqeeqah Ceremony' },
    { key: 'video_shoot_price', label: 'Video Shoot' },
    { key: 'walking_interview_price', label: 'Walking Interview' },
    { key: 'game_night_price', label: 'Game Night' },
    { key: 'pool_party_price', label: 'Pool Party' },
  ];


  const durationFields = [
    { key: 'day_duration', label: 'Day Duration (hrs)' },
    { key: 'night_duration', label: 'Night Duration (hrs)' },
    { key: 'full_day_duration', label: 'Full Day Duration (hrs)' },
  ];


  const capacityFields = [
    { key: 'seating_capacity', label: 'Rooms availability' },
    { key: 'floating_capacity', label: 'Floating Capacity' },
    { key: 'dining_capacity', label: 'Dining Capacity' },
  ];

  const renderTable = (title, fields) => {
    const hasValidData = fields.some(
      ({ key }) => AllData?.[key] && String(AllData[key]).trim() !== ''
    );
    if (!hasValidData) return null;

    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={styles.sectionHeader}>{title}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 1.5 }]}>Field</Text>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 0 }]}>Value</Text>
            </View>

            {/* Rows */}
            {fields.map(
              ({ key, label }, index) =>
                AllData?.[key] &&
                String(AllData[key]).trim() !== '' && (
                  <View
                    key={key}
                    style={[
                      styles.tableRow,
                      { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' },
                    ]}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{label}</Text>
                    <Text style={[styles.tableCell, { flex: 0 }]}>
                      {isNaN(AllData[key])
                        ? AllData[key]
                        : `₹${parseFloat(AllData[key]).toFixed(2)}`}
                    </Text>
                  </View>
                )
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderDateTable = () => {
    if (!AllData?.dates || Object.keys(AllData.dates).length === 0) return null;

    const dateEntries = Object.entries(AllData.dates);

    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={styles.sectionHeader}>Unavailability Dates</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Header */}
            <View style={[styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 1.2 }]}>Date</Text>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 0 }]}>Unavailable For</Text>
            </View>

            {/* Rows */}
            {dateEntries.map(([date, value], index) => (
              <View
                key={date}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' },
                ]}>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>{date}</Text>
                <Text style={[styles.tableCell, { flex: 0 }]}>{value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View>
      {AllData?.seating_capacity ? (
        <Text style={styles.specText}>
          • Rooms availability : {AllData.seating_capacity}
        </Text>
      ) : null}
      {renderTable('Fields', priceFields)}
      {renderTable('Durations', durationFields)}
      {renderTable('Capacity Details', capacityFields)}


      {renderDateTable()}
    </View>
  );
};

export default ConventionAmed;

const styles = StyleSheet.create({
  specText: {
    fontSize: 15,
    marginVertical: 2,
    color: '#333',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 2,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    minWidth: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  tableCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#333',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#000',
  },
});
