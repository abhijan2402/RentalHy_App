import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import {useIsFocused} from '@react-navigation/native';
import ConventionAmed from '../../../Components/ConventionAmed';
import HostelAmed from '../../../Components/HostelAmed';

const PropertyDetail = ({navigation, route}) => {
  const isFocus = useIsFocused();
  const {getRequest, postRequest} = useApi();
  const {showToast} = useToast();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [AllData, setAllData] = useState();
  const [images, setImages] = useState([]);

  console.log(AllData,"AllDataAllDataAllData")
  const [buttonLoader, setButtonLoader] = useState(false);
  const {type, propertyData} = route?.params;
  const [reviews, setReviews] = useState({
    food: null,
    cleanliness: null,
    staff: null,
    safety: null,
  });
  const [reviewsCount, setReviewsCount] = useState({
    food: null,
    cleanliness: null,
    staff: null,
    safety: null,
  });
  const [description, setDescription] = useState('');
  const [user_reviewed, setuser_reviewed] = useState(false);

  /** Handle thumb press */
  const handleReviewPress = (key, value) => {
    setReviews(prev => ({...prev, [key]: value}));
  };
  const questions = [
    {key: 'food', text: 'Food is good?'},
    {key: 'cleanliness', text: 'Room Cleanliness is good?'},
    {key: 'staff', text: 'Staff is good?'},
    {key: 'safety', text: 'Safe to stay?'},
  ];
  const thumbUpUrl = 'https://cdn-icons-png.flaticon.com/128/739/739231.png';
  const getPropertyDetails = async (id, load = true) => {
    if (load) {
      setLoading(false);
    }
    let url =
      type === 'convention'
        ? `public/api/hall_deatils/${id}`
        : type === 'hostel'
        ? `public/api/hostels/${id}`
        : `public/api/properties/${id}`;

    const response = await getRequest(url);
    if (response?.data?.status || response?.data?.success) {
      console.log(response?.data, 'Property Details');

      setImages(
        type === 'convention'
          ? response?.data?.data?.images?.hall?.map(e => e?.image_path)
          : response?.data?.data?.images?.map(e => e?.image_url),
      );
      setAllData(response?.data?.data);
      // if (response?.data?.user_reviewed) {
      console.log(response?.data?.review_stats, 'HUGUYGYU0');
      setuser_reviewed(response?.data?.user_reviewed);
      setReviewsCount({
        food: response?.data?.review_stats?.food_thumbs_up,
        cleanliness: response?.data?.review_stats?.room_clean_thumbs_up,
        staff: response?.data?.review_stats?.staff_thumbs_up,
        safety: response?.data?.review_stats?.safe_stay_thumbs_up,
      });
      setDescription(response?.data?.review_stats?.additional_feedback);
      // }
      setLoading(false);
    }
    setLoading(false);
  };

  const propertyViewed = async id => {
    const formData = new FormData();
    formData.append('property_id', id);
    const response = await postRequest(
      `public/api/property-views/store`,
      formData,
      true,
    );

    if (response?.success == false) {
      showToast(response?.error, 'error');
    }
  };

  useEffect(() => {
    if (propertyData?.id) {
      getPropertyDetails(propertyData?.id);
      propertyViewed(propertyData?.id);
    }
  }, [propertyData?.id]);

  const toggleLike = async id => {
    const formdata = new FormData();
    formdata.append('property_id', id);
    const response = await postRequest(
      'public/api/wishlist/add',
      formdata,
      true,
    );

    if (response?.data?.status) {
      showToast(response?.data?.message, 'success');
      // setLikedProperties(prev =>
      //   prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id],
      // );
      getPropertyDetails(response?.data?.data?.property_id, false);
    } else {
      showToast(response?.error, 'error');
    }
  };

  const submitFeedback = async () => {
    try {
      setButtonLoader(true);
      const formData = new FormData();
      formData.append('hostel_id', AllData?.id);
      formData.append('food_good', reviews?.food ? reviews?.food : '0');
      formData.append(
        'room_clean',
        reviews?.cleanliness ? reviews?.cleanliness : '0',
      );
      formData.append('staff_good', reviews?.staff ? reviews?.staff : '0');
      formData.append('safe_stay', reviews?.safety ? reviews?.safety : '0');
      if (description) formData.append('additional_feedback', description);
      console.log(formData, 'FORMMMM____DARRRA');

      const response = await postRequest(
        'public/api/hostels/submit-review',
        formData,
        true,
      );
      console.log(response);
      if (response?.data?.status || response?.data?.success) {
        setButtonLoader(false);
        showToast('Review Submitted Successfully', 'success');
      } else {
        setButtonLoader(false);
        showToast('Error Submitting Review', 'error');
      }
    } catch (error) {
      showToast(error, 'error');
    }
    setButtonLoader(false);
  };

  const removeLike = async id => {
    const response = await postRequest(`public/api/wishlist/remove/${id}`);
    if (response?.data?.status) {
      showToast(response?.data?.message, 'success');
      // setLikedProperties(prev => prev.filter(pid => pid !== id));
      getPropertyDetails(propertyData?.id, false);
    } else {
      showToast(response?.error, 'error');
    }
  };

  const phoneNumber = '0';

  const safeParse = value => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value; // fallback to original string
      }
    }
    return value;
  };

  const specifications = {
    bhk: safeParse(AllData?.bhk),
    bathrooms: AllData?.bathrooms,
    area: AllData?.area_sqft ? `${AllData?.area_sqft} sq.ft` : undefined,
    floor: '3rd',
    furnished: safeParse(AllData?.furnishing_status),
  };

  const handleCall = val => {
    Linking.openURL(`tel:${val}`);
  };

  const handleLocation = location => {
    const query = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  console.log(AllData,"AllDataAllDataAllData")

  return (
    <View style={styles.container}>
      <Header
        title={type == 'convention' ? 'Convention Detail' : 'Property Detail'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      {loading ? (
        <ActivityIndicator
          size={'large'}
          color={COLOR?.primary}
          style={{top: '30%'}}
        />
      ) : (
        <ScrollView>
          {/* Horizontal Image Carousel */}
          <FlatList
            data={images}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={({item}) => (
              <Image source={{uri: item}} style={styles.propertyImage} />
            )}
          />

          {/* Content */}
          <View style={styles.content}>
            <View
              style={{
                justifyContent: 'center',
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.title}>{AllData?.title}</Text>
             {type != 'convention' && <TouchableOpacity
                style={styles.wishlistIcon}
                onPress={() =>
                  AllData?.is_wishlist == 1
                    ? removeLike(AllData?.id)
                    : toggleLike(AllData?.id)
                }>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/4240/4240564.png',
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: AllData?.is_wishlist
                      ? COLOR.primary
                      : COLOR.grey,
                  }}
                />
              </TouchableOpacity>}
            </View>
            {/* Read More / Less */}
            <Text style={styles.description}>
              {showFullDesc
                ? AllData?.description
                : AllData?.description?.slice(0, 120) + '...'}
            </Text>
            {AllData?.description?.length > 100 && (
              <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
                <Text style={styles.readMore}>
                  {showFullDesc ? 'Show Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.MainStyle}>
              <Text style={styles.price}>
                {'₹' +
                  (AllData?.price
                    ? AllData?.price
                    : type == 'convention'
                    ? AllData?.min_amount + ' - ' + AllData?.max_amount
                    : AllData?.min_price + ' - ' + AllData?.max_price)}
              </Text>
              {AllData?.status == 1 && (
                <Text style={styles.TagStyle}>Featured</Text>
              )}
            </View>
            {/* Contact Section */}
            {type != 'convention' && (
              <View style={styles.contactContainer}>
                <Text style={styles.contactTitle}>Contact Options</Text>

                {/* Phone */}
                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() =>
                    handleCall(
                      AllData?.user?.phone_number || AllData?.contact_number,
                    )
                  }>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/455/455705.png',
                    }}
                    style={styles.iconLarge}
                  />
                  <Text style={styles.phoneHighlighted}>
                    {AllData?.user?.phone_number || AllData?.contact_number}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.contactContainer}>
              <Text style={styles.contactTitle}>Address</Text>

              {/* Phone */}
              <TouchableOpacity style={styles.locationRow}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/8105/8105423.png',
                  }}
                  style={styles.iconLarge}
                />
                <Text style={styles.phoneHighlighted}>{AllData?.location}</Text>
              </TouchableOpacity>
            </View>
            {/* Location Section */}
            <View style={styles.locationContainer}>
              <Text style={styles.contactTitle}>Location</Text>

              {/* Address */}
              <View style={styles.locationRow}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
                  }}
                  style={styles.iconLarge}
                />
                <Text style={styles.locationHighlighted}>
                  {AllData?.location}
                </Text>
              </View>

              {/* Map Preview */}
              <TouchableOpacity
                onPress={() => {
                  handleLocation(AllData?.location);
                }}
                activeOpacity={0.8}>
                <ImageBackground
                  source={{
                    uri: 'https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg',
                  }}
                  blurRadius={3}
                  style={styles.mapPreview}>
                  <View style={styles.mapOverlay}>
                    <Text style={styles.mapText}>
                      📍 Click to open in Google Maps
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            {/* Amenities */}
            {type !== 'convention' &&
              type !== 'hostel' &&
              AllData?.amenities &&
              Object.keys(AllData.amenities).length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Amenities</Text>
                  <View style={styles.amenitiesContainer}>
                    {Object.entries(AllData.amenities).map(([key, value]) => (
                      <Text key={key} style={styles.specText}>
                        • {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                      </Text>
                    ))}
                  </View>
                </>
              )}

            {'}'}
            {type === 'convention' && (
              <>
                <ConventionAmed AllData={AllData} />
              </>
            )}
            {type === 'hostel' && <HostelAmed AllData={AllData} />}
          </View>
          <View style={{marginHorizontal: 15, marginBottom: 20}}>
            {type === 'hostel' && (
              <>
                <Text
                  style={{
                    fontSize: 17,
                    color: COLOR.black,
                    fontWeight: '600',
                    marginVertical: 10,
                  }}>
                  Please provide feedback
                </Text>
                {questions.map(item => (
                  <View key={item.key} style={styles.questionContainer}>
                    <Text style={styles.question}>{item.text}</Text>
                    <View style={styles.thumbContainer}>
                      <Text style={styles.question}>
                        {reviewsCount[item?.key]}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleReviewPress(item.key, '1')}>
                        <Image
                          source={{uri: thumbUpUrl}}
                          style={[
                            styles.thumbIcon,
                            reviews[item.key] == '1' || user_reviewed
                              ? {
                                  tintColor: COLOR.primary,
                                }
                              : {tintColor: COLOR.grey},
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Description Input */}
                <Text style={styles.descriptionLabel}>Additional Feedback</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Write your feedback here..."
                  multiline
                  editable={!user_reviewed}
                  value={description}
                  onChangeText={setDescription}
                />
                {!user_reviewed && (
                  <CustomButton
                    title="Submit Feedback"
                    style={{marginTop: 15}}
                    loading={buttonLoader}
                    onPress={() => {
                      submitFeedback();
                    }}
                  />
                )}
              </>
            )}
          </View>
          <CustomButton
            title={'Contact Landlord in Chat'}
            onPress={() => {
              navigation.navigate('Chat', {
                receiver_id: AllData?.user_id,
              });
            }}
          />
          {type == 'convention' && (
            <CustomButton
              style={{marginTop: 20}}
              title={'Book Now'}
              onPress={() => {
                navigation.navigate('Booking');
              }}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PropertyDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  propertyImage: {
    width: 400,
    height: 250,
    marginRight: 5,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
  },
  readMore: {
    color: COLOR.primary,
    marginTop: 5,
    marginBottom: 10,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    color: COLOR.primary,
    fontWeight: 'bold',
    marginBottom: 15,
    marginVertical: 5,
  },
  contactContainer: {
    backgroundColor: '#f1f8ff',
    borderRadius: 10,
    padding: 15,
    paddingVertical: 5,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  locationContainer: {
    backgroundColor: '#f1f8ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  phoneHighlighted: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLOR.black,
    marginLeft: 8,
  },
  locationHighlighted: {
    fontSize: 13,
    color: COLOR.black,
    fontWeight: '600',
    marginLeft: 8,
  },
  iconLarge: {
    width: 23,
    height: 23,
    tintColor: COLOR.primary,
  },
  specsContainer: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  specText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amenitiesContainer: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  amenity: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  mapPreview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  mapOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mapText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  wishlistIcon: {
    // position: 'absolute',
    // top: 10,
    // right: 10,
  },
  MainStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TagStyle: {
    backgroundColor: COLOR.primary,
    width: '20%',
    color: 'white',
    fontWeight: 500,
    textAlign: 'center',
    borderRadius: 2,
  },

  questionContainer: {
    backgroundColor: '#fff',
    padding: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  thumbContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginRight: 15,
  },
  thumbIcon: {
    width: 15,
    height: 15,
    tintColor: '#999',
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
