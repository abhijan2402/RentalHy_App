import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { windowWidth } from '../Constants/Dimensions';

const ConventionAmed = ({ AllData }) => {
  console.log(AllData,"ALLLLLLLDDDDDD");

  const parseDates = dates => {
    if (!dates) return {};

    if (typeof dates === 'string') {
      try {
        return JSON.parse(dates);
      } catch (error) {
        return {};
      }
    }

    return typeof dates === 'object' ? dates : {};
  };

  const isDateKey = date => {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(date) || /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const addUnavailableValue = (dates, date, value) => {
    if (!isDateKey(date) || !value) return;

    const existingValues = dates[date]
      ? String(dates[date]).split(',').map(item => item.trim()).filter(Boolean)
      : [];
    const nextValue = String(value).replace('_', ' ');

    if (!existingValues.some(item => item.toLowerCase() === nextValue.toLowerCase())) {
      dates[date] = [...existingValues, nextValue].join(', ');
    }
  };

  const getBookedSlotsLabel = dateData => {
    const slotTimes = dateData?.slots
      ?.filter(slot => slot?.status === 'booked')
      ?.map(slot => slot?.event_time)
      ?.filter(Boolean);

    const bookedSlots = slotTimes?.length ? slotTimes : [dateData?.event_time].filter(Boolean);

    return bookedSlots.map(slot => `${String(slot).replace('_', ' ')} booked`);
  };

  const getUnavailableDateEntries = () => {
    const dates = parseDates(AllData?.dates);
    const unavailableDates = Object.entries(dates).reduce((acc, [date, value]) => {
      if (isDateKey(date) && typeof value === 'string') {
        acc[date] = value;
      }

      return acc;
    }, {});

    AllData?.dates_data?.forEach(dateData => {
      getBookedSlotsLabel(dateData).forEach(value => {
        addUnavailableValue(unavailableDates, dateData?.date, value);
      });
    });

    AllData?.availability_summary?.booked_dates_list?.forEach(date => {
      if (isDateKey(date) && !unavailableDates[date]) {
        unavailableDates[date] = 'Booked';
      }
    });

    return Object.entries(unavailableDates);
  };
  
  const booleanFields = {
    ac_available: 'AC Available',
    royalty_decoration: 'Royalty Decoration',
    royalty_kitchen: 'Royalty Kitchen',
    generator_available: 'Generator Available',
    water_for_cooking: 'Water for Cooking',
    drinking_water_available: 'Drinking Water Available',
    provides_catering_persons: 'Provides Catering Persons',
    photographers_required: 'Photographers Required',
    children_games: 'Children Games',
    parking: 'Parking Available',
    parking_available: 'Parking Available',
    valet_parking: 'Valet Parking',
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
    kitchen: 'Kitchen',
    refrigerator: 'Refrigerator',
    adult_pool: 'Adult Pool',
    wellness_centre: 'Wellness Centre',
    wheel_chair_access: 'Wheelchair Access',
  };

  const amenityFields = Object.entries(booleanFields)
    .filter(
      ([key]) =>
        !['parking', 'parking_available', 'valet_parking'].includes(key),
    )
    .map(([key, label]) => ({
      key,
      label,
    }));

  const priceFields = [
    { key: 'day_visit_price', label: 'Day Visit Price' },
    { key: 'day_visit', label: 'Day Visit Price' },
    { key: 'night_visit_price', label: 'Night Visit Price' },
    { key: 'night_visit', label: 'Night Visit Price' },
    { key: '24_hours_visit_price', label: 'Full Day Price' },
    { key: 'full_day_price', label: 'Full Day Price' },
    { key: 'corporate_outing_price', label: 'Corporate Outing Price' },
    { key: 'corporate_outing', label: 'Corporate Outing Price' },
    { key: 'banquet_hall_charges', label: 'Banquet Hall Charges' },
    { key: 'occasion_charges', label: 'Occasion Charges' },
    { key: 'other_charges', label: 'Other Charges' },
    { key: 'wedding_price', label: 'Wedding' },
    { key: 'wedding_anniversary_price', label: 'Wedding Anniversary' },
    { key: 'wedding_reception_price', label: 'Wedding Reception' },
    { key: 'birthday_party_price', label: 'Birthday Party' },
    { key: 'ring_ceremony_price', label: 'Ring Ceremony' },
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

  const formatValue = value => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).join(', ');
    }

    return value;
  };

  const hasDisplayValue = value =>
    formatValue(value) !== undefined &&
    formatValue(value) !== null &&
    String(formatValue(value)).trim() !== '';

  const areaKey = hasDisplayValue(AllData?.area_sq_ft)
    ? 'area_sq_ft'
    : 'area_sqft';
  const parkingKey = hasDisplayValue(AllData?.parking)
    ? 'parking'
    : 'parking_available';

  const capacityFields = [
    { key: 'seating_capacity', label: 'Hall capacity (in Persons)' },
    { key: 'room_details', label: 'Hall capacity (in Persons)' },
    { key: areaKey, label: 'Area Sq Ft' },
    { key: 'plot_area', label: 'Plot Area' },
    { key: 'built_up_area', label: 'Built Up Area' },
    { key: 'carpet_area', label: 'Carpet Area' },
    { key: 'floating_capacity', label: 'Floating Capacity' },
    { key: 'dining_capacity', label: 'Dining Capacity' },
  ];

  const parkingFields = [
    { key: parkingKey, label: 'Parking Available' },
    { key: 'valet_parking', label: 'Valet Parking' },
    { key: 'parking_capacity', label: 'Parking Capacity' },
    { key: 'parking_type', label: 'Parking Type' },
    { key: 'parking_charges', label: 'Parking Charges' },
  ];

  const gameFields = [
    {
      key: hasDisplayValue(AllData?.adult_games_names)
        ? 'adult_games_names'
        : 'adult_games_desc',
      label: 'Adult Games Names',
    },
    {
      key: hasDisplayValue(AllData?.children_games_names)
        ? 'children_games_names'
        : 'children_games_desc',
      label: 'Children Games Names',
    },
  ];

  const renderTable = (title, fields) => {
    const isAmenityTable = title === 'Amenities';
    const isYesValue = value =>
      value === true || value === 1 || value === '1' || value === 'yes';
    const validFields = fields.filter(({ key }) => {
      const value = AllData?.[key];

      if (value === undefined || value === null || String(value).trim() === '') {
        return false;
      }

      if (isAmenityTable) {
        return isYesValue(value);
      }

      return true;
    });

    if (validFields.length === 0) return null;

    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={styles.sectionHeader}>{title}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 1.5 }]}>
                Field
              </Text>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 1 ,textAlign:"right"}]}>
                Value
              </Text>
            </View>

            {validFields.map(({ key, label }, index) => {
  const value = formatValue(AllData?.[key]);
  const isPrice =
    title === 'Prices' ||
    key?.toLowerCase()?.includes('price') ||
    key?.toLowerCase()?.includes('charges');
  const isAmenity = title === 'Amenities';
  const isBoolean = Object.prototype.hasOwnProperty.call(booleanFields, key);

  // ✅ Hide empty/null/undefined values
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return (
    <View
      key={key}
      style={[
        styles.tableRow,
        {
          backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
        },
      ]}>
      <Text
        style={[
          styles.tableCell,
          {
            flex: 1.5,
            width: windowWidth / 2.5,
          },
        ]}>
        {label}
      </Text>

      <Text
        style={[
          styles.tableCell,
          {
            flex: 1,
            width: windowWidth / 3,
            textAlign: 'right',
          },
        ]}>
        {isAmenity || isBoolean
          ? isYesValue(value)
            ? 'Yes'
            : 'No'
          : isPrice
          ? `₹${value}`
          : value}
      </Text>
    </View>
  );
})}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderDateTable = () => {
    const dateEntries = getUnavailableDateEntries();

    if (dateEntries.length === 0) return null;

    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={styles.sectionHeader}>Unavailability Dates</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 1.2 }]}>
                Date
              </Text>
              <Text style={[styles.tableCell, styles.headerCell, { flex: 1,textAlign:"right" }]}>
                Unavailable For
              </Text>
            </View>

            {dateEntries.map(([date, value], index) => (
              <View
                key={date}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' },
                ]}
              >
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{date}</Text>
                <Text style={[styles.tableCell, { flex: 1,textAlign:"right" }]}>{value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View>
      {renderTable('Amenities', amenityFields)}
      {renderTable('Prices', priceFields)}
      {renderTable('Durations', durationFields)}
      {renderTable('Availability', capacityFields)}
      {renderTable('Parking Details', parkingFields)}
      {renderTable('Game Details', gameFields)}
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
