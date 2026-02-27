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

const HostelReviewManagement = ({ navigation }) => {
    const { getRequest } = useApi();
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHostelReviews = async () => {
        try {
            const response = await getRequest('public/api/get-hostel-review-list');
            if (response?.success) {
                setHostels(response.data?.data || []);
            } else {
                console.log('Failed to fetch reviews:', response?.message);
            }
        } catch (error) {
            console.error('Error fetching hostel reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostelReviews();
    }, []);


    console.log(hostels, "lOOOOO");

    const renderReview = ({ item }) => {
        const hostel = item.hostel_details;
        const imageUri = hostel?.images?.[0]?.image_path
            ? `${hostel.images[0].image_path}`
            : null;

        return (
            <View style={styles.card}>
                <View style={{ flexDirection: "row" }}>
                    {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.hostelName}>{hostel?.title}</Text>
                        <Text style={styles.price}>
                            ₹{hostel?.min_price || 'N/A'} - ₹{hostel.max_price || 'N/A'}
                        </Text>
                        <Text style={styles.location} numberOfLines={2}>{hostel.location}</Text>
                    </View>

                </View>

                {hostel.reviews?.length > 0 ? (
                    hostel.reviews.map((rev, i) => (
                        <View key={i} style={styles.reviewBox}>
                            <Text style={styles.reviewer}>
                                👤 {rev.user?.name || 'Anonymous'}
                            </Text>
                            <Text style={styles.feedback}>
                                🍴 Food: {rev.food_good ? 'Good' : 'Bad'} | 🛏 Room:{' '}
                                {rev.room_clean ? 'Clean' : 'Dirty'}
                            </Text>
                            <Text style={styles.feedback}>
                                🙋‍♂️ Staff: {rev.staff_good ? 'Good' : 'Poor'} | 🛡 Safety:{' '}
                                {rev.safe_stay ? 'Safe' : 'Unsafe'}
                            </Text>
                            {rev.additional_feedback ? (
                                <Text style={styles.comment}>
                                    💬 "{rev.additional_feedback}"
                                </Text>
                            ) : null}
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
                title={'Hostel Review Management'}
                showBack
                onBackPress={() => navigation.goBack()}
            />

            {loading ? (
                <ActivityIndicator size="large" color={COLOR.primary} style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={hostels}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderReview}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
                            No hostel reviews available.
                        </Text>
                    }
                />
            )}
        </View>
    );
};

export default HostelReviewManagement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
        marginBottom: 10,
    },
    hostelName: {
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
        width: windowWidth / 1.8
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
        color: '#111',
    },
    feedback: {
        fontSize: 13,
        color: '#444',
        marginTop: 3,
    },
    comment: {
        fontStyle: 'italic',
        color: '#555',
        marginTop: 4,
    },
    noReview: {
        color: '#777',
        marginTop: 8,
        fontStyle: 'italic',
    },
});
