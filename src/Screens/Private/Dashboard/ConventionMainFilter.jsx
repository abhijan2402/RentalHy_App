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
import {formatIndianCurrency} from './Filter';

const ConventionMainFilter = ({navigation, route}) => {
  const onApplyFilter = route?.params?.onApplyFilter;
  const existingFilters = route?.params?.existingFilters || {};
  const {modalFilters} = route?.params || {};

  const [priceRange, setPriceRange] = useState(
    existingFilters.priceRange || (modalFilters?.min_price && [modalFilters.min_price, modalFilters.max_price]) || ['1000', '1000000'],
  );
  const [seatingCapacity, setSeatingCapacity] = useState(
    existingFilters.seatingCapacity || (modalFilters?.seating_capacity_min && [modalFilters.seating_capacity_min, modalFilters.seating_capacity_max]) || ['10', '5000'],
  );
  const [minPrice, setMinPrice] = useState(existingFilters.minPrice || modalFilters?.min_price || 1000);
  const [maxPrice, setMaxPrice] = useState(existingFilters.maxPrice || modalFilters?.max_price || 1000000);
  const [minCapacity, setMinCapacity] = useState(
    existingFilters.minCapacity || modalFilters?.seating_capacity_min || 10,
  );
  const [maxCapacity, setMaxCapacity] = useState(
    existingFilters.maxCapacity || modalFilters?.seating_capacity_max || 5000,
  );

  const [carParking, setCarParking] = useState(
  existingFilters.carParking || modalFilters.car_parking || '',
);
const [bikeParking, setBikeParking] = useState(
  existingFilters.bikeParking || modalFilters.bike_parking || '',
);
const [busParking, setBusParking] = useState(
  existingFilters.busParking || modalFilters.bus_parking || '',
);

const [valetParking, setValetParking] = useState(
  existingFilters.valetParking || modalFilters.valet_parking || '',
);
const [royaltyDecoration, setRoyaltyDecoration] = useState(
  existingFilters.royaltyDecoration || modalFilters.royalty_decoration || '',
);
const [decorationContact, setDecorationContact] = useState(
  existingFilters.decorationContact || modalFilters.decoration_contact || '',
);
const [royaltyKitchen, setRoyaltyKitchen] = useState(
  existingFilters.royaltyKitchen || modalFilters.royalty_kitchen || '',
);
const [generator, setGenerator] = useState(
  existingFilters.generator || modalFilters.generator_available || '',
);
const [normalWater, setNormalWater] = useState(
  existingFilters.normalWater || modalFilters.normal_water || '',
);
const [drinkingWater, setDrinkingWater] = useState(
  existingFilters.drinkingWater || modalFilters.drinking_water || '',
);
const [cateringPersons, setCateringPersons] = useState(
  existingFilters.cateringPersons || modalFilters.catering_persons || '',
);

const [acAvailable, setAcAvailable] = useState(
  existingFilters.acAvailable || modalFilters.ac_available || false,
);
const [roomsAvailable, setRoomsAvailable] = useState(
  existingFilters.roomsAvailable || modalFilters.rooms_available || false,
);
const [alcoholAllowed, setAlcoholAllowed] = useState(
  existingFilters.alcoholAllowed || modalFilters.alcohol_allowed || false,
);
const [photoShootsAllowed, setPhotoShootsAllowed] = useState(
  existingFilters.photoShootsAllowed || modalFilters.photoshoot_all || false,
);
const [childrenGames, setChildrenGames] = useState(
  existingFilters.childrenGames || modalFilters.adult_games || false,
);

const [timeOfOccasion, setTimeOfOccasion] = useState(
  existingFilters.timeOfOccasion || modalFilters.time_of_occasion || '',
);

  const yesNoOptions = ['Yes', 'No'];
  const timeOfOccasionOptions = ['Daytime', 'Night time', 'Full day'];

  const handleValuesChange = values => {
    setPriceRange(values);
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const handleValuesChangeSeating = values => {
    setSeatingCapacity(values);
    setMinCapacity(values[0]);
    setMaxCapacity(values[1]);
  };

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
    setPriceRange([1000, 1000000]);
    setSeatingCapacity([10, 5000]);
    setMinPrice(1000);
    setMaxPrice(1000000);
    setMinCapacity(10);
    setMaxCapacity(5000);
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
    setAcAvailable(false);
    setRoomsAvailable(false);
    setAlcoholAllowed(false);
    setPhotoShootsAllowed(false);
    setChildrenGames(false);
    setTimeOfOccasion('');
    onApplyFilter({});
    navigation.goBack();
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
      minPrice,
      maxPrice,
      minCapacity,
      maxCapacity,
      seatingCapacity,
      alcoholAllowed,
      photoShootsAllowed,
      childrenGames,
      timeOfOccasion,
      acAvailable,
      roomsAvailable,
    };

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
        <Text style={styles.label}>Seating Capacity</Text>
        <View style={{marginHorizontal: 15}}>
          <MultiSlider
            values={seatingCapacity}
            onValuesChange={handleValuesChangeSeating}
            min={10}
            max={5000}
            step={10}
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
            trackStyle={{height: 4}}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>{minCapacity}+</Text>
            <Text style={styles.priceLabel}>{maxCapacity}+</Text>
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
            onValuesChange={handleValuesChange}
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
            <Text style={styles.priceLabel}>
              ₹{formatIndianCurrency(minPrice)}
            </Text>
            <Text style={styles.priceLabel}>
              {/* ₹{formatIndianCurrency(maxPrice)} */}
              {maxPrice == '1000000'
                ? `${formatIndianCurrency(maxPrice)}+`
                : formatIndianCurrency(maxPrice)}
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
