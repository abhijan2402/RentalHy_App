import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLOR } from "../../../Constants/Colors";
import CustomButton from "../../../Components/CustomButton";
import Header from "../../../Components/FeedHeader";
import { useApi } from "../../../Backend/Api";
import moment from "moment";
import { useToast } from "../../../Constants/ToastContext";

const BookHotel = ({ navigation, route }) => {

    const data = route?.params?.data;
    const { postRequest } = useApi();
    const { showToast } = useToast
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [contactNumber, setContactNumber] = useState("");
    const [alternateContactNumber, setAlternateContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [roomCount, setRoomCount] = useState("1");
    const [adults, setAdults] = useState("1");
    const [children, setChildren] = useState("0");
    const [specialRequest, setSpecialRequest] = useState("");

    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());

    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const formatDateTime = (date) => {
        const pad = (n) => (n < 10 ? "0" + n : n);

        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            " " +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes()) +
            ":00"
        );
    };

    const validate = () => {

        let newErrors = {};

        if (!contactNumber) newErrors.contactNumber = "Contact number required";
        if (!address) newErrors.address = "Address required";
        if (!roomCount) newErrors.roomCount = "Room count required";

        if (checkOutDate <= checkInDate)
            newErrors.date = "Checkout must be after checkin";
        if (!agreeTerms)
            newErrors.terms = "Please accept terms & policies";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleBooking = async () => {

        if (!validate()) return;

        const payload = {
            hotel_id: data?.id,
            contact_number: contactNumber,
            alternate_contact_number: alternateContactNumber,
            address: address,
            check_in_datetime: formatDateTime(checkInDate),
            check_out_datetime: formatDateTime(checkOutDate),
            room_count: roomCount,
            payment_method: "online",
            special_requests: specialRequest,
            guests_details: [
                {
                    adults: adults,
                    children: children
                }
            ]
        };

        try {

            setLoading(true);

            const response = await postRequest(
                "public/api/hotel-booking/create-order",
                payload
            );

            console.log(response);
            if (response?.success) {
                alert(response?.data?.message || "hi")
                navigation.goBack()
            } else {
                alert(response?.data?.message)

            }

        } catch (error) {
            alert(error, "error")
            console.log(error);
            Alert.alert("Error", "Booking failed");

        } finally {

            setLoading(false);

        }

    };

    return (

        <ScrollView style={styles.container}>
            <Header title={data?.hotel_name} showBack
                onBackPress={() => navigation.goBack()} />

            {/* Contact Number */}

            <View style={styles.field}>
                <Text style={styles.label}>Contact Number</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter contact number"
                    placeholderTextColor={COLOR.grey}
                    keyboardType="numeric"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                />

                {errors.contactNumber && (
                    <Text style={styles.error}>{errors.contactNumber}</Text>
                )}
            </View>

            {/* Alternate Contact */}

            <View style={styles.field}>
                <Text style={styles.label}>Alternate Contact</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter alternate contact"
                    placeholderTextColor={COLOR.grey}
                    keyboardType="numeric"
                    value={alternateContactNumber}
                    onChangeText={setAlternateContactNumber}
                />
            </View>

            {/* Address */}

            <View style={styles.field}>
                <Text style={styles.label}>Address</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter address"
                    placeholderTextColor={COLOR.grey}
                    value={address}
                    onChangeText={setAddress}
                />

                {errors.address && (
                    <Text style={styles.error}>{errors.address}</Text>
                )}
            </View>

            {/* Room Count */}

            <View style={styles.field}>
                <Text style={styles.label}>Room Count</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter room count"
                    placeholderTextColor={COLOR.grey}
                    keyboardType="numeric"
                    value={roomCount}
                    onChangeText={setRoomCount}
                />

                {errors.roomCount && (
                    <Text style={styles.error}>{errors.roomCount}</Text>
                )}
            </View>

            {/* Adults */}

            <View style={styles.field}>
                <Text style={styles.label}>Adults</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter adults"
                    placeholderTextColor={COLOR.grey}
                    keyboardType="numeric"
                    value={adults}
                    onChangeText={setAdults}
                />
            </View>

            {/* Children */}

            <View style={styles.field}>
                <Text style={styles.label}>Children</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter children"
                    placeholderTextColor={COLOR.grey}
                    keyboardType="numeric"
                    value={children}
                    onChangeText={setChildren}
                />
            </View>

            {/* Special Request */}

            <View style={styles.field}>
                <Text style={styles.label}>Special Request</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Any special request"
                    placeholderTextColor={COLOR.grey}
                    value={specialRequest}
                    onChangeText={setSpecialRequest}
                />
            </View>

            {/* Check In */}

            <View style={styles.field}>
                <Text style={styles.label}>Check In</Text>

                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowCheckIn(true)}
                >
                    <Text style={styles.dateText}>
                        {moment(checkInDate).format("DD-MM-YYYY")}
                    </Text>
                </TouchableOpacity>
            </View>

            {showCheckIn && (
                <DateTimePicker value={new Date()} mode="date" is24Hour display="default" onChange={(event, selectedDate) => {
                    setShowCheckIn(false);
                    if (selectedDate) setCheckInDate(selectedDate);
                }} />

            )}

            {/* Check Out */}

            <View style={styles.field}>
                <Text style={styles.label}>Check Out</Text>

                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowCheckOut(true)}
                >
                    <Text style={styles.dateText}>
                        {moment(checkOutDate).format("DD-MM-YYYY")}
                    </Text>
                </TouchableOpacity>
            </View>

            {showCheckOut && (
                <DateTimePicker
                    value={checkOutDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowCheckOut(false);
                        if (selectedDate) setCheckOutDate(selectedDate);
                    }}
                />
            )}

            {errors.date && (
                <Text style={[styles.error, { marginLeft: 20 }]}>
                    {errors.date}
                </Text>
            )}
            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginVertical: 5, marginTop: 20, marginBottom: 10 }}>

                <TouchableOpacity
                    onPress={() => setAgreeTerms(!agreeTerms)}
                    style={{
                        width: 20,
                        height: 20,
                        borderWidth: 1,
                        borderColor: "#999",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 10
                    }}
                >
                    {agreeTerms && (
                        <View style={{
                            width: 12,
                            height: 12,
                            backgroundColor: COLOR.primary
                        }} />
                    )}
                </TouchableOpacity>

                <Text style={{ flex: 1, color: COLOR.black }}>
                    I agree to Hotel Terms & Policies
                </Text>

            </View>

            {errors.terms && (
                <Text style={[styles.error, { marginLeft: 20, marginBottom: 20 }]}>
                    {errors.terms}
                </Text>
            )}
            {/* Button */}

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={COLOR.primary}
                    style={{ marginTop: 20 }}
                />
            ) : (
                <CustomButton
                    title="Book Now"
                    onPress={handleBooking}
                />
            )}

        </ScrollView>
    );
};

export default BookHotel;

const styles = StyleSheet.create({

    container: {
        backgroundColor: COLOR.white
    },

    field: {
        marginHorizontal: 20,
        marginBottom: 16
    },

    label: {
        fontSize: 14,
        marginBottom: 6,
        color: COLOR.black,
        fontWeight: "500"
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 6,
        color: COLOR.black
    },

    dateBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 14,
        borderRadius: 6
    },

    dateText: {
        color: COLOR.black
    },

    error: {
        color: "red",
        marginTop: 4,
        fontSize: 12
    }

});