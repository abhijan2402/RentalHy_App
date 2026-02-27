import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const yesNo = val => (val ? 'Yes' : 'No');

const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value ?? 'N/A'}</Text>
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

const HotelAmed = ({ AllData }) => {
    // ======================
    // BASIC INFO
    // ======================
    const generalInfo = [
        { label: 'Hotel Name', value: AllData?.hotel_name },
        { label: 'Hotel Type', value: AllData?.hotel_type_text },
        { label: 'Room Type', value: AllData?.room_type },
        { label: 'Bed Type', value: AllData?.bed_type },
        { label: 'Guests Per Room', value: AllData?.guests_per_room },
        { label: 'Room Size', value: AllData?.room_size },
        { label: 'Booking Type', value: AllData?.booking_type_text },
    ];

    // ======================
    // TIMING
    // ======================
    const timingInfo = [
        { label: 'Check In Time', value: AllData?.check_in_time },
        { label: 'Check Out Time', value: AllData?.check_out_time },
        { label: 'Any Time Check-In', value: yesNo(AllData?.is_any_time_checkin) },
        { label: 'Hot Water Start', value: AllData?.hot_water_start_time || 'N/A' },
        { label: 'Hot Water End', value: AllData?.hot_water_end_time || 'N/A' },
    ];

    // ======================
    // PRICE INFO
    // ======================
    const priceInfo = [
        { label: 'Price', value: AllData?.formatted_price || AllData?.price },
        { label: 'Min Price', value: AllData?.formatted_min_price || 'N/A' },
        { label: 'Max Price', value: AllData?.formatted_max_price || 'N/A' },
    ];

    // ======================
    // LOCATION
    // ======================
    const locationInfo = [
        { label: 'Location', value: AllData?.location },
        { label: 'Address Description', value: AllData?.address_description || 'N/A' },
        { label: 'Landmark', value: AllData?.landmark || 'N/A' },
    ];

    // ======================
    // ROOM FEATURES
    // ======================
    const roomFeatures = [
        { label: 'AC', value: yesNo(AllData?.is_ac) },
        { label: 'TV Available', value: yesNo(AllData?.is_tv_available) },
        { label: 'Landline Available', value: yesNo(AllData?.is_landline_available) },
        { label: 'Bathroom Attached', value: yesNo(AllData?.is_bathroom_attached) },
        { label: 'Daily Cleaning', value: yesNo(AllData?.is_daily_cleaning) },
        { label: 'Mattress Changed Daily', value: yesNo(AllData?.is_mattress_changed_daily) },
        { label: 'Water 24x7', value: yesNo(AllData?.is_water_24x7) },
        { label: 'Geyser Available', value: yesNo(AllData?.is_geyser_available) },
        { label: 'Hot Water 24x7', value: yesNo(AllData?.is_hotwater_24x7) },
    ];

    // ======================
    // HOTEL SERVICES
    // ======================
    const serviceInfo = [
        { label: 'Cab Booking', value: yesNo(AllData?.is_cab_booking_available) },
        { label: 'Friendly Staff', value: yesNo(AllData?.is_friendly_staff) },
        { label: 'Extra Charges', value: yesNo(AllData?.is_extra_charges) },
        { label: 'Lift Available', value: yesNo(AllData?.is_lift_available) },
        { label: 'Towel & Soaps', value: yesNo(AllData?.is_towel_soaps_available) },
        { label: 'Reception Contact', value: AllData?.receptionist_contact_type_text },
        { label: 'Food Available', value: AllData?.food_available_text },
    ];

    // ======================
    // STRUCTURE FEATURES
    // ======================
    const structureInfo = [
        { label: 'Window Mosquito Net', value: yesNo(AllData?.has_window_mosquito_net) },
        { label: 'Balcony', value: yesNo(AllData?.has_balcony) },
        { label: 'Beautiful Balcony View', value: yesNo(AllData?.is_balcony_view_beautiful) },
        { label: 'Ventilation', value: yesNo(AllData?.has_ventilation) },
        { label: 'Emergency Exit', value: yesNo(AllData?.has_emergency_exit) },
    ];

    // ======================
    // ID / POLICY
    // ======================
    const policyInfo = [
        { label: 'Identity Proof Required', value: yesNo(AllData?.identity_proof_required) },
        { label: 'Passport Required', value: yesNo(AllData?.foreigners_passport_required) },
        { label: 'All Customer ID Required', value: yesNo(AllData?.all_customers_id_required) },
        { label: 'Status', value: AllData?.status_text },
    ];

    // ======================
    // FACILITIES
    // ======================
    const facilities = [
        {
            label: 'Basic Facilities',
            value: AllData?.facilities?.basic_facilities?.join(', ') || 'N/A',
        },
        {
            label: 'General Services',
            value: AllData?.facilities?.general_services?.join(', ') || 'N/A',
        },
        {
            label: 'Room Amenities',
            value: AllData?.facilities?.room_amenities?.join(', ') || 'N/A',
        },
        {
            label: 'Food & Drinks',
            value: AllData?.facilities?.food_drinks?.join(', ') || 'N/A',
        },
        {
            label: 'Safety & Security',
            value: AllData?.facilities?.safety_security?.join(', ') || 'N/A',
        },
        {
            label: 'Common Area',
            value: AllData?.facilities?.common_area?.join(', ') || 'N/A',
        },
        {
            label: 'Other Facilities',
            value: AllData?.facilities?.other_facilities?.join(', ') || 'N/A',
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Hotel Details</Text>

            <Section title="General Information" data={generalInfo} />
            <Section title="Price Information" data={priceInfo} />
            <Section title="Timing Information" data={timingInfo} />
            <Section title="Location Details" data={locationInfo} />
            <Section title="Room Features" data={roomFeatures} />
            <Section title="Hotel Services" data={serviceInfo} />
            <Section title="Structure Features" data={structureInfo} />
            <Section title="Policies & IDs" data={policyInfo} />
            <Section title="Facilities" data={facilities} />
        </View>
    );
};

export default HotelAmed;

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