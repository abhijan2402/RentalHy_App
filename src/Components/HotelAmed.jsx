import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AmedSection from './AmedSection';

const yesNo = val => (val ? 'Yes' : 'No');

const HotelAmed = ({ AllData }) => {
    // ======================
    // BASIC INFO
    // ======================
    const generalInfo = [
        { icon: '🏨', label: 'Hotel Name', value: AllData?.hotel_name },
        { icon: '⭐', label: 'Hotel Type', value: AllData?.hotel_type_text },
        { icon: '🚪', label: 'Room Type', value: AllData?.room_type },
        { icon: '🛏️', label: 'Bed Type', value: AllData?.bed_type?.join(', ') },
        { icon: '👥', label: 'Guests Per Room', value: AllData?.guests_per_room },
        { icon: '📐', label: 'Room Size', value: AllData?.room_size },
        { icon: '🗓️', label: 'Booking Type', value: AllData?.booking_type_text },
    ];

    // ======================
    // TIMING
    // ======================
    const timingInfo = [
        { icon: '↘️', label: 'Check In Time', value: AllData?.check_in_time },
        { icon: '↗️', label: 'Check Out Time', value: AllData?.check_out_time },
    ];

    // ======================
    // PRICE INFO
    // ======================
    // const priceInfo = [
    //     { label: 'Price', value: AllData?.formatted_price || AllData?.price },
    //     { label: 'Min Price', value: AllData?.formatted_min_price || 'N/A' },
    //     { label: 'Max Price', value: AllData?.formatted_max_price || 'N/A' },
    // ];

    const priceInfo = [
        { icon: '💳', label: 'Price', value: AllData?.formatted_price || AllData?.price },
        { icon: '📉', label: 'Minimum Price', value: AllData?.formatted_min_price },
        { icon: '📈', label: 'Maximum Price', value: AllData?.formatted_max_price },
    ];
    // ======================
    // LOCATION
    // ======================
    const locationInfo = [
        { icon: '📍', label: 'Location', value: AllData?.location },
    ];

    // ======================
    // ROOM FEATURES
    // ======================
    const roomFeatures = [
        { icon: '❄️', label: 'Air Conditioning', value: yesNo(AllData?.is_ac) },
        { icon: '🚿', label: 'Attached Bathroom', value: yesNo(AllData?.is_bathroom_attached) },
        { icon: '💧', label: 'Water 24x7', value: yesNo(AllData?.is_water_24x7) },
        { icon: '♨️', label: 'Geyser Available', value: yesNo(AllData?.is_geyser_available) },
        { icon: '🍽️', label: 'Food Available', value: AllData?.food_available_text },
    ];


    // ======================
    // HOTEL SERVICES
    // ======================


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
        { label: 'Basic Facilities', value: AllData?.facilities?.basic_facilities?.join(', ') },
        { label: 'General Services', value: AllData?.facilities?.general_services?.join(', ') },
        { label: 'Room Amenities', value: AllData?.facilities?.room_amenities?.join(', ') },
        { label: 'Food & Drinks', value: AllData?.facilities?.food_drinks?.join(', ') },
        { label: 'Safety & Security', value: AllData?.facilities?.safety_security?.join(', ') },
        { label: 'Media Technology', value: AllData?.facilities?.media_technology?.join(', ') },
        { label: 'Beauty & Spa', value: AllData?.facilities?.beauty_spa?.join(', ') },
        { label: 'Common Area', value: AllData?.facilities?.common_area?.join(', ') },
        { label: 'Shopping', value: AllData?.facilities?.shopping?.join(', ') },
        { label: 'Business Center', value: AllData?.facilities?.business_center_conferences?.join(', ') },
        { label: 'Other Facilities', value: AllData?.facilities?.other_facilities?.join(', ') },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Hotel Details</Text>

            <AmedSection title="General Information" icon="🏨" data={generalInfo} />
            <AmedSection title="Price Information" icon="💳" data={priceInfo} />
            <AmedSection title="Check-in & Check-out" icon="🕐" data={timingInfo} />
            <AmedSection title="Location Details" icon="📍" data={locationInfo} />
            <AmedSection title="Room Features" icon="🛏️" data={roomFeatures} />
            <AmedSection title="Structure Features" icon="🏢" data={structureInfo} />
            <AmedSection title="Policies & IDs" icon="🛡️" data={policyInfo} />
            <AmedSection title="Facilities" icon="✨" data={facilities} />
        </View>
    );
};

export default HotelAmed;

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
