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
    const [roomType, setRoomType] = useState([]);
    const [bedType, setBedType] = useState([]);
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
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [hotelRules, setHotelRules] = useState([]);
    const [ruleInput, setRuleInput] = useState('');

    const [basicFacilities, setBasicFacilities] = useState([]);
    const [generalServices, setGeneralServices] = useState([]);
    const [healthWellness, setHealthWellness] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [roomAmenities, setRoomAmenities] = useState([]);
    const [foodDrinks, setFoodDrinks] = useState([]);
    const [safetySecurity, setSafetySecurity] = useState([]);
    const [mediaTechnology, setMediaTechnology] = useState([]);
    const [beautySpa, setBeautySpa] = useState([]);
    const [commonArea, setCommonArea] = useState([]);
    const [shopping, setShopping] = useState([]);
    const [businessCenter, setBusinessCenter] = useState([]);
    const [otherFacilities, setOtherFacilities] = useState([]);

    // NEW SINGLE FIELDS
    const [status, setStatus] = useState('1');
    const [receptionistContactType, setReceptionistContactType] = useState('remote');
    const [foodAvailable, setFoodAvailable] = useState('own_restaurant');
    const [bookingType, setBookingType] = useState('traveller');

    const [singleRoomPrice, setSingleRoomPrice] = useState('');
    const [doubleRoomPrice, setDoubleRoomPrice] = useState('');
    const [tripleRoomPrice, setTripleRoomPrice] = useState('');
    const [fourPlusRoomPrice, setFourPlusRoomPrice] = useState('');

    const [hotWaterStartTime, setHotWaterStartTime] = useState('');
    const [hotWaterEndTime, setHotWaterEndTime] = useState('');

    // NEW TOGGLES
    const [isAnyTimeCheckin, setIsAnyTimeCheckin] = useState('no');
    const [identityProofRequired, setIdentityProofRequired] = useState('yes');
    const [foreignersPassportRequired, setForeignersPassportRequired] = useState('no');
    const [allCustomersIdRequired, setAllCustomersIdRequired] = useState('yes');

    const [isMattressChangedDaily, setIsMattressChangedDaily] = useState('yes');
    const [isCabBookingAvailable, setIsCabBookingAvailable] = useState('no');
    const [isFriendlyStaff, setIsFriendlyStaff] = useState('yes');
    const [isExtraCharges, setIsExtraCharges] = useState('yes');
    const [isTowelSoapsAvailable, setIsTowelSoapsAvailable] = useState('yes');
    const [isHotWater24x7, setIsHotWater24x7] = useState('yes');

    const [hasWindowMosquitoNet, setHasWindowMosquitoNet] = useState('yes');
    const [hasBalcony, setHasBalcony] = useState('yes');
    const [isBalconyViewBeautiful, setIsBalconyViewBeautiful] = useState('yes');
    const [hasVentilation, setHasVentilation] = useState('yes');
    const [hasEmergencyExit, setHasEmergencyExit] = useState('yes');
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
    const MAX_IMAGES = 10;

    const pickImages = async () => {
        try {

            // Remaining slots
            const remaining = MAX_IMAGES - images.length;

            if (remaining <= 0) {
                alert("You can upload maximum 10 photos only");
                return;
            }

            const picked = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                compressImageQuality: 0.8,
                maxFiles: remaining, // 🔥 restrict picker selection
            });

            const formatted = picked.map(img => ({
                uri: img.path,
                type: img.mime,
                fileName: img.filename || `image_${Date.now()}.jpg`,
            }));

            // Final safety check (important)
            const totalImages = [...images, ...formatted];

            if (totalImages.length > MAX_IMAGES) {
                alert("Only 10 images are allowed");
                setImages(totalImages.slice(0, MAX_IMAGES));
            } else {
                setImages(totalImages);
            }

        } catch (e) {
            console.log(e);
        }
    };
    // UI HELPERS
    const renderSelect = (label, options, value, setValue, multi = false) => {

        const toggleSelect = (option) => {

            if (multi) {
                // MULTI SELECT
                if (value.includes(option)) {
                    setValue(value.filter(item => item !== option));
                } else {
                    setValue([...value, option]);
                }
            } else {
                // SINGLE SELECT
                setValue(option);
            }
        };

        const isSelected = (option) => {
            return multi ? value.includes(option) : value === option;
        };

        return (
            <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>{label}</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {options.map(opt => (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.optionBtn, isSelected(opt) && styles.selectedBtn]}
                            onPress={() => toggleSelect(opt)}
                        >
                            <Text style={[styles.optionText, isSelected(opt) && styles.selectedText]}>
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };


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
        if (!agreeTerms) {
            Alert.alert('Validation', 'Please agree to the Terms and Conditions and Privacy Policy');
            return
        }
        if (hotelRules.length === 0) {
            Alert.alert('Validation', 'Please add at least one hotel rule');
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
            formData.append('hotel_rules', hotelRules.join(', '));

            formData.append('status', 1);
            formData.append('hotel_type', 4);
            // formData.append('room_type', roomType);
            // formData.append('bed_type', bedType);
            bedType.forEach((item, index) => {
                formData.append(`bed_type[${index}]`, item);
            });
            formData.append(`room_type`, roomType);
            // roomType.forEach((item, index) => {
            //     formData.append(`room_type[${index}]`, item);
            // });
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
            const appendArray = (key, arr) => {
                arr.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            };

            formData.append('status', status);
            formData.append('hotel_type', hotelType);

            formData.append('single_room_price', singleRoomPrice);
            formData.append('double_room_price', doubleRoomPrice);
            formData.append('triple_room_price', tripleRoomPrice);
            formData.append('4_plus_room_price', fourPlusRoomPrice);

            // formData.append('hot_water_start_time', hotWaterStartTime);
            // formData.append('hot_water_end_time', hotWaterEndTime);

            formData.append('is_any_time_checkin', boolToInt(isAnyTimeCheckin));
            formData.append('identity_proof_required', boolToInt(identityProofRequired));
            formData.append('foreigners_passport_required', boolToInt(foreignersPassportRequired));
            formData.append('all_customers_id_required', boolToInt(allCustomersIdRequired));

            formData.append('is_mattress_changed_daily', boolToInt(isMattressChangedDaily));
            formData.append('is_cab_booking_available', boolToInt(isCabBookingAvailable));
            formData.append('is_friendly_staff', boolToInt(isFriendlyStaff));
            formData.append('is_extra_charges', boolToInt(isExtraCharges));
            formData.append('is_towel_soaps_available', boolToInt(isTowelSoapsAvailable));
            formData.append('is_hotwater_24x7', boolToInt(isHotWater24x7));

            formData.append('has_window_mosquito_net', boolToInt(hasWindowMosquitoNet));
            formData.append('has_balcony', boolToInt(hasBalcony));
            formData.append('is_balcony_view_beautiful', boolToInt(isBalconyViewBeautiful));
            formData.append('has_ventilation', boolToInt(hasVentilation));
            formData.append('has_emergency_exit', boolToInt(hasEmergencyExit));

            formData.append('receptionist_contact_type', receptionistContactType);
            formData.append('food_available', foodAvailable);
            formData.append('booking_type', bookingType);
            appendArray('basic_facilities', basicFacilities);
            appendArray('general_services', generalServices);
            appendArray('health_wellness', healthWellness);
            appendArray('transfers', transfers);
            appendArray('room_amenities', roomAmenities);
            appendArray('food_drinks', foodDrinks);
            appendArray('safety_security', safetySecurity);
            appendArray('media_technology', mediaTechnology);
            appendArray('beauty_spa', beautySpa);
            appendArray('common_area', commonArea);
            appendArray('shopping', shopping);
            appendArray('business_center_conferences', businessCenter);
            appendArray('other_facilities', otherFacilities);
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

    const addRule = () => {
        if (!ruleInput.trim()) return;

        setHotelRules(prev => [...prev, ruleInput.trim()]);
        setRuleInput('');
    };

    const removeRule = (index) => {
        const updated = [...hotelRules];
        updated.splice(index, 1);
        setHotelRules(updated);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLOR.white }}>
            <Header title="Post Hotels" showBack onBackPress={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
                    <Text style={styles.uploadText}>+ Add Hotel Images (upto 10 Images)</Text>
                </TouchableOpacity>

                <ScrollView horizontal>
                    {images.map((img, i) => (
                        <View key={i} style={styles.imageWrapper}>
                            <Image source={{ uri: img.uri }} style={styles.image} />
                            <TouchableOpacity style={styles.crossContainer} onPress={() => removeImage(i)}>
                                <Text style={{ fontSize: 11, padding: 2 }}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <Text style={styles.label}>Hotel Name *</Text>
                <TextInput placeholder='Hotel Name' placeholderTextColor={COLOR.grey} style={styles.input} value={title} onChangeText={setTitle} />

                <Text style={styles.label}>Description *</Text>
                <TextInput placeholder='Description' placeholderTextColor={COLOR.grey} textAlignVertical='top' style={[styles.input, styles.textArea]} multiline value={description} onChangeText={setDescription} />

                <Text style={styles.label}>Phone *</Text>
                <TextInput placeholder='Phone' placeholderTextColor={COLOR.grey} style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />

                <Text style={styles.label}>Price *</Text>
                <TextInput placeholder='Price' placeholderTextColor={COLOR.grey} style={styles.input} value={price} onChangeText={setPrice} />
                {renderSelect('Hotel Type (Rating basis)', ['1', '2', '3', '4', '5'], hotelType, setHotelType)}
                {/* {renderSelect('Room Type', ['Single', 'Double', 'Triple', '4+'], roomType, setRoomType)} */}
                {renderSelect('Room Type', ['Single', 'Double', 'Triple', '4+'], roomType, setRoomType, true)}

                {renderSelect('Bed Type', ['King Size Bed', 'Queen Size Bed', 'Double Bed / Full-Size Bed', 'Single Bed', 'Twin Beds'], bedType, setBedType, true)}
                {/* {renderSelect('Bed Type', ['King Size Bed', 'Queen Size Bed', 'Double Bed / Full-Size Bed', 'Single Bed', 'Twin Beds'], bedType, setBedType)} */}
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
                    <Text style={styles.optionText}>{checkInTime || 'Select Check In Time'}</Text>
                </TouchableOpacity>

                {showCheckInPicker && (
                    <DateTimePicker value={new Date()} mode="time" is24Hour display="default" onChange={onChangeCheckIn} />
                )}

                <Text style={styles.label}>Check Out Time</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowCheckOutPicker(true)}>
                    <Text style={styles.optionText}>{checkOutTime || 'Select Check Out Time'}</Text>
                </TouchableOpacity>

                {showCheckOutPicker && (
                    <DateTimePicker value={new Date()} mode="time" is24Hour display="default" onChange={onChangeCheckOut} />
                )}

                <Text style={styles.label}>Room Size</Text>
                <TextInput placeholder='Room Size' placeholderTextColor={COLOR.grey} style={styles.input} value={roomSize} onChangeText={setRoomSize} />

                {/* TOGGLES */}
                {renderToggle('AC Available', isAc, setIsAc)}
                {renderToggle('TV Available', isTvAvailable, setIsTvAvailable)}
                {renderToggle('Landline Available', isLandlineAvailable, setIsLandlineAvailable)}
                {renderToggle('Bathroom Attached', isBathroomAttached, setIsBathroomAttached)}
                {renderToggle('Daily Cleaning', isDailyCleaning, setIsDailyCleaning)}
                {renderToggle('Lift Available', isLiftAvailable, setIsLiftAvailable)}
                {renderToggle('Water 24x7', isWater24x7, setIsWater24x7)}
                {renderToggle('Geyser Available', isGeyserAvailable, setIsGeyserAvailable)}
                {renderSelect('Basic Facilities', ['Housekeeping', 'Mineral Water'], basicFacilities, setBasicFacilities, true)}
                {renderToggle('Anytime Check-in', isAnyTimeCheckin, setIsAnyTimeCheckin)}
                {renderToggle('Identity Proof Required', identityProofRequired, setIdentityProofRequired)}
                {renderToggle('Foreigners Passport Required', foreignersPassportRequired, setForeignersPassportRequired)}
                {renderToggle('All Customers ID Required', allCustomersIdRequired, setAllCustomersIdRequired)}

                {renderToggle('Mattress Changed Daily', isMattressChangedDaily, setIsMattressChangedDaily)}
                {renderToggle('Cab Booking Available', isCabBookingAvailable, setIsCabBookingAvailable)}
                {renderToggle('Friendly Staff', isFriendlyStaff, setIsFriendlyStaff)}
                {renderToggle('Extra Charges', isExtraCharges, setIsExtraCharges)}
                {renderToggle('Towel & Soap Available', isTowelSoapsAvailable, setIsTowelSoapsAvailable)}
                {renderToggle('Hot Water 24x7', isHotWater24x7, setIsHotWater24x7)}

                {renderToggle('Window Mosquito Net', hasWindowMosquitoNet, setHasWindowMosquitoNet)}
                {renderToggle('Balcony', hasBalcony, setHasBalcony)}
                {renderToggle('Beautiful Balcony View', isBalconyViewBeautiful, setIsBalconyViewBeautiful)}
                {renderToggle('Ventilation', hasVentilation, setHasVentilation)}
                {renderToggle('Emergency Exit', hasEmergencyExit, setHasEmergencyExit)}
                {renderSelect('General Services', ['Ticket/Tour Assistance', 'Multilingual Staff'], generalServices, setGeneralServices, true)}

                {renderSelect('Room Amenities', ['TV', 'Towel'], roomAmenities, setRoomAmenities, true)}

                {renderSelect('Food & Drinks', ['Dining Area', 'No allow'], foodDrinks, setFoodDrinks, true)}

                {renderSelect('Safety & Security', ['Exit', 'Enter'], safetySecurity, setSafetySecurity, true)}
                {/* RULE LIST */}
                <Text style={styles.label}>Single Room Price</Text>
                <TextInput style={styles.input} value={singleRoomPrice} onChangeText={setSingleRoomPrice} />

                <Text style={styles.label}>Double Room Price</Text>
                <TextInput style={styles.input} value={doubleRoomPrice} onChangeText={setDoubleRoomPrice} />

                <Text style={styles.label}>Triple Room Price</Text>
                <TextInput style={styles.input} value={tripleRoomPrice} onChangeText={setTripleRoomPrice} />

                <Text style={styles.label}>4+ Room Price</Text>
                <TextInput style={styles.input} value={fourPlusRoomPrice} onChangeText={setFourPlusRoomPrice} />
                <Text style={styles.label}>Hotel Rules and Policies *</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        placeholder="Enter rule"
                        placeholderTextColor={COLOR.grey}
                        style={[styles.input, { flex: 1 }]}
                        value={ruleInput}
                        onChangeText={setRuleInput}
                    />

                    <TouchableOpacity
                        onPress={addRule}
                        style={{
                            marginLeft: 10,
                            backgroundColor: COLOR.primary,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderRadius: 8
                        }}
                    >
                        <Text style={{ color: '#fff' }}>Add</Text>
                    </TouchableOpacity>
                </View>

                {hotelRules.map((rule, index) => (
                    <View key={index} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 8,
                        backgroundColor: '#f2f2f2',
                        padding: 10,
                        borderRadius: 6
                    }}>
                        <Text style={{ flex: 1 }}>{rule}</Text>

                        <TouchableOpacity onPress={() => removeRule(index)}>
                            <Text style={{ color: 'red' }}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <Text style={styles.label}>Location *</Text>
                <GooglePlacePicker
                    placeholder="Search location..."
                    onPlaceSelected={p => setLocation(p?.address || '')}
                />


                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5, marginTop: 20, marginBottom: 10 }}>

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
                        I agree to the Terms and Conditions and Privacy Policy.
                    </Text>

                </View>



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
    selectedBtn: { backgroundColor: COLOR.primary, color: COLOR.black },
    toggleText: { fontWeight: '600', color: COLOR.black },
    selectedText: { color: 'white' },

    uploadBtn: {
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: 12,
        marginTop: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    uploadText: { fontWeight: '600', color: COLOR.black },

    imageWrapper: { marginRight: 10, marginTop: 10 },
    image: { width: 90, height: 90, borderRadius: 8 },
    crossContainer: {
        position: 'absolute',
        top: 0,
        right: 5,
        backgroundColor: COLOR.black,
        borderRadius: 10,
        paddingHorizontal: 5,
    },
    label: { marginTop: 12, fontWeight: '600', color: 'black' },
    input: { borderWidth: 1, borderColor: COLOR.grey, borderRadius: 8, padding: 10, color: COLOR.black },
    textArea: { height: 100 },
    optionBtn: { borderWidth: 1, borderColor: COLOR.grey, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginRight: 10, marginTop: 8 },
    selectedBtn: { backgroundColor: COLOR.primary },
    optionText: { fontWeight: '600', color: COLOR.black },



});