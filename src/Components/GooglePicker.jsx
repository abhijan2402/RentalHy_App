import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {COLOR} from '../Constants/Colors';

const {height} = Dimensions.get('window');

const GOOGLE_API_KEY = 'AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk'; // Replace with your key

const GooglePlacePicker = ({
  placeholder = 'Search place...',
  onPlaceSelected,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Default region is Hyderabad
  const [region, setRegion] = useState({
    latitude: 17.385044,
    longitude: 78.486671,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef(null);

  /** ✅ Request location permission (for Android) */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  /** ✅ Get current location and move map + marker */
  const getCurrentLocation = () => {
    // First try with GPS
    Geolocation.getCurrentPosition(
      position => {
        console.log('High accuracy position:', position);
        const {latitude, longitude} = position.coords;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000,
          );
        }

        if (onPlaceSelected) {
          onPlaceSelected({
            name: 'Current Location',
            lat: latitude,
            lng: longitude,
            address: null,
          });
        }
      },
      error => {
        console.warn('High accuracy error:', error);

        // ✅ Fallback to coarse location if timeout or GPS unavailable
        if (error.code === 3 || error.code === 2) {
          console.log('Retrying with coarse location...');
          Geolocation.getCurrentPosition(
            pos => {
              console.log('Coarse location fallback:', pos);
              const {latitude, longitude} = pos.coords;

              setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            },
            err => console.error('Coarse location failed:', err),
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
          );
        } else if (error.code === 1) {
          alert('Location permission denied. Please enable it in settings.');
        }
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );
  };

  /** Run on mount to ask permission and get location */
  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (granted) getCurrentLocation();
    });
  }, []);

  /** ✅ Fetch suggestions from Google Places API */
  const fetchSuggestions = async text => {
    setQuery(text);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text,
        )}&key=${GOOGLE_API_KEY}&language=en`,
      );
      const json = await response.json();
      setSuggestions(json.predictions || []);
    } catch (error) {
      console.error('Google Autocomplete Error:', error);
    }
    setLoading(false);
  };

  /** ✅ When user selects a suggestion */
  const handleSelect = async item => {
    setQuery(item.description);
    setSuggestions([]);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}&language=en`,
      );
      const json = await response.json();
      const details = json.result;
      const lat = details.geometry?.location?.lat;
      const lng = details.geometry?.location?.lng;

      const newRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

      if (onPlaceSelected) {
        onPlaceSelected({
          name: item.description,
          lat,
          lng,
          address: details.formatted_address,
        });
      }
    } catch (error) {
      console.error('Google Place Details Error:', error);
    }
  };

  /** ✅ When marker is dragged */
  const handleDragEnd = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;

    const newRegion = {
      ...region,
      latitude,
      longitude,
    };
    setRegion(newRegion);

    if (onPlaceSelected) {
      onPlaceSelected({
        name: query || 'Dropped Pin',
        lat: latitude,
        lng: longitude,
        address: null,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        value={query}
        onChangeText={fetchSuggestions}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={COLOR.grey}
      />

      {loading && <ActivityIndicator style={{marginTop: 8}} />}

      {/* Suggestions List */}
      <FlatList
        scrollEnabled
        data={suggestions}
        keyExtractor={item => item.place_id}
        keyboardShouldPersistTaps="handled"
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelect(item)}>
            <Text style={styles.suggestionText}>{item.description}</Text>
          </TouchableOpacity>
        )}
        style={styles.suggestionList}
      />

      {/* Map View */}
      {region && (
        <View>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            // showsUserLocation={true}
          >
            {/* ✅ Draggable Marker */}
            <Marker coordinate={region} draggable onDragEnd={handleDragEnd} />
          </MapView>

          {/* Current Location Button */}
          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.currentLocationButton}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
              }}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GooglePlacePicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  input: {
    borderWidth: 0.5,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#444',
  },
  map: {
    width: '100%',
    height: height * 0.35,
    marginTop: 10,
    borderRadius: 10,
  },
  suggestionList: {
    maxHeight: 200,
    marginTop: 4,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
