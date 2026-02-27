import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    TouchableOpacity,
    Image,
} from 'react-native';

import Header from '../../../Components/FeedHeader';
import GooglePlacePicker from '../../../Components/GooglePicker';
import CustomButton from '../../../Components/CustomButton';
import { COLOR } from '../../../Constants/Colors';
import { useApi } from '../../../Backend/Api';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';

const PostHotel = ({ navigation }) => {
    const { postRequest } = useApi();

    // BASIC STATES
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [addressDescription, setAddressDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [landmark, setLandmark] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hotelType, setHotelType] = useState('4');

    // EXTRA STATES
    const [roomType, setRoomType] = useState('');
    const [bedType, setBedType] = useState('');
    const [guestsPerRoom, setGuestsPerRoom] = useState('');
    const [roomSize, setRoomSize] = useState('');

    // TIME STATES
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

    // YES / NO STATES
    const [isAc, setIsAc] = useState('yes');
    const [isTvAvailable, setIsTvAvailable] = useState('yes');
    const [isLandlineAvailable, setIsLandlineAvailable] = useState('yes');
    const [isBathroomAttached, setIsBathroomAttached] = useState('yes');
    const [isDailyCleaning, setIsDailyCleaning] = useState('yes');
    const [isLiftAvailable, setIsLiftAvailable] = useState('yes');
    const [isWater24x7, setIsWater24x7] = useState('yes');
    const [isGeyserAvailable, setIsGeyserAvailable] = useState('yes');

    const boolToInt = val => (val === 'yes' ? 1 : 0);

    // TIME HANDLERS
    const onChangeCheckIn = (_, date) => {
        setShowCheckInPicker(false);
        if (date) setCheckInTime(moment(date).format('HH:mm'));
    };

    const onChangeCheckOut = (_, date) => {
        setShowCheckOutPicker(false);
        if (date) setCheckOutTime(moment(date).format('HH:mm'));
    };

    // IMAGE PICKER
    const pickImages = async () => {
        try {
            const picked = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                compressImageQuality: 0.8,
            });

            const formatted = picked.map(img => ({
                uri: img.path,
                type: img.mime,
                fileName: img.filename || `image_${Date.now()}.jpg`,
            }));

            setImages(prev => [...prev, ...formatted]);
        } catch (e) {
            console.log(e);
        }
    };
    // UI HELPERS
    const renderSelect = (label, options, value, setValue) => (
        <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {options.map(opt => (
                    <TouchableOpacity
                        key={opt}
                        style={[styles.optionBtn, value === opt && styles.selectedBtn]}
                        onPress={() => setValue(opt)}>
                        <Text style={[styles.optionText, value === opt && styles.selectedText]}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );


    const removeImage = index => {
        const arr = [...images];
        arr.splice(index, 1);
        setImages(arr);
    };

    // TOGGLE UI
    const renderToggle = (label, value, setValue) => (
        <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.toggleRow}>
                {['yes', 'no'].map(opt => (
                    <TouchableOpacity
                        key={opt}
                        style={[
                            styles.toggleBtn,
                            value === opt && styles.selectedBtn,
                        ]}
                        onPress={() => setValue(opt)}>
                        <Text
                            style={[
                                styles.toggleText,
                                value === opt && styles.selectedText,
                            ]}>
                            {opt.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    // POST API
    const handlePostHotel = async () => {
        if (!title || !description || !phoneNumber || !price || !location) {
            Alert.alert('Validation', 'Please fill required fields');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append('hotel_name', title);
            formData.append('description', description);
            formData.append('phone_number', phoneNumber);
            formData.append('price', price);
            formData.append('location', location);
            formData.append('address_description', addressDescription);
            formData.append('landmark', landmark);

            formData.append('status', 1);
            formData.append('hotel_type', 4);
            formData.append('room_type', roomType);
            formData.append('bed_type', bedType);
            formData.append('guests_per_room', guestsPerRoom);
            formData.append('check_in_time', checkInTime);
            formData.append('check_out_time', checkOutTime);
            formData.append('room_size', roomSize);

            // TOGGLE VALUES
            formData.append('is_ac', boolToInt(isAc));
            formData.append('is_tv_available', boolToInt(isTvAvailable));
            formData.append('is_landline_available', boolToInt(isLandlineAvailable));
            formData.append('is_bathroom_attached', boolToInt(isBathroomAttached));
            formData.append('is_daily_cleaning', boolToInt(isDailyCleaning));
            formData.append('is_lift_available', boolToInt(isLiftAvailable));
            formData.append('is_water_24x7', boolToInt(isWater24x7));
            formData.append('is_geyser_available', boolToInt(isGeyserAvailable));

            formData.append('receptionist_contact_type', 'remote');
            formData.append('food_available', 'own_restaurant');
            formData.append('booking_type', 'traveller');

            // ARRAY SAMPLE
            ['Housekeeping', 'Mineral Water'].forEach((v, i) =>
                formData.append(`basic_facilities[${i}]`, v),
            );

            // IMAGES
            images.forEach((img, i) => {
                formData.append('images[]', {
                    uri: img.uri,
                    type: img.type || 'image/jpeg',
                    name: img.fileName || `image_${i}.jpg`,
                });
            });
            console.log(formData, "FORMMMM)___DATE");


            const res = await postRequest('public/api/hotels', formData, true);
            if (res?.success) {
                Alert.alert('Success', 'Hotel posted successfully');
                navigation.goBack();
            } else {
                console.log(res, "ERRORORORO");

            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLOR.white }}>
            <Header title="Post Hotels" showBack onBackPress={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Hotel Name *</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                <Text style={styles.label}>Description *</Text>
                <TextInput textAlignVertical='top' style={[styles.input, styles.textArea]} multiline value={description} onChangeText={setDescription} />

                <Text style={styles.label}>Phone *</Text>
                <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />

                <Text style={styles.label}>Price *</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} />
                {renderSelect('Hotel Type (Rating basis)', ['1', '2', '3', '4', '5'], hotelType, setHotelType)}
                {renderSelect('Room Type', ['Single', 'Double', 'Triple', '4+'], roomType, setRoomType)}
                {renderSelect('Bed Type', ['King Size Bed', 'Queen Size Bed', 'Double Bed / Full-Size Bed', 'Single Bed', 'Twin Beds'], bedType, setBedType)}
                {renderSelect('Guests Per Room', ['1', '2', '3', '4', '5'], guestsPerRoom, setGuestsPerRoom)}
                {/* <Text style={styles.label}>Room Type</Text>
                <TextInput style={styles.input} value={roomType} onChangeText={setRoomType} />

                <Text style={styles.label}>Bed Type</Text>
                <TextInput style={styles.input} value={bedType} onChangeText={setBedType} />

                <Text style={styles.label}>Guests Per Room</Text>
                <TextInput style={styles.input} value={guestsPerRoom} onChangeText={setGuestsPerRoom} /> */}

                {/* TIME PICKERS */}
                <Text style={styles.label}>Check In Time</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowCheckInPicker(true)}>
                    <Text>{checkInTime || 'Select Check In Time'}</Text>
                </TouchableOpacity>

                {showCheckInPicker && (
                    <DateTimePicker value={new Date()} mode="time" is24Hour display="default" onChange={onChangeCheckIn} />
                )}

                <Text style={styles.label}>Check Out Time</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowCheckOutPicker(true)}>
                    <Text>{checkOutTime || 'Select Check Out Time'}</Text>
                </TouchableOpacity>

                {showCheckOutPicker && (
                    <DateTimePicker value={new Date()} mode="time" is24Hour display="default" onChange={onChangeCheckOut} />
                )}

                <Text style={styles.label}>Room Size</Text>
                <TextInput style={styles.input} value={roomSize} onChangeText={setRoomSize} />

                {/* TOGGLES */}
                {renderToggle('AC Available', isAc, setIsAc)}
                {renderToggle('TV Available', isTvAvailable, setIsTvAvailable)}
                {renderToggle('Landline Available', isLandlineAvailable, setIsLandlineAvailable)}
                {renderToggle('Bathroom Attached', isBathroomAttached, setIsBathroomAttached)}
                {renderToggle('Daily Cleaning', isDailyCleaning, setIsDailyCleaning)}
                {renderToggle('Lift Available', isLiftAvailable, setIsLiftAvailable)}
                {renderToggle('Water 24x7', isWater24x7, setIsWater24x7)}
                {renderToggle('Geyser Available', isGeyserAvailable, setIsGeyserAvailable)}

                <Text style={styles.label}>Location *</Text>
                <GooglePlacePicker
                    placeholder="Search location..."
                    onPlaceSelected={p => setLocation(p?.address || '')}
                />

                <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
                    <Text style={styles.uploadText}>+ Add Images</Text>
                </TouchableOpacity>

                <ScrollView horizontal>
                    {images.map((img, i) => (
                        <View key={i} style={styles.imageWrapper}>
                            <Image source={{ uri: img.uri }} style={styles.image} />
                            <TouchableOpacity style={styles.crossContainer} onPress={() => removeImage(i)}>
                                <Text>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                <CustomButton
                    loading={loading}
                    title="Post Hotel"
                    style={{ marginTop: 20, marginBottom: 40 }}
                    onPress={handlePostHotel}
                />
            </ScrollView>
        </View>
    );
};

export default PostHotel;

const styles = StyleSheet.create({
    content: { padding: 20 },
    label: { marginTop: 12, fontWeight: '600', color: 'black' },
    input: {
        borderWidth: 1,
        borderColor: COLOR.grey,
        borderRadius: 8,
        padding: 10,
    },
    textArea: { height: 100, textAlignVertical: 'top' },

    toggleRow: { flexDirection: 'row', marginTop: 8 },
    toggleBtn: {
        borderWidth: 1,
        borderColor: COLOR.grey,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 10,
    },
    selectedBtn: { backgroundColor: COLOR.primary },
    toggleText: { fontWeight: '600' },
    selectedText: { color: 'white' },

    uploadBtn: {
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: 12,
        marginTop: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    uploadText: { fontWeight: '600' },

    imageWrapper: { marginRight: 10, marginTop: 10 },
    image: { width: 90, height: 90, borderRadius: 8 },
    crossContainer: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 5,
    },
    label: { marginTop: 12, fontWeight: '600', color: 'black' },
    input: { borderWidth: 1, borderColor: COLOR.grey, borderRadius: 8, padding: 10 },
    textArea: { height: 100 },
    optionBtn: { borderWidth: 1, borderColor: COLOR.grey, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginRight: 10, marginTop: 8 },
    selectedBtn: { backgroundColor: COLOR.primary },
});