import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
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
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [alternateContactNumber, setAlternateContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [roomCount, setRoomCount] = useState("1");
    const [adults, setAdults] = useState("1");
    const [children, setChildren] = useState("0");
    const [specialRequest, setSpecialRequest] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");

    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());

    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const formatDateTime = (date) => {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    };

    const validate = () => {
        let newErrors = {};

        if (!name) newErrors.name = "Name required";
        if (!contactNumber) newErrors.contactNumber = "Contact number required";
        if (!address) newErrors.address = "Address required";

        if (Number(roomCount) < 1 || Number(roomCount) > 20)
            newErrors.roomCount = "Rooms must be 1–20";

        if (Number(adults) < 1 || Number(adults) > 5)
            newErrors.adults = "Adults must be 1–5";

        if (Number(children) < 0 || Number(children) > 5)
            newErrors.children = "Children must be 0–5";

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
            name: name,
            contact_number: contactNumber,
            alternate_contact_number: alternateContactNumber || null,
            address: address,
            check_in_datetime: formatDateTime(checkInDate),
            check_out_datetime: formatDateTime(checkOutDate),
            room_count: Number(roomCount),
            payment_method: paymentMethod,
            special_requests: specialRequest,
            guests_details: Array.from(
                { length: Number(roomCount) },
                () => ({
                    adults: Number(adults),
                    children: Number(children),
                })
            ),
        };

        try {
            setLoading(true);

            const response = await postRequest(
                "public/api/hotel-booking/create-order",
                payload
            );

            if (response?.success) {
                showToast("Booking Successful");
                navigation.goBack();
            } else {
                Alert.alert("Error", response?.data?.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Header
                title={data?.hotel_name}
                showBack
                onBackPress={() => navigation.goBack()}
            />

            {/* Name */}
            <Input placeholderTextColor="#a08e8eff" placeholder="Enter your name" style={{ color: COLOR.black }} label="Name" value={name} setValue={setName} error={errors.name} />

            {/* Contact */}
            <Input
                placeholder="10-digit number"
                placeholderTextColor="#807676ff"
                style={{ color: COLOR.black }}
                label="Contact Number"
                value={contactNumber}
                setValue={setContactNumber}
                keyboard="numeric"
                error={errors.contactNumber}
            />

            {/* Alternate */}
            <Input
                placeholder="10-digit number (optional)"
                placeholderTextColor="#888"
                style={{ color: COLOR.black }}
                label="Alternate Contact"
                value={alternateContactNumber}
                setValue={setAlternateContactNumber}
                keyboard="numeric"
            />

            {/* Address */}
            <Input placeholder="Enter your address"
                placeholderTextColor="#888"
                style={{ color: COLOR.black }}
                label="Address"
                value={address}
                setValue={setAddress}
                error={errors.address}
            />

            {/* Room Count */}
            <Input
                placeholderTextColor="#888"
                placeholder="Number of rooms"
                style={{ color: COLOR.black }}
                label="Rooms (1–20)"
                value={roomCount}
                setValue={setRoomCount}
                keyboard="numeric"
                error={errors.roomCount}
            />

            {/* Adults */}
            <Input
                placeholderTextColor="#888"
                placeholder="Number of adults per room"
                style={{ color: COLOR.black }}
                label="Adults (1–5)"
                value={adults}
                setValue={setAdults}
                keyboard="numeric"
                error={errors.adults}
            />

            {/* Children */}
            <Input
                placeholderTextColor="#888"
                placeholder="Number of children per room"
                style={{ color: COLOR.black }}
                label="Children (0–5)"
                value={children}
                setValue={setChildren}
                keyboard="numeric"
                error={errors.children}
            />

            {/* Special Request */}
            <Input
                placeholderTextColor="#888"
                placeholder="Any special requests? (optional)"
                style={{ color: COLOR.black }}
                label="Special Request"
                value={specialRequest}
                setValue={setSpecialRequest}
            />

            {/* Check In */}
            <DatePicker
                style={{ color: COLOR.black }}
                label="Check In"
                date={checkInDate}
                onPress={() => setShowCheckIn(true)}
            />

            {showCheckIn && (
                <DateTimePicker
                    value={checkInDate}
                    mode="date"
                    onChange={(e, d) => {
                        setShowCheckIn(false);
                        if (d) setCheckInDate(d);
                    }}
                />
            )}

            {/* Check Out */}
            <DatePicker
                label="Check Out"
                date={checkOutDate}
                onPress={() => setShowCheckOut(true)}
            />

            {showCheckOut && (
                <DateTimePicker
                    value={checkOutDate}
                    mode="date"
                    onChange={(e, d) => {
                        setShowCheckOut(false);
                        if (d) setCheckOutDate(d);
                    }}
                />
            )}

            {errors.date && <Error text={errors.date} />}

            {/* Payment */}
            <View style={styles.field}>
                <Text style={styles.label}>Payment Method</Text>

                <View style={{ flexDirection: "row" }}>
                    <Option
                        label="Online (PhonePe)"
                        active={paymentMethod === "online"}
                        onPress={() => setPaymentMethod("online")}
                    />
                    <Option
                        label="Pay at Hotel"
                        active={paymentMethod === "pay_at_hotel"}
                        onPress={() => setPaymentMethod("pay_at_hotel")}
                    />
                </View>
            </View>

            {/* Terms */}
            <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
            >
                <View style={styles.checkbox}>
                    {agreeTerms && <View style={styles.checkboxInner} />}
                </View>
                <Text>I agree to Terms & Policies</Text>
            </TouchableOpacity>

            {errors.terms && <Error text={errors.terms} />}

            {/* Button */}
            {loading ? (
                <ActivityIndicator size="large" color={COLOR.primary} />
            ) : (
                <CustomButton title="Book Now" onPress={handleBooking} />
            )}
        </ScrollView>
    );
};

/* 🔹 Reusable Components */

const Input = ({ label, value, setValue, keyboard, error, placeholderTextColor, placeholder }) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholderTextColor={placeholderTextColor}
            placeholder={placeholder}
            keyboardType={keyboard || "default"}
        />
        {error && <Error text={error} />}
    </View>
);

const DatePicker = ({ label, date, onPress }) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={onPress}>
            <Text>{moment(date).format("DD-MM-YYYY HH:mm")}</Text>
        </TouchableOpacity>
    </View>
);

const Option = ({ label, active, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.option,
            { backgroundColor: active ? COLOR.primary : "#eee" },
        ]}
    >
        <Text style={{ color: active ? "#fff" : "#000" }}>{label}</Text>
    </TouchableOpacity>
);

const Error = ({ text }) => (
    <Text style={{ color: "red", fontSize: 12 }}>{text}</Text>
);

export default BookHotel;

/* 🔹 Styles */

const styles = StyleSheet.create({
    container: { backgroundColor: COLOR.white },
    field: { margin: 20 },
    label: { marginBottom: 5, fontWeight: "500" },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 6,
    },
    dateBtn: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 6,
    },
    option: {
        padding: 10,
        marginRight: 10,
        borderRadius: 6,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        margin: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        marginRight: 10,
    },
    checkboxInner: {
        flex: 1,
        backgroundColor: COLOR.primary,
    },
});