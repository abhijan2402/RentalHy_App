import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const FarmHouseFilter = ({navigation, route}) => {
  const onApplyFilter = route?.params?.onApplyFilter;

  // price range
  const [priceRange, setPriceRange] = useState(['5000', '500000+']);

  // all yes/no options
  const [swimmingPool, setSwimmingPool] = useState('');
  const [foodAvailable, setFoodAvailable] = useState('');
  const [outsideFood, setOutsideFood] = useState('');
  const [cctv, setCctv] = useState('');
  const [soundSystemAvailable, setSoundSystemAvailable] = useState('');
  const [soundSystemAllowed, setSoundSystemAllowed] = useState('');
  const [childrenGames, setChildrenGames] = useState('');
  const [adultGames, setAdultGames] = useState('');
  const [kitchenSetup, setKitchenSetup] = useState('');
  const [parking, setParking] = useState('');

  const yesNoOptions = ['Yes', 'No'];

  // render yes/no toggle row
  const renderOptions = (label, selected, setSelected) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionRow}>
        {yesNoOptions.map(option => (
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
    setSwimmingPool('');
    setFoodAvailable('');
    setOutsideFood('');
    setCctv('');
    setSoundSystemAvailable('');
    setSoundSystemAllowed('');
    setChildrenGames('');
    setAdultGames('');
    setKitchenSetup('');
    setParking('');
    setPriceRange([5000, 200000]);
  };

  const handleApply = () => {
    const filters = {
      swimmingPool,
      foodAvailable,
      outsideFood,
      cctv,
      soundSystemAvailable,
      soundSystemAllowed,
      childrenGames,
      adultGames,
      kitchenSetup,
      parking,
      priceRange,
    };

    console.log('FarmHouse Filters:', filters);
    if (onApplyFilter) {
      onApplyFilter(filters);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Farm House Filters'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
        {renderOptions('Swimming Pool', swimmingPool, setSwimmingPool)}
        {renderOptions('Food Available', foodAvailable, setFoodAvailable)}
        {renderOptions('Outside Food Allowed', outsideFood, setOutsideFood)}
        {renderOptions('CCTV Available', cctv, setCctv)}
        {renderOptions(
          'Sound System Available',
          soundSystemAvailable,
          setSoundSystemAvailable,
        )}
        {renderOptions(
          'Sound System Allowed',
          soundSystemAllowed,
          setSoundSystemAllowed,
        )}
        {renderOptions('Children Games', childrenGames, setChildrenGames)}
        {renderOptions('Adult Games', adultGames, setAdultGames)}
        {renderOptions(
          'Kitchen Setup with All Materials',
          kitchenSetup,
          setKitchenSetup,
        )}
        {renderOptions('Parking Available', parking, setParking)}

        {/* Price Range */}
        <Text style={styles.label}>Price Range (₹)</Text>
        <View style={{paddingHorizontal: 10}}>
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

export default FarmHouseFilter;

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
  buttonRow: {
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
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
});
