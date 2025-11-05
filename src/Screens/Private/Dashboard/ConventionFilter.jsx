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
import {formatIndianCurrency} from './Filter';

const FarmHouseFilter = ({navigation, route}) => {
  const existingFilters = route?.params?.existingFilters || {};
  const onApplyFilter = route?.params?.onApplyFilter;
  const activeTab = route?.params?.activeTab || 'farmhouse';
    const {modalFilters} = route?.params || {};

  const [priceRange, setPriceRange] = useState(
    existingFilters.priceRange || (modalFilters?.min_price && [modalFilters.min_price, modalFilters.max_price]) || ['1000', '1000000+'],
  );
const [swimmingPool, setSwimmingPool] = useState(
  existingFilters.swimmingPool || modalFilters.swimming_pool || ''
);

const [acAvailable, setAcAvailable] = useState(
  existingFilters.acAvailable || modalFilters.ac_available || false
);

const [visitType, setVisitType] = useState(
  existingFilters.visitType || modalFilters.visit_type || ''
);

const [poolOption, setPoolOption] = useState(
  existingFilters.poolOption || modalFilters.pool_type || ''
);

const [roomAvailable, setRoomAvailable] = useState(
  existingFilters.roomAvailable || modalFilters.room_available || false
);

const [foodAvailable, setFoodAvailable] = useState(
  existingFilters.foodAvailable || modalFilters.food_available || ''
);

const [outsideFood, setOutsideFood] = useState(
  existingFilters.outsideFood || modalFilters.outside_food || ''
);

const [cctv, setCctv] = useState(
  existingFilters.cctv || modalFilters.cctv || ''
);

const [soundSystemAvailable, setSoundSystemAvailable] = useState(
  existingFilters.soundSystemAvailable || modalFilters.Sound_system || false
);

const [soundSystemAllowed, setSoundSystemAllowed] = useState(
  existingFilters.soundSystemAllowed || modalFilters.sound_system_allowed || ''
);

const [childrenGames, setChildrenGames] = useState(
  existingFilters.childrenGames || modalFilters.children_games || false
);

const [adultGames, setAdultGames] = useState(
  existingFilters.adultGames || modalFilters.adult_games || false
);

const [kitchenSetup, setKitchenSetup] = useState(
  existingFilters.kitchenSetup || modalFilters.kitchen_setup || ''
);

const [parking, setParking] = useState(
  existingFilters.parking || modalFilters.Parking_available || false
);

  const [minPrice, setMinPrice] = useState(existingFilters.minPrice || modalFilters?.min_price || 1000);
  const [maxPrice, setMaxPrice] = useState(existingFilters.maxPrice || modalFilters?.max_price || 1000000);
  const yesNoOptions = ['Yes', 'No'];

  const visitTypeOptions = [
        'Day',
        'Night',
        'Full Day',
        'Corporate',
        'Banquet hall',
        'Occassion Booking',
        'Room Booking',
        'Any other',
      ];

  const pooltypeOption = ['Adult', 'Child', 'Both'];

const renderOptions = (label, selected, setSelected, multi = false , renderoption) => {
  let mapData = renderoption ? renderoption : yesNoOptions;
  return (
    <>
    <Text style={styles.label}>{label}</Text>
    <ScrollView horizontal bounces={false} style={styles.optionRow} showsHorizontalScrollIndicator={false}>
      {mapData.map(option => {
        const isSelected = multi
          ? selected.includes(option)
          : selected === option;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              isSelected && styles.optionSelected,
            ]}
            onPress={() => {
              if (multi) {
                setSelected(prev =>
                  prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option],
                );
              } else {
                setSelected(option);
              }
            }}>
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </>
  )
};


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
    setMinPrice(1000);
    setMaxPrice(1000000);
    setPriceRange([1000, 1000000]);
    setAcAvailable('')
    setRoomAvailable('')
    setVisitType('')
    setPoolOption('')
    navigation.goBack();
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
      minPrice,
      maxPrice,
      activeTab,
      acAvailable,
      roomAvailable,
      visitType,
      poolOption
    };

    console.log('FarmHouse Filters:', filters);
    if (onApplyFilter) {
      onApplyFilter(filters);
    }
    navigation.goBack();
  };

  const handleValuesChange = values => {
    setPriceRange(values);
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Farm House Filters'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
      {renderOptions('Visit Type' , visitType , setVisitType , true , visitTypeOptions)}

      {renderOptions('Pool Options' , poolOption , setPoolOption , true , pooltypeOption)}


        {renderOptions('Swimming Pool', swimmingPool, setSwimmingPool)}
        {renderOptions('AC Available', acAvailable, setAcAvailable)}
        {renderOptions('Room Available', roomAvailable, setRoomAvailable)}



        {renderOptions('Food Available', foodAvailable, setFoodAvailable)}
        {renderOptions('Outside Food Allowed', outsideFood, setOutsideFood)}
        {renderOptions('CCTV Available', cctv, setCctv)}
        {renderOptions(
          'Sound System Available',
          soundSystemAvailable,
          setSoundSystemAvailable,
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
              {/* ₹{minPrice.toLocaleString()} */}₹
              {formatIndianCurrency(minPrice)}
            </Text>

            <Text style={styles.priceLabel}>
              {/* ₹{maxPrice.toLocaleString()} */}₹
              {/* {formatIndianCurrency(maxPrice)} */}
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
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap'
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLOR.white,
    marginHorizontal:4
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
