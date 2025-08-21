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
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const PropertyDetail = ({navigation, route}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const type = route?.params?.type;
  const [isliked, setIsLiked] = useState(false);
  // Sample data
  const images = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  ];

  const phoneNumber = '+919876543210';
  const location = 'Jaipur, Rajasthan';
  const price = '₹ 25,00,000';
  const title = 'Luxury 2 BHK Apartment';
  const description =
    'A beautiful luxury apartment with all modern amenities and a prime location. This spacious apartment offers ample sunlight, cross ventilation, and premium fittings. Located close to schools, hospitals, and shopping malls, it is an ideal choice for families. The property includes modular kitchen, false ceiling, high-quality flooring, and designer bathrooms. Additional facilities include 24/7 water supply, security, and reserved parking.';

  const specifications = {
    bhk: '2 BHK',
    bathrooms: 2,
    area: '1200 sq.ft',
    floor: '3rd',
    furnished: 'Semi-Furnished',
  };

  const amenities = [
    '24/7 Security',
    'Lift',
    'Gym',
    'Swimming Pool',
    'Parking',
    'Power Backup',
  ];

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleLocation = () => {
    const query = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Property Detail'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

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
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.wishlistIcon}
              onPress={() => setIsLiked(!isliked)}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/13369/13369080.png',
                }}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: isliked ? COLOR.primary : COLOR.grey,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Read More / Less */}
          <Text style={styles.description}>
            {showFullDesc ? description : description.slice(0, 120) + '...'}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
            <Text style={styles.readMore}>
              {showFullDesc ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.price}>{price}</Text>

          {/* Contact Section */}
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Contact Options</Text>

            {/* Phone */}
            <TouchableOpacity style={styles.locationRow} onPress={handleCall}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/455/455705.png',
                }}
                style={styles.iconLarge}
              />
              <Text style={styles.phoneHighlighted}>{phoneNumber}</Text>
            </TouchableOpacity>
          </View>
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
              <Text style={styles.phoneHighlighted}>
                Abc, Hyderabad, 785556
              </Text>
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
              <Text style={styles.locationHighlighted}>{location}</Text>
            </View>

            {/* Map Preview */}
            <TouchableOpacity onPress={handleLocation} activeOpacity={0.8}>
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

          {/* Specifications */}
          <View style={styles.specsContainer}>
            {Object.entries(specifications).map(([key, value]) => (
              <Text key={key} style={styles.specText}>
                • {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </Text>
            ))}
          </View>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {amenities.map((item, index) => (
              <Text key={index} style={styles.amenity}>
                • {item}
              </Text>
            ))}
          </View>
        </View>

        <CustomButton
          title={'Contact Landlord in Chat'}
          onPress={() => {
            navigation.navigate('Chat');
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
});
