import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Image,
} from 'react-native';

import Header from '../../../Components/FeedHeader';
import { useApi } from '../../../Backend/Api';
import { COLOR } from '../../../Constants/Colors';
import { windowWidth } from '../../../Constants/Dimensions';

const HotelManagement = ({ navigation }) => {
    const { getRequest } = useApi();

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHotelReviews = async () => {
        try {
            const response = await getRequest('public/api/hotels-reviews');

            if (response?.success) {
                // ⭐ FIXED DATA PATH
                setHotels(response?.data?.data || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotelReviews();
    }, []);

    const renderHotel = ({ item }) => {
        const hotel = item?.hotel_info;
        const reviews = item?.recent_reviews || [];

        const imageUri = hotel?.primary_image || null;

        return (
            <View style={styles.card}>

                {/* HOTEL INFO */}
                <View style={{ flexDirection: 'row' }}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : null}

                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.hotelName}>
                            {hotel?.hotel_name}
                        </Text>

                        <Text style={styles.price}>
                            ₹{hotel?.formatted_price || hotel?.price}
                        </Text>

                        <Text style={styles.location} numberOfLines={2}>
                            {hotel?.location}
                        </Text>
                    </View>
                </View>

                {/* REVIEWS */}
                {reviews.length > 0 ? (
                    reviews.map((rev, i) => (
                        <View key={i} style={styles.reviewBox}>
                            <Text style={styles.reviewer}>
                                👤 {rev?.user?.name || 'Anonymous'}
                            </Text>

                            <Text style={styles.feedback}>
                                🍴 Food: {rev?.ratings?.food_good ? 'Good' : 'Bad'} | 🛏 Room:{' '}
                                {rev?.ratings?.room_clean ? 'Clean' : 'Dirty'}
                            </Text>

                            <Text style={styles.feedback}>
                                🙋 Staff: {rev?.ratings?.staff_good ? 'Good' : 'Poor'} | 🛡 Safety:{' '}
                                {rev?.ratings?.safe_stay ? 'Safe' : 'Unsafe'}
                            </Text>

                            {rev?.feedback ? (
                                <Text style={styles.comment}>
                                    💬 "{rev.feedback}"
                                </Text>
                            ) : null}

                            <Text style={{ fontSize: 12, marginTop: 5, color: '#777' }}>
                                {rev?.created_at_formatted}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noReview}>No reviews yet.</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header
                title="Hotel Review Management"
                showBack
                onBackPress={() => navigation.goBack()}
            />

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={COLOR.primary}
                    style={{ marginTop: 30 }}
                />
            ) : (
                <FlatList
                    data={hotels}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderHotel}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </View>
    );
};

export default HotelManagement;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    card: {
        backgroundColor: '#f9fafc',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 10,
    },
    hotelName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    price: {
        fontSize: 13,
        color: '#28a745',
        marginTop: 3,
    },
    location: {
        fontSize: 13,
        color: '#555',
        marginVertical: 5,
        width: windowWidth / 1.8,
    },
    reviewBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    reviewer: {
        fontSize: 14,
        fontWeight: '600',
    },
    feedback: {
        fontSize: 13,
        marginTop: 3,
        color: '#444',
    },
    comment: {
        marginTop: 4,
        fontStyle: 'italic',
        color: '#555',
    },
    noReview: {
        marginTop: 8,
        fontStyle: 'italic',
        color: '#777',
    },
});