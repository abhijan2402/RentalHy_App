import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    ActivityIndicator
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useApi } from '../../../Backend/Api'
import { COLOR } from '../../../Constants/Colors'
import Header from '../../../Components/FeedHeader'
import moment from 'moment'
import { windowWidth } from '../../../Constants/Dimensions'

const HotelBookings = () => {

    const { getRequest } = useApi()

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const getBookings = async () => {

        try {

            const response = await getRequest("public/api/hotel-booking/my-bookings")

            console.log(response)

            setBookings(response?.data?.data || [])

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)

        }

    }

    useEffect(() => {

        getBookings()

    }, [])


    const renderItem = ({ item }) => {

        return (

            <View style={styles.card}>

                {/* Hotel Image */}

                <Image
                    source={{ uri: item?.hotel?.primary_image }}
                    style={styles.image}
                />

                {/* Hotel Info */}

                <View style={styles.infoContainer}>

                    <Text style={styles.hotelName}>
                        {item?.hotel?.name}
                    </Text>

                    <Text style={styles.location}>
                        {item?.hotel?.location}
                    </Text>


                    <View style={styles.row}>
                        <Text style={styles.label}>Check In:</Text>
                        <Text style={styles.value}>
                            {moment(item?.check_in?.datetime).format("DD-MM-YYYY")}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Check Out:</Text>
                        <Text style={styles.value}>
                            {moment(item?.check_out?.datetime).format("DD-MM-YYYY")}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Duration:</Text>
                        <Text style={styles.value}>
                            {item?.duration?.text}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Guests:</Text>
                        <Text style={styles.value}>
                            {item?.guests?.summary}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Rooms:</Text>
                        <Text style={styles.value}>
                            {item?.room_count}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Payment:</Text>
                        <Text style={styles.value}>
                            {item?.payment?.method_text}
                        </Text>
                    </View>

                    {/* <View style={styles.row}>
                        <Text style={styles.label}>Total:</Text>
                        <Text style={styles.price}>
                            ₹{item?.pricing?.total}
                        </Text>
                    </View> */}

                    <View style={styles.statusBox}>
                        <Text style={styles.statusText}>
                            {item?.booking?.status_text}
                        </Text>
                    </View>

                </View>

            </View>

        )

    }

    return (

        <View style={styles.container}>

            <Header title={"My Bookings"} showBack />

            {loading ? (

                <ActivityIndicator
                    size="large"
                    color={COLOR.primary}
                    style={{ marginTop: 40 }}
                />

            ) : (

                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            No bookings found
                        </Text>
                    }
                />

            )}

        </View>

    )

}

export default HotelBookings


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLOR.white
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        overflow: "hidden"
    },

    image: {
        width: windowWidth,
        height: 120
    },

    infoContainer: {
        padding: 14
    },

    hotelName: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLOR.black
    },

    location: {
        fontSize: 12,
        color: COLOR.grey,
        marginBottom: 6
    },

    reference: {
        fontSize: 12,
        color: COLOR.primary,
        marginBottom: 8
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4
    },

    label: {
        fontSize: 13,
        color: COLOR.grey
    },

    value: {
        fontSize: 13,
        color: COLOR.black
    },

    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLOR.primary
    },

    statusBox: {
        marginTop: 8,
        backgroundColor: "#F2F6FF",
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: "center"
    },

    statusText: {
        color: COLOR.primary,
        fontWeight: "600"
    },

    empty: {
        textAlign: "center",
        marginTop: 40,
        color: COLOR.grey
    }

})