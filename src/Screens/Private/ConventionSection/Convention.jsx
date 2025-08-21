import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {AnimatedButton} from '../Dashboard/Home';
import SortModal from '../../../Components/SortModal';
import {windowWidth} from '../../../Constants/Dimensions';
import OptionSelector from '../Dashboard/OptionSelector';
import {showPost} from '../../../Constants/Data';
import {useIsFocused} from '@react-navigation/native';

// ---------------- Tab Button Component ----------------
const TabButton = ({title, isActive, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// ---------------- Hall Card Component ----------------
// ---------------- Hall Card Component ----------------
const HallCard = ({
  image,
  title,
  description,
  location,
  capacity,
  price,
  priceType, // 'per hour' or 'per day'
  ac,
  onBook,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{uri: image}} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
        <Text style={styles.cardInfo}>📍 {location}</Text>
        <Text style={styles.cardInfo}>👥 Capacity: {capacity} people</Text>

        {/* AC + Price + Book Now in one row */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.cardInfo}>
              {ac ? '❄️ AC Available' : '🔥 Non-AC'}
            </Text>
            <Text
              style={[
                styles.cardInfo,
                {marginLeft: 5, fontWeight: '600', color: COLOR.primary},
              ]}>
              ₹ {price}/- {priceType}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ---------------- Convention Hall Component ----------------
const ConventionHall = ({navigation, onPressSort, onPressFilter}) => {
  const halls = [
    {
      id: 1,
      image:
        'https://kobe-cc.jp/kcc/wp-content/uploads/2017/10/img_01-6-1024x622.jpg',
      title: 'Grand Convention Hall',
      description: 'Perfect for weddings, conferences and big events.',
      location: 'Downtown City Center',
      capacity: 500,
      price: 200,
      priceType: 'per hour',
      ac: true,
    },
    {
      id: 2,
      image: 'https://www.ahstatic.com/photos/9884_ho_00_p_1024x768.jpg',
      title: 'Elegant Banquet Hall',
      description: 'Ideal for private parties and gatherings.',
      location: 'Near Lakeview Road',
      capacity: 300,
      price: 5000,
      priceType: 'per day',
      ac: false,
    },
  ];

  return (
    <ScrollView style={styles.content}>
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Convention Halls or Location"
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
        />

        <TouchableOpacity onPress={onPressSort}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/54/54481.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSort}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4662/4662255.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressFilter}>
          {/* // () =>
            // navigation.navigate('Filter', {onApplyFilter: handleFilterChange}) */}

          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      {halls.map(hall => (
        <HallCard
          key={hall.id}
          image={hall.image}
          title={hall.title}
          description={hall.description}
          location={hall.location}
          capacity={hall.capacity}
          price={hall.price}
          priceType={hall.priceType}
          ac={hall.ac}
          onPress={() =>
            navigation.navigate('PropertyDetail', {type: 'convention'})
          }
          onBook={() => navigation.navigate('Booking')}
        />
      ))}
    </ScrollView>
  );
};

// ---------------- Farm House Component ----------------
const FarmHouse = ({navigation, onPressSort, onPressFilter}) => {
  const farms = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60',
      title: 'Green Valley Farm',
      description: 'Peaceful farmhouse surrounded by greenery.',
      location: 'Hilltop Area',
      capacity: 200,
      price: 1500,
      priceType: 'per day',
      ac: true,
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=60',
      title: 'Sunset Farm',
      description: 'Perfect weekend getaway with scenic sunset views.',
      location: 'Countryside Road',
      capacity: 150,
      price: 400,
      priceType: 'per hour',
      ac: false,
    },
  ];

  return (
    <ScrollView style={styles.content}>
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Farm "
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
        />
        <TouchableOpacity onPress={onPressSort}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/54/54481.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSort}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4662/4662255.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() =>
          //   navigation.navigate('Filter', {onApplyFilter: handleFilterChange})
          // }
          onPress={onPressFilter}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      {farms.map(farm => (
        <HallCard
          key={farm.id}
          image={farm.image}
          title={farm.title}
          description={farm.description}
          location={farm.location}
          capacity={farm.capacity}
          price={farm.price}
          priceType={farm.priceType}
          ac={farm.ac}
          onBook={() => navigation.navigate('Booking')}
          onPress={() =>
            navigation.navigate('PropertyDetail', {type: 'convention'})
          }
        />
      ))}
    </ScrollView>
  );
};

