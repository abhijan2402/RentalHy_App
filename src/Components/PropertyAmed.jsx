import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLOR } from '../Constants/Colors';

const amenityIcons = [
  { words: ['wifi', 'internet'], icon: '📶' },
  { words: ['parking', 'garage'], icon: '🅿️' },
  { words: ['air condition', 'ac'], icon: '❄️' },
  { words: ['power', 'electric', 'backup'], icon: '⚡' },
  { words: ['water'], icon: '💧' },
  { words: ['security', 'cctv', 'guard'], icon: '🛡️' },
  { words: ['lift', 'elevator'], icon: '🛗' },
  { words: ['gym', 'fitness'], icon: '🏋️' },
  { words: ['pool', 'swimming'], icon: '🏊' },
  { words: ['garden', 'park', 'lawn'], icon: '🌿' },
  { words: ['furnished', 'furniture', 'sofa'], icon: '🛋️' },
  { words: ['kitchen', 'cooking'], icon: '🍳' },
  { words: ['tv', 'television'], icon: '📺' },
  { words: ['laundry', 'washing'], icon: '🧺' },
  { words: ['pet'], icon: '🐾' },
  { words: ['balcony', 'terrace'], icon: '🌇' },
  { words: ['club', 'community'], icon: '🏠' },
  { words: ['gas'], icon: '🔥' },
];

const formatLabel = value =>
  String(value)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());

const formatValue = value => {
  if (value === undefined || value === null || value === '') {
    return 'N/A';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
    } catch {
      return value;
    }
  }

  return String(value);
};

const getAmenities = amenities => {
  if (!amenities) {
    return [];
  }

  try {
    const parsed =
      typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

    if (Array.isArray(parsed)) {
      return parsed.map((item, index) =>
        item && typeof item === 'object'
          ? {
              name: item.name || item.key || `Amenity ${index + 1}`,
              value: item.value,
            }
          : { name: item },
      );
    }

    return Object.entries(parsed).map(([name, value]) => ({ name, value }));
  } catch {
    return String(amenities)
      .split(',')
      .filter(Boolean)
      .map(name => ({ name: name.trim() }));
  }
};

const getAmenityIcon = name => {
  const normalizedName = String(name).replace(/[_-]/g, ' ').toLowerCase();
  return (
    amenityIcons.find(({ words }) =>
      words.some(word => normalizedName.includes(word)),
    )?.icon || '✨'
  );
};

const InfoCard = ({ icon, label, value }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIconContainer}>
      <Text style={styles.infoIcon}>{icon}</Text>
    </View>
    <View style={styles.infoText}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {formatValue(value)}
      </Text>
    </View>
  </View>
);

const Section = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionHeader}>{title}</Text>
    <View style={styles.infoGrid}>
      {data.map(item => (
        <InfoCard key={item.label} {...item} />
      ))}
    </View>
  </View>
);

const PropertyAmed = ({ AllData }) => {
  const amenities = getAmenities(AllData?.amenities);
  const propertyInfo = [
    { icon: '🏠', label: 'Property Type', value: AllData?.property_type },
    { icon: '🛌', label: 'BHK', value: AllData?.bhk },
    { icon: '📐', label: 'Area', value: AllData?.area_sqft ? `${AllData.area_sqft} sq.ft` : null },
    { icon: '🛋️', label: 'Furnishing', value: AllData?.furnishing_status },
    { icon: '📅', label: 'Availability', value: AllData?.availability },
    { icon: '👥', label: 'Preferred Tenant', value: AllData?.preferred_tenant_type },
  ];
  const additionalInfo = [
    { icon: '🚿', label: 'Bathrooms', value: AllData?.bathrooms },
    { icon: '🅿️', label: 'Parking', value: AllData?.parking_available },
    { icon: '🧭', label: 'Facing', value: AllData?.facing_direction },
    { icon: '🏢', label: 'Floor', value: AllData?.floor },
    { icon: '🛡️', label: 'Security', value: AllData?.security_avl ? 'Yes' : 'No' },
    { icon: '💰', label: 'Advance', value: AllData?.advance },
  ];

  return (
    <View style={styles.container}>
      {amenities.length > 0 && (
        <View style={styles.amenitiesSection}>
          <View style={styles.titleRow}>
            <Text style={styles.heading}>Amenities</Text>
            <Text style={styles.countText}>{amenities.length} available</Text>
          </View>
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.amenitiesList}>
            {amenities.map(({ name, value }, index) => {
              const showValue =
                value !== undefined &&
                value !== null &&
                value !== '' &&
                !['yes', 'true', '1'].includes(String(value).toLowerCase());

              return (
                <View style={styles.amenityCard} key={`${name}-${index}`}>
                  <View style={styles.amenityIconContainer}>
                    <Text style={styles.amenityIcon}>{getAmenityIcon(name)}</Text>
                  </View>
                  <Text style={styles.amenityName} numberOfLines={2}>
                    {formatLabel(name)}
                  </Text>
                  {showValue && (
                    <Text style={styles.amenityValue} numberOfLines={1}>
                      {formatValue(value)}
                    </Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      <Text style={styles.heading}>Property Details</Text>
      <Section title="Overview" data={propertyInfo} />
      <Section title="Additional Information" data={additionalInfo} />

      <View style={styles.pricingCard}>
        <Text style={styles.pricingTitle}>Payment Details</Text>
        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Monthly rent</Text>
          <Text style={styles.pricingValue}>
            {AllData?.price ? `₹${AllData.price}` : 'N/A'}
          </Text>
        </View>
        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Maintenance</Text>
          <Text style={styles.pricingValue}>
            {AllData?.mentains_amount ? `₹${AllData.mentains_amount}` : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PropertyAmed;

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#202124',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countText: {
    fontSize: 12,
    color: COLOR.primary,
    fontWeight: '600',
  },
  amenitiesSection: {
    marginBottom: 24,
  },
  amenitiesList: {
    paddingRight: 5,
  },
  amenityCard: {
    width: 108,
    minHeight: 118,
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderRadius: 16,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e8edf7',
  },
  amenityIconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  amenityIcon: {
    fontSize: 24,
  },
  amenityName: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#30343b',
    textAlign: 'center',
  },
  amenityValue: {
    fontSize: 10,
    color: '#747b87',
    marginTop: 3,
    textAlign: 'center',
  },
  section: {
    marginTop: 14,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#747b87',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48.5%',
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  infoIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    marginRight: 8,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoText: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#858b95',
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#25282d',
  },
  pricingCard: {
    backgroundColor: '#f1f6ff',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    marginBottom: 10,
  },
  pricingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#25282d',
    marginBottom: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  pricingLabel: {
    fontSize: 13,
    color: '#626975',
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.primary,
  },
});
