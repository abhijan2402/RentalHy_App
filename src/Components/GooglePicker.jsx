import React, { useState, useEffect, useRef } from 'react';
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
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { COLOR } from '../Constants/Colors';

const { height } = Dimensions.get('window');
const GOOGLE_API_KEY = 'AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk';

const GooglePlacePicker = ({ placeholder = 'Search place...', onPlaceSelected }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState({
    latitude: 17.385044,
    longitude: 78.486671,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef(null);

  // 🔹 Reverse geocode lat/lng to formatted address
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const json = await res.json();
      return json.results?.[0]?.formatted_address || '';
    } catch (err) {
      console.error('Reverse geocode error:', err);
      return '';
    }
  };

  const handleMapPress = async e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion(r => ({ ...r, latitude, longitude }));

    const address = await reverseGeocode(latitude, longitude);
    onPlaceSelected?.({
      name: address || 'Dropped Pin',
      lat: latitude,
      lng: longitude,
      address,
    });
  };

  const handleDragEnd = async e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion(r => ({ ...r, latitude, longitude }));

    const address = await reverseGeocode(latitude, longitude);
    onPlaceSelected?.({
      name: address || 'Dropped Pin',
      lat: latitude,
      lng: longitude,
      address,
    });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);

        mapRef.current?.animateToRegion(newRegion, 1000);

        onPlaceSelected?.({
          name: 'Current Location',
          lat: latitude,
          lng: longitude,
          address,
        });
      },
      error => console.warn('Location error:', error),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (granted) getCurrentLocation();
    });
  }, []);

  const fetchSuggestions = async text => {
    setQuery(text);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${GOOGLE_API_KEY}&language=en&components=country:IN`
      );
      const json = await res.json();
      setSuggestions(json.predictions || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
    setLoading(false);
  };

  const handleSelect = async item => {
    setQuery(item.description);
    setSuggestions([]);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}&language=en`
      );
      const json = await res.json();
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
      mapRef.current?.animateToRegion(newRegion, 1000);

      onPlaceSelected?.({
        name: item.description,
        lat,
        lng,
        address: details.formatted_address,
      });
    } catch (err) {
      console.error('Place details error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={fetchSuggestions}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={COLOR.grey}
      />

      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}

      <FlatList
        data={suggestions}
        keyExtractor={item => item.place_id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelect(item)}>
            <Text style={styles.suggestionText}>{item.description}</Text>
          </TouchableOpacity>
        )}
        style={styles.suggestionList}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={handleMapPress}>
        <Marker coordinate={region} draggable onDragEnd={handleDragEnd} />
      </MapView>

      <TouchableOpacity onPress={getCurrentLocation} style={styles.currentLocationButton}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }}
          style={{ width: 25, height: 25 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GooglePlacePicker;

const styles = StyleSheet.create({
  container: { width: '100%', position: 'relative' },
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
  suggestionText: { fontSize: 14, color: '#444' },
  suggestionList: { maxHeight: 100, marginTop: 4 },
  map: {
    width: '100%',
    height: height * 0.2,
    marginTop: 10,
    borderRadius: 10,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