// ---------------- Main Convention Screen ----------------
const Convention = ({navigation, route}) => {
  const type = route?.params?.type;
  console.log(type, type == 'farm', 'TYTYPYPYPYPYP');

  const [activeTab, setActiveTab] = useState('convention'); // default tab
  const [sortVisible, setSortVisible] = useState(false);
  const [tabLoader, settabLoader] = useState(false);
  const [defaultIndex, setdefaultIndex] = useState(type == 'farm' ? 2 : 1);
  const [appliedFilters, setAppliedFilters] = useState([
    'Family',
    '2 BHK',
    'Jaipur',
  ]); // demo filters
  const handleFilterChange = newFilters => {
    console.log('Applied Filters:', newFilters);
    setAppliedFilters(newFilters);
  };
  const isFocus = useIsFocused();
  useEffect(() => {
    settabLoader(true);
    setTimeout(() => {
      console.log(type, 'TYYYYYYYY');

      if (type == 'farm') {
        setdefaultIndex(2);
      }
      if (type == 'conv') {
        setdefaultIndex(1);
      }
      settabLoader(false);
    }, 0);
  }, [isFocus]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      {/* <Header title={'Convention Space'} /> */}
      <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image
            source={{
              uri: 'https://i.postimg.cc/59BKnJZJ/second-page-1.jpg',
            }}
            style={styles.locationIcon}
          />
          <View>
            <Text style={styles.locationCity}>Jaipur</Text>
            <Text style={styles.locationAddress}>Abc, Jaipur, Rajasthan</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=100',
            }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
      {tabLoader ? (
        <View style={{height: 115}}></View>
      ) : (
        <OptionSelector
          navigation={navigation}
          defaultIndex={defaultIndex}
          data={showPost}
          onSelect={(item, index) => {
            console.log('Selected:', item, index);
            if (index == 1) {
              setActiveTab('convention');
              setdefaultIndex(1);
            } else {
              setActiveTab('farmhouse');
              setdefaultIndex(2);
            }
          }}
        />
      )}
      {/* Tabs */}
      {/* <View style={styles.tabContainer}>
        <TabButton
          title="Convention Hall"
          isActive={activeTab === 'convention'}
          onPress={() => setActiveTab('convention')}
        />
        <TabButton
          title="Farm House"
          isActive={activeTab === 'farmhouse'}
          onPress={() => setActiveTab('farmhouse')}
        />
      </View> */}

      {/* Render Components */}
      {activeTab === 'convention' ? (
        <ConventionHall
          navigation={navigation}
          onPressSort={() => {
            setSortVisible(true);
          }}
          onPressFilter={() =>
            navigation.navigate('ConventionMainFilter', {
              onApplyFilter: handleFilterChange,
            })
          }
        />
      ) : (
        <FarmHouse
          navigation={navigation}
          onPressSort={() => setSortVisible(true)}
          onPressFilter={() => {
            navigation.navigate('ConventionFilter', {
              onApplyFilter: handleFilterChange,
            });
          }}
        />
      )}
      <AnimatedButton
        title="Upload a Hall/Farm"
        onPress={() => navigation.navigate('CreateConvention')}
        iconUrl={'https://cdn-icons-png.flaticon.com/128/3211/3211467.png'}
      />
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onSelectSort={sortType => {
          console.log('Selected Sort:', sortType);
        }}
      />
    </View>
  );
};

export default Convention;

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,

    borderColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLOR.primary || '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: COLOR.primary || '#007AFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  cardInfo: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  bookBtn: {
    marginTop: 8,
    backgroundColor: COLOR.primary || '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  bookBtn: {
    backgroundColor: COLOR.primary || '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLOR.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.lightGrey,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 45,
    height: 30,
    marginRight: 8,
  },
  locationCity: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.black,
  },
  locationAddress: {
    fontSize: 12,
    color: COLOR.grey,
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // margin: 12,
    marginVertical: 10,
    backgroundColor: COLOR.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 8,
    // marginHorizontal: 20,
  },
  searchIcon: {width: 20, height: 20, tintColor: COLOR.grey, marginRight: 8},
  searchInput: {
    // flex: 0.7,
    paddingVertical: 8,
    fontSize: 14,
    color: COLOR.black,
    width: windowWidth / 2,
  },
  filterIcon: {width: 22, height: 22, tintColor: COLOR.primary, marginLeft: 8},
});
