

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import CustomButton from '../../../Components/CustomButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { COLOR } from '../../../Constants/Colors';

export const formatIndianCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0';
    const num = Number(amount);
    return num.toLocaleString('en-IN');
};

const HotelFilter = ({ navigation, route }) => {
    const onApplyFilter = route?.params?.onApplyFilter;
    const modalFilters = route?.params?.modalFilters || {};
    const setAppliedModalFilter =
        route?.params?.setAppliedModalFilter || (() => { });

    // UPDATED FILTER LIST (HOTEL FILTERS)
    const avaialbleFilter = [
        { id: 'priceRange', type: 'price', name: 'Price Range', data: [] },

        {
            id: 'hotelType',
            type: 'hotel_type',
            name: 'Hotel Type',
            data: ['1*', '2*', '3*', '4*', '5*'],
        },

        {
            id: 'roomType',
            type: 'room_type',
            name: 'Room Type',
            data: ['Single', 'Double', 'Triple', '4+'],
        },

        {
            id: 'bedType',
            type: 'bed_type',
            name: 'Bed Type',
            data: [
                'King Size Bed',
                'Queen Size Bed',
                'Double Bed / Full-Size Bed',
                'Single Bed',
                'Twin Beds',
            ],
        },

        {
            id: 'guestsPerRoom',
            type: 'guests_per_room',
            name: 'Guests Per Room',
            data: ['1', '2', '3', '4', '5+'],
        },

        {
            id: 'acType',
            type: 'ac_type',
            name: 'A/C or Non AC',
            data: ['AC', 'Non AC'],
        },

        {
            id: 'tvAvailable',
            type: 'tv_available',
            name: 'TV Available',
            data: ['Yes', 'No'],
        },

        {
            id: 'landlineAvailable',
            type: 'landline_available',
            name: 'Landline Available',
            data: ['Yes', 'No'],
        },

        {
            id: 'liftAvailable',
            type: 'lift_available',
            name: 'Lift Available',
            data: ['Yes', 'No'],
        },

        {
            id: 'waterAvailability',
            type: 'water_availability',
            name: 'Water Availability (24 Hours)',
            data: ['Yes', 'No'],
        },

        {
            id: 'towelSoapAvailable',
            type: 'towel_soap_available',
            name: 'Towel & Soaps Available',
            data: ['Yes', 'No'],
        },

        {
            id: 'geyserAvailable',
            type: 'geyser_available',
            name: 'Geyser Available',
            data: ['Yes', 'No'],
        },

        {
            id: 'hotWater24hrs',
            type: 'hot_water_24hrs',
            name: 'Hot Water 24 Hours',
            data: ['Yes', 'No'],
        },
    ];

    // FILTER STATE
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const initialState = avaialbleFilter.reduce((acc, filter) => {
            if (filter.type === 'price') {
                acc.price = {
                    min: modalFilters.min_price || 5000,
                    max: modalFilters.max_price || 100000,
                };
            } else {
                acc[filter.type] = modalFilters[filter.type] || [];
            }
            return acc;
        }, {});
        setFilters(initialState);
    }, [modalFilters]);

    const handleSelect = (type, option) => {
        setFilters(prev => {
            const current = prev[type] || [];
            let updatedValues;

            if (current.includes(option)) {
                updatedValues = current.filter(item => item !== option);
            } else {
                updatedValues = [...current, option];
            }

            const updated = { ...prev, [type]: updatedValues };
            updateParentFilter(type, updatedValues);
            return updated;
        });
    };

    const handlePriceChange = values => {
        setFilters(prev => ({
            ...prev,
            price: { min: values[0], max: values[1] },
        }));
    };

    const handlePriceFinish = values => {
        updateParentFilter('min_price', values[0]);
        updateParentFilter('max_price', values[1]);
    };

    const updateParentFilter = (type, value) => {
        setAppliedModalFilter(prev => ({
            ...prev,
            [type]: value,
        }));
    };

    const handleReset = () => {
        const resetState = avaialbleFilter.reduce((acc, filter) => {
            if (filter.type === 'price') {
                acc.price = { min: 5000, max: 100000 };
            } else {
                acc[filter.type] = [];
            }
            return acc;
        }, {});
        setFilters(resetState);
        setAppliedModalFilter({});
        onApplyFilter({});
        navigation.goBack();
    };

    const handleApply = () => {
        const formatted = { ...filters };
        formatted.min_price = filters.price.min;
        formatted.max_price = filters.price.max;
        delete formatted.price;

        onApplyFilter(formatted);
        setAppliedModalFilter(formatted);
        navigation.goBack();
    };

    const renderOptions = (label, type, options) => {
        if (type === 'price') {
            const { min, max } = filters.price || {};
            return (
                <View key={type}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={{ paddingHorizontal: 10 }}>
                        <MultiSlider
                            values={[min, max]}
                            onValuesChange={handlePriceChange}
                            onValuesChangeFinish={handlePriceFinish}
                            min={1000}
                            max={100000}
                            step={1000}
                            selectedStyle={{ backgroundColor: COLOR.primary }}
                            markerStyle={{
                                backgroundColor: COLOR.primary,
                                height: 20,
                                width: 20,
                            }}
                            trackStyle={{ height: 4 }}
                        />
                        <View style={styles.priceLabelRow}>
                            <Text style={styles.priceLabel}>₹{min?.toLocaleString()}</Text>
                            <Text style={styles.priceLabel}>₹{max?.toLocaleString()}+</Text>
                        </View>
                    </View>
                </View>
            );
        }

        const selectedValues = filters[type] || [];

        return (
            <View key={type}>
                <Text style={styles.label}>{label}</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.optionRow}>
                    {options.map(option => {
                        const isSelected = selectedValues.includes(option);
                        return (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionButton,
                                    isSelected && styles.optionSelected,
                                ]}
                                onPress={() => handleSelect(type, option)}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected,
                                    ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header
                title={'Filters'}
                showBack
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.form}>
                {avaialbleFilter.map(item =>
                    renderOptions(item.name, item.type, item.data),
                )}

                <View style={styles.buttonRow}>
                    <CustomButton
                        title="Apply"
                        onPress={handleApply}
                        style={{ width: '48%' }}
                    />
                    <CustomButton
                        title="Reset"
                        onPress={handleReset}
                        style={{ backgroundColor: COLOR.grey, width: '48%' }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default HotelFilter;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLOR.white },
    form: { padding: 16 },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLOR.black,
        marginBottom: 8,
        marginTop: 12,
    },

    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },

    optionButton: {
        borderWidth: 1,
        borderColor: COLOR.grey,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLOR.white,
        marginRight: 10,
    },

    optionSelected: {
        backgroundColor: COLOR.primary,
        borderColor: COLOR.primary,
    },

    optionText: {
        color: COLOR.black,
    },

    optionTextSelected: {
        color: COLOR.white,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 13,
        marginHorizontal: 10,
    },

    priceLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },

    priceLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLOR.black,
    },
});