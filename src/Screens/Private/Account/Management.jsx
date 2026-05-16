import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../Components/FeedHeader';
import { useApi } from '../../../Backend/Api';

const tabs = ['Property', 'Hostel', 'Convention', 'Resort', 'Farm', 'Hotels'];

const apiUrls = {
    Property: 'public/api/my-property',
    Hostel: 'public/api/my-hostels',
    Convention: 'public/api/my-halls',
    Resort: 'public/api/my-resorts',
    Farm: 'public/api/my-farms',
    Hotels: 'public/api/hotels-reviews',
};

const deleteUrls = {
    Property: id => `public/api/properties/delete/${id}`,
    Hostel: id => `public/api/hostel/delete/${id}`,
    Convention: id => `public/api/hall-delete/${id}`,
    Resort: id => `/public/api/hall-delete/${id}`,
    Farm: id => `public/api/farms/${id}`,
    Hotels: id => `public/api/hotels/delete/${id}`, // ✅ FIXED
};
const editRoutes = {
    Property: 'EditProperty',
    Hostel: 'EditHostel',
    Convention: 'EditConvention',
    Resort: 'EditResort',
    Farm: 'EditFarm',
    Hotels: 'EditHotel',
};

const Management = ({ navigation }) => {
    const { getRequest, postRequest } = useApi();
    const isFocus = useIsFocused();

    const [activeTab, setActiveTab] = useState('Property');
    const [loader, setLoader] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState(null);
    const [data, setData] = useState([]);

    const getDataByTab = async tab => {
        try {
            setLoader(true);

            const url = apiUrls[tab];

            if (!url) {
                setData([]);
                return;
            }

            const response = await getRequest(url);
            console.log(`${tab} Data: `, response?.data?.data);

            if (response?.success) {
                setData(response?.data?.data?.data || response?.data?.data || []);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log(`${tab} API Error: `, error);
            setData([]);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (isFocus) {
            getDataByTab(activeTab);
        }
    }, [isFocus, activeTab]);

    const formatPrice = price => {
        const amount = Number(price || 0);
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getItemId = item => {
        return item?.id || item?.hotel_info?.id;
    };

    const getImageUrl = item => {
        console.log(item,"ITENNNN");
        
        return (
            item?.images?.[0]?.image_url ||
            item?.images?.[0]?.image_path ||
            item?.image ||
            item?.image_path ||
            item?.hostel_image ||
            item?.property_image ||
            item?.hotel_info?.primary_image ||
            null
        );
    };

    const getTitle = item => {
        return (
            item?.title ||
            item?.name ||
            item?.hostel_name ||
            item?.property_name ||
            item?.hotel_info?.hotel_name ||
            'No Title'
        );
    };

    const getDescription = item => {
        return (
            item?.description ||
            item?.details ||
            item?.about ||
            item?.hotel_info?.description ||
            'No description available'
        );
    };

    const getPrice = item => {
        return (
            item?.price ||
            item?.rent ||
            item?.amount ||
            item?.monthly_rent ||
            item?.hotel_info?.price
        );
    };

    const handleEdit = item => {
        const routeName = editRoutes[activeTab];
        console.log(item, "ITEMMMMMMM");
        if (activeTab == "Property") {
            navigation.navigate("PostProperty", {
                item
            });
        } else if (activeTab == "Convention") {
            navigation.navigate("CreateConvention", {
                item
            });
        }else if(activeTab=="Resort"){
              navigation.navigate("CreateConvention", {
                item
            });
        }
        else if(activeTab=="Hostel"){
               navigation.navigate("PostHostel", {
                item
            });
        }

    };

    const handleDelete = item => {
        const id = getItemId(item);

        if (!id) {
            Alert.alert('Error', 'Item id not found');
            return;
        }

        Alert.alert(
            'Delete',
            `Are you sure you want to delete this ${activeTab}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteItem(id),
                },
            ],
        );
    };

    const deleteItem = async id => {
        try {
            setDeleteLoader(id);

            const url = deleteUrls[activeTab](id);
            console.log(url, "DELTE___URL");

            const response = await postRequest(url); // 🔥 THIS WILL CALL: /public/api/hotels/25

            console.log('DELETE RESPONSE:', response);

            if (response?.success || response?.data?.status) {
                setData(prev =>
                    prev.filter(item => getItemId(item) !== id)
                );
                Alert.alert('Success', 'Deleted successfully');
            } else {
                Alert.alert('Error', 'Delete failed');
            }
        } catch (error) {
            console.log('DELETE ERROR:', error);
        } finally {
            setDeleteLoader(null);
        }
    };

    const renderItem = ({ item }) => {
        const imageUrl = getImageUrl(item);
        const price = getPrice(item);
        const id = getItemId(item);

        return (
            <View style={styles.propertyCard}>
                <Image
                    source={
                        imageUrl
                            ? { uri: imageUrl }
                            : {
                                uri: 'https://cdn-icons-png.flaticon.com/128/17807/17807769.png',
                            }
                    }
                    style={styles.propertyImage}
                    resizeMode="cover"
                />

                <View style={styles.propertyInfo}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                        {getTitle(item)}
                    </Text>

                    {!!price && (
                        <Text style={styles.propertyPrice}>
                            {formatPrice(price)}
                        </Text>
                    )}

                    <Text style={styles.propertyDescription} numberOfLines={2}>
                        {getDescription(item)}
                    </Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.editButton}
                            onPress={() => handleEdit(item)}
                        >
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item)}
                            disabled={deleteLoader === id}
                        >
                            {deleteLoader === id ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header
                title="Management"
                showBack
                onBackPress={() => navigation.goBack()}
            />

            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabContainer}
                >
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.8}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabButton,
                                activeTab === tab && styles.activeTabButton,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loader ? (
                <ActivityIndicator
                    size="small"
                    color="#111827"
                    style={styles.loader}
                />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => `${getItemId(item) || index}`}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No data found</Text>
                    }
                />
            )}
        </View>
    );
};

export default Management;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },

    tabContainer: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 10,
    },

    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },

    activeTabButton: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },

    tabText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },

    activeTabText: {
        color: '#FFFFFF',
    },

    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
        flexGrow: 1,
    },

    propertyCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ECECEC',
    },

    propertyImage: {
        width: 110,
        height: 130,
        backgroundColor: '#E5E7EB',
    },

    propertyInfo: {
        flex: 1,
        padding: 12,
    },

    propertyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },

    propertyPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#16A34A',
        marginBottom: 6,
    },

    propertyDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },

    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },

    editButton: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        backgroundColor: '#2563EB',
    },

    editButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    deleteButton: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        backgroundColor: '#DC2626',
        minWidth: 70,
        alignItems: 'center',
    },

    deleteButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
    },

    loader: {
        marginTop: 40,
    },
});