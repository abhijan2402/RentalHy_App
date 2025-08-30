// GooglePlacePicker.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const GOOGLE_API_KEY = "AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk"; 

const GooglePlacePicker = ({ placeholder = "Search place...", onPlaceSelected }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch autocomplete predictions
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

  // Fetch place details after selection
  const handleSelect = async (item) => {
    setQuery(item.description);
    setSuggestions([]);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}&language=en`
      );
      const json = await response.json();
      const details = json.result;

      if (onPlaceSelected) {
        onPlaceSelected({
          name: item.description,
          lat: details.geometry?.location?.lat,
          lng: details.geometry?.location?.lng,
          address: details.formatted_address,
        });
      }
    } catch (error) {
      console.error("Google Place Details Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Input */}
      <TextInput
        value={query}
        onChangeText={fetchSuggestions}
        placeholder={placeholder}
        style={styles.input}
      />

      {/* Loader */}
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}

      {/* Suggestion List */}
      <FlatList
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
        ListEmptyComponent={
          query.length > 1 && !loading ? (
            <Text style={styles.emptyText}>No results found</Text>
          ) : null
        }
      />
    </View>
  );
};

export default GooglePlacePicker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#f2f2f2",
    color: "#333",
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
});
