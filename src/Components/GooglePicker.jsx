import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLOR } from "../Constants/Colors";

const { height } = Dimensions.get("window");

const GOOGLE_API_KEY = "AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk"; // Replace with your key

const GooglePlacePicker = ({ placeholder = "Search place...", onPlaceSelected }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(null);

  const fetchSuggestions = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${GOOGLE_API_KEY}&language=en`
      );
      const json = await response.json();
      setSuggestions(json.predictions || []);
    } catch (error) {
      console.error("Google Autocomplete Error:", error);
    }
    setLoading(false);
  };

  const handleSelect = async (item) => {
    setQuery(item.description);
    setSuggestions([]);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}&language=en`
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

      if (onPlaceSelected) {
        onPlaceSelected({
          name: item.description,
          lat,
          lng,
          address: details.formatted_address,
        });
      }
    } catch (error) {
      console.error("Google Place Details Error:", error);
    }
  };


  const handleDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion((prev) => ({ ...prev, latitude, longitude }));

    if (onPlaceSelected) {
      onPlaceSelected({
        name: query,
        lat: latitude,
        lng: longitude,
        address: null,
      });
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
        scrollEnabled={true}
        data={suggestions}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.suggestionText}>{item.description}</Text>
          </TouchableOpacity>
        )}
        // ListEmptyComponent={
        //   query.length > 1 && !loading ? (
        //     <Text style={styles.emptyText}>No results found</Text>
        //   ) : null
        // }
        style={styles.suggestionList}
      />


      {(region && query) && (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          <Marker
            coordinate={region}
            draggable
            onDragEnd={handleDragEnd}
          />
        </MapView>
      )}
    </View>
  );
};

export default GooglePlacePicker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 14,
    color: "#444",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
  },
  map: {
    width: "100%",
    height: height * 0.25, // Compact map height
    marginTop: 10,
    borderRadius: 10,
  },
  suggestionList: {
    maxHeight: 200,   // Limit height so it won’t cover map
    marginTop: 4,
  },
});
