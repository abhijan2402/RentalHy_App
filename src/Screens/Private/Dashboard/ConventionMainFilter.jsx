import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const ConventionMainFilter = ({navigation, route}) => {
  const onApplyFilter = route?.params?.onApplyFilter;

  // Price & Seating sliders
  const [priceRange, setPriceRange] = useState(['1000', '10,00,000+']);
  const [seatingCapacity, setSeatingCapacity] = useState([1000, 1000000]);

  // Parking counts
  const [carParking, setCarParking] = useState('');
  const [bikeParking, setBikeParking] = useState('');
  const [busParking, setBusParking] = useState('');

  // Yes/No states
  const [valetParking, setValetParking] = useState('');
  const [royaltyDecoration, setRoyaltyDecoration] = useState('');
  const [decorationContact, setDecorationContact] = useState('');
  const [royaltyKitchen, setRoyaltyKitchen] = useState('');
  const [generator, setGenerator] = useState('');
  const [normalWater, setNormalWater] = useState('');
  const [drinkingWater, setDrinkingWater] = useState('');
  const [cateringPersons, setCateringPersons] = useState('');
  const [acAvailable, setAcAvailable] = useState(false);
  const [roomsAvailable, setRoomsAvailable] = useState(false);
  const [alcoholAllowed, setAlcoholAllowed] = useState(false);
  const [photoShootsAllowed, setPhotoShootsAllowed] = useState(false);
  const [childrenGames, setChildrenGames] = useState(false);
  const [timeOfOccasion, setTimeOfOccasion] = useState('');

  const yesNoOptions = ['Yes', 'No'];
  const timeOfOccasionOptions = ['Daytime', 'Night time', '24 Hours'];

  const renderOptions = (label, selected, setSelected, data = []) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionRow}>
        {data?.length == 0
          ? yesNoOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selected === option && styles.optionSelected,
                ]}
                onPress={() => setSelected(option)}>
                <Text
                  style={[
                    styles.optionText,
                    selected === option && styles.optionTextSelected,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))
          : data.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selected === option && styles.optionSelected,
                ]}
                onPress={() => setSelected(option)}>
                <Text
                  style={[
                    styles.optionText,
                    selected === option && styles.optionTextSelected,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
      </View>
    </>
  );

  const handleReset = () => {
    setPriceRange([5000, 200000]);
    setSeatingCapacity([50, 2000]);
    setCarParking('');
    setBikeParking('');
    setBusParking('');
    setValetParking('');
    setRoyaltyDecoration('');
    setDecorationContact('');
    setRoyaltyKitchen('');
    setGenerator('');
    setNormalWater('');
    setDrinkingWater('');
    setCateringPersons('');
  };

  const handleApply = () => {
    const filters = {
      priceRange,
      seatingCapacity,
      carParking,
      bikeParking,
      busParking,
      valetParking,
      royaltyDecoration,
      decorationContact,
      royaltyKitchen,
      generator,
      normalWater,
      drinkingWater,
      cateringPersons,
    };
    console.log('Convention Filters:', filters);

    if (onApplyFilter) {
      onApplyFilter(filters);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Convention Filters'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
        {/* Seating Capacity */}
        <Text style={styles.label}>Seating Capacity (1000 - 1000000+)</Text>
        <View style={{marginHorizontal: 15}}>
          <MultiSlider
            values={seatingCapacity}
            onValuesChange={setSeatingCapacity}
            min={1000}
            max={1000000}
            step={1000}
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
            trackStyle={{height: 4}}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>{seatingCapacity[0]}+</Text>
            <Text style={styles.priceLabel}>{seatingCapacity[1]}+</Text>
          </View>
        </View>

        {/* Parking */}
        {/* <Text style={styles.label}>Parking Available</Text>
        <View style={styles.parkingRow}>
          <TextInput
            placeholder="Cars"
            keyboardType="numeric"
            value={carParking}
            onChangeText={setCarParking}
            style={styles.input}
          />
          <TextInput
            placeholder="Bikes"
            keyboardType="numeric"
            value={bikeParking}
            onChangeText={setBikeParking}
            style={styles.input}
          />
          <TextInput
            placeholder="Buses"
            keyboardType="numeric"
            value={busParking}
            onChangeText={setBusParking}
            style={styles.input}
          />
        </View> */}

        {renderOptions(
          'Valet Parking Available',
          valetParking,
          setValetParking,
        )}
        {renderOptions('A/C Available', acAvailable, setAcAvailable)}

        {renderOptions('Rooms Available', roomsAvailable, setRoomsAvailable)}
        {renderOptions(
          'Royalty for Decoration',
          royaltyDecoration,
          setRoyaltyDecoration,
        )}

        {/* Show input if Royalty Decoration = No */}
        {royaltyDecoration === 'No' && (
          <TextInput
            placeholder="Decoration Person Contact"
            value={decorationContact}
            onChangeText={setDecorationContact}
            style={[styles.input, {marginTop: 8}]}
          />
        )}

        {renderOptions(
          'Royalty for Kitchen',
          royaltyKitchen,
          setRoyaltyKitchen,
        )}
        {renderOptions('Generator Available', generator, setGenerator)}
        {renderOptions('Normal Water for Cooking', normalWater, setNormalWater)}
        {renderOptions(
          'Drinking Water Available',
          drinkingWater,
          setDrinkingWater,
        )}
        {renderOptions(
          'Provides Catering Persons',
          cateringPersons,
          setCateringPersons,
        )}
        {renderOptions('Alcohol Allowed', alcoholAllowed, setAlcoholAllowed)}

        {renderOptions(
          'Photo Shoots Allowed',
          photoShootsAllowed,
          setPhotoShootsAllowed,
        )}

        {renderOptions('Children Games', childrenGames, setChildrenGames)}
        {renderOptions(
          'Time of Occasion',
          timeOfOccasion,
          setTimeOfOccasion,
          timeOfOccasionOptions,
        )}
        {/* Price Range */}
        <Text style={styles.label}>Price Range (₹)</Text>
        <View style={{marginHorizontal: 15}}>
          <MultiSlider
            values={priceRange}
            onValuesChange={setPriceRange}
            min={5000}
            max={500000}
            step={5000}
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
            trackStyle={{height: 4}}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>
              ₹{priceRange[0].toLocaleString()}
            </Text>
            <Text style={styles.priceLabel}>
              ₹{priceRange[1].toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton title="Apply" onPress={handleApply} />
          <CustomButton
            title="Reset"
            onPress={handleReset}
            style={{backgroundColor: COLOR.grey}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ConventionMainFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
    marginBottom: 8,
    marginTop: 12,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLOR.white,
  },
  optionSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  optionText: {
    color: COLOR.black,
  },
  optionTextSelected: {
    color: COLOR.white,
  },
  parkingRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: COLOR.white,
  },
  priceLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  buttonRow: {
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
});
