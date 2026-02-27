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
    {data?.map((item, index) => (
      <InfoRow key={index} label={item.label} value={item.value} />
    ))}
  </View>
);

const PropertyAmed = ({ AllData }) => {
  const generalInfo = [
    { label: 'Property Type', value: AllData?.property_type || 'N/A' },
    { label: 'BHK', value: AllData?.bhk || 'N/A' },
    { label: 'Area (sqft)', value: AllData?.area_sqft || 'N/A' },
    { label: 'Furnishing Status', value: AllData?.furnishing_status || 'N/A' },
    { label: 'Availability', value: AllData?.availability || 'N/A' },
    {
      label: 'Preferred Tenant Type',
      value: AllData?.preferred_tenant_type || 'N/A',
    },
    { label: 'Advance', value: AllData?.advance || 'N/A' },
  ];

  const pricingInfo = [
    { label: 'Price', value: AllData?.price ? `₹${AllData.price}` : 'N/A' },
    { label: 'Maintenance Charges', value: AllData?.mentains_chargers || 'N/A' },
    { label: 'Maintenance Amount', value: AllData?.mentains_amount || 'N/A' },
    { label: 'Security Available', value: AllData?.security_avl ? 'Yes' : 'No' },
  ];

  const additionalInfo = [
    { label: 'Bathrooms', value: AllData?.bathrooms || 'N/A' },
    { label: 'Parking Available', value: AllData?.parking_available || 'N/A' },
    { label: 'Facing Direction', value: AllData?.facing_direction || 'N/A' },
    {
      label: 'Floor Option', value: (() => {
        try {
          const floors = JSON?.parse(AllData?.floor || '[]');
          return Array.isArray(floors) ? floors?.join(', ') : 'N/A';
        } catch {
          return 'N/A';
        }
      })(),
    },

    // {
    //   label: 'Floor',
    //   value: Array.isArray(AllData?.floor)
    //     ? AllData.floor.join(', ')
    //     : AllData?.floor || 'N/A',
    // },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Property Details</Text>

      <Section title="General Information" data={generalInfo} />
      <Section title="Pricing Information" data={pricingInfo} />
      <Section title="Additional Information" data={additionalInfo} />
    </View>
  );
};

export default PropertyAmed;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingHorizontal: 5,
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
