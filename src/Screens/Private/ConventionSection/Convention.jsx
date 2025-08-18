import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {AnimatedButton} from '../Dashboard/Home';

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
const ConventionHall = ({navigation}) => {
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
          onPress={() => navigation.navigate('PropertyDetail')}
          onBook={() => navigation.navigate('Booking')}
        />
      ))}
    </ScrollView>
  );
};

// ---------------- Farm House Component ----------------
const FarmHouse = ({navigation}) => {
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
          onPress={() => navigation.navigate('PropertyDetail')}
        />
      ))}
    </ScrollView>
  );
};

// ---------------- Main Convention Screen ----------------
const Convention = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('convention'); // default tab

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header title={'Convention Space'} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
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
      </View>

      {/* Render Components */}
      {activeTab === 'convention' ? (
        <ConventionHall navigation={navigation} />
      ) : (
        <FarmHouse navigation={navigation} />
      )}
      <AnimatedButton
        title="Upload a Hall/Farm"
        onPress={() => navigation.navigate('CreateConvention')}
        iconUrl={'https://cdn-icons-png.flaticon.com/128/3211/3211467.png'}
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
});
