import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';

import { COLOR } from '../../../Constants/Colors';
import { AnimatedButton, HomeHeader } from '../Dashboard/Home';
import { windowHeight, windowWidth } from '../../../Constants/Dimensions';
import SortModal from '../../../Components/SortModal';
import PropertyCard from '../../../Components/PropertyCard';
import { useApi } from '../../../Backend/Api';
import RenderFilterOptions from '../../../Components/renderFilterOptions';
import MultiModal from '../../../Components/MultiModal';

const HotelMain = ({ navigation }) => {
    const { getRequest } = useApi();

    const [sortVisible, setSortVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const [loader, setLoader] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [AppliedModalFilter, setAppliedModalFilter] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const [attendedFilter, setAttendedFilter] = useState([]);
    const [multiFilter, setMultiFilter] = useState(false);

    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [avaialbleFilter, setavaialbleFilter] = useState([
        {
            id: 'priceRange',
            type: 'price',
            name: 'Price Range',
            data: [],
        },
        {
            id: 'hotelType',
            type: 'hotel_type',
            name: 'Hotel Type',
            data: ['1', '2', '3', '4', '5'],
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
    ]);
    useEffect(() => {
        if (Object.keys(appliedFilters).length > 0) {
            setAppliedModalFilter(appliedFilters);

        }
    }, [appliedFilters]);
    const handleFilterChange = newFilters => {
        setAppliedFilters(newFilters);
    };;
    const sortOptions = [
        { label: 'Price: Low to High', value: 'asc' },
        { label: 'Price: High to Low', value: 'des' },
    ];

    // =========================
    // GET HOTELS API
    // =========================
    const GetHotels = async (pageNumber = 1, loadMore = false) => {
        try {
            if (loadMore) {
                setLoadingMore(true);
            } else {
                setLoader(true);
            }

            let url = `public/api/hotels?status=1&page=${pageNumber}`;

            if (searchQuery) {
                url += `&location=${searchQuery}`;
            }

            if (sortQuery) {
                url += `&sort_order=${sortQuery}`;
            }
            console.log(url, "URLLL");


            const response = await getRequest(url);

            const data = response?.data?.data || [];
            console.log(data, "DATATATAT");

            if (loadMore) {
                setProperties(prev => [...prev, ...data]);
            } else {
                setProperties(data);
            }

            setHasMore(data.length > 0);
            setPage(pageNumber);
        } catch (error) {
            console.log('Hotel Fetch Error:', error);
        } finally {
            setLoader(false);
            setLoadingMore(false);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        GetHotels(1);
    }, [sortQuery]);
    useEffect(() => {
        GetHotels(1);
    }, [])

    // =========================
    // LOAD MORE
    // =========================
    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            GetHotels(page + 1, true);
        }
    };
    useEffect(() => {
        // console.log("I___M_CALLED");
        // console.log(activeTab, "ACTIVE___TAB");

        GetHotels(
            1,
            false,
            searchQuery,
            sortQuery,
        );
    }, [searchQuery, sortQuery]);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />

            <HomeHeader navigation={navigation} />

            {/* SEARCH BAR */}
            <View style={styles.searchContainer}>
                <Image
                    source={{
                        uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
                    }}
                    style={styles.searchIcon}
                />

                <TextInput
                    placeholder="Search Hotels"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholderTextColor={COLOR.grey}
                />

                <TouchableOpacity onPress={() => GetHotels(1)}>
                    <Image
                        source={{
                            uri: 'https://cdn-icons-png.flaticon.com/128/54/54481.png',
                        }}
                        style={styles.filterIcon}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('HotelFilter', {
                            onApplyFilter: handleFilterChange,
                            existingFilters: appliedFilters,
                            modalFilters: AppliedModalFilter,
                            setAppliedModalFilter: setAppliedModalFilter,
                        })
                    }>
                    <Image
                        source={{
                            uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
                        }}
                        style={styles.filterIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* SORT MODAL */}
            <SortModal
                sortOptions={sortOptions}
                visible={sortVisible}
                onClose={() => setSortVisible(false)}
                onSelectSort={sortType => {
                    setSortQuery(sortType);
                }}
            />
            <View
                style={{
                    overflow: 'hidden',
                    height: 50,
                    width: '90%',
                    alignSelf: 'center',
                    backgroundColor: COLOR.white,
                    justifyContent: 'center',
                }}>

                {RenderFilterOptions({
                    avaialbleFilter,
                    AppliedModalFilter,
                    attendedFilter,
                    setAttendedFilter,
                    setMultiFilter,
                    setAppliedModalFilter,
                    COLOR,
                    appliedFilters,
                })}

            </View>
            {/* HOTEL LIST */}
            <FlatList
                data={properties}
                renderItem={({ item }) => (
                    <PropertyCard
                        item={item}
                        type={'hotel'}
                    />
                )}
                keyExtractor={item => item.id?.toString()}
                numColumns={2}
                contentContainerStyle={{
                    paddingBottom: 80,
                    marginHorizontal: 10,
                }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={loader}
                        onRefresh={() => {
                            setSortQuery(null)
                            GetHotels(1)
                        }}
                        colors={[COLOR.primary]}
                        tintColor={COLOR.primary}
                    />
                }
                ListFooterComponent={
                    loadingMore ? (
                        <View style={{ padding: 16 }}>
                            <ActivityIndicator size="small" color={COLOR.primary} />
                        </View>
                    ) : null
                }
            />
            <MultiModal
                filterValueData={attendedFilter}
                visible={multiFilter}
                initialSelected={AppliedModalFilter}
                onClose={() => {
                    setMultiFilter(false);
                }}
                onSelectSort={selectedFilters => {
                    setAppliedModalFilter(prev => ({
                        ...prev,
                        ...selectedFilters,
                    }));
                    GetHotels(
                        1,
                        false,
                        selectedFilters,
                        searchQuery,
                        sortQuery,
                        true,
                    );
                }}
            />
            {/* FLOATING BUTTON */}
            <AnimatedButton
                title={'Post Hotels'}
                onPress={() => navigation.navigate('PostHotel')}
                iconUrl={'https://cdn-icons-png.flaticon.com/128/3009/3009489.png'}
            />
        </SafeAreaView>
    );
};

export default HotelMain;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.white,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        backgroundColor: COLOR.white,
        borderRadius: 10,
        paddingHorizontal: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        paddingVertical: 8,
        marginHorizontal: 20,
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: COLOR.grey,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
        color: COLOR.black,
    },
    filterIcon: {
        width: 22,
        height: 22,
        tintColor: COLOR.primary,
        marginLeft: 8,
    },
});