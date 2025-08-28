// GooglePlacePicker.js
import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacePicker = ({ placeholder = "Search place...", onPlaceSelected }) => {
  const ref = useRef();

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={placeholder}
        fetchDetails={true}
        enablePoweredByContainer={false}
        debounce={200}
        minLength={2}
        query={{
          key: 'AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk',
          language: 'en',
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: { display: "none" }, 
        }}
        
        renderRow={() => null}
        onPress={(data, details = null) => {
          if (details) {
            onPlaceSelected({
              name: data?.description,
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng,
              address: details.formatted_address,
            });
          }
        }}
      />

      {/* ✅ Suggestions rendered here */}
      <FlatList
        data={ref.current?.state?.dataSource || []}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => ref.current?.onPress(item, null)}
          >
            <Text style={styles.suggestionText}>{item.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={null}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default GooglePlacePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    color: '#333',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#444',
  },
});
