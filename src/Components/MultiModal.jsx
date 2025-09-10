import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {COLOR} from '../Constants/Colors';

const MultiModal = ({
  visible,
  onClose,
  onSelectSort,
  filterValueData,
  initialSelected = {},
}) => {
  const [selectedFilters, setSelectedFilters] = useState(initialSelected);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  useEffect(() => {
    if (visible) {
      setSelectedFilters(initialSelected);

      if (
        filterValueData?.type === 'price' ||
        filterValueData?.type === 'seating_capacity'
      ) {
        const min = initialSelected?.min_price ?? 0;
        const max = initialSelected?.max_price ?? 100000;
        setPriceRange([min, max]);
      }
    }
  }, [visible, initialSelected, filterValueData]);

  const toggleFilter = (filter, filterType, isBoolean = false) => {
    const currentFilters = selectedFilters[filterType] || [];

    let updatedFilters;
    if (isBoolean) {
      // single select: overwrite with only one option
      updatedFilters = [filter];
    } else {
      // multi select: toggle
      if (currentFilters.includes(filter)) {
        updatedFilters = currentFilters.filter(f => f !== filter);
      } else {
        updatedFilters = [...currentFilters, filter];
      }
    }

    setSelectedFilters({
      ...selectedFilters,
      [filterType]: updatedFilters,
    });
  };

  const handleApply = () => {
    let updated = {...selectedFilters};
    if (
      filterValueData?.type === 'price' ||
      filterValueData?.type === 'seating_capacity'
    ) {
      updated.min_price = priceRange[0];
      updated.max_price = priceRange[1];
    }
    onSelectSort(updated);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            Select Filters : {filterValueData?.name}
          </Text>

          {(filterValueData?.type === 'price' ||
          filterValueData?.type === 'seating_capacity') ? (
            <View style={{marginBottom: 20}}>
              <Text style={{marginBottom: 10, fontSize: 16, fontWeight: '600'}}>
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </Text>
              <MultiSlider
                values={priceRange}
                onValuesChange={values => setPriceRange(values)}
                min={0}
                max={100000}
                step={1000}
                allowOverlap={false}
                snapped
                selectedStyle={{backgroundColor: COLOR.primary}}
                markerStyle={{
                  backgroundColor: COLOR.primary,
                  height: 20,
                  width: 20,
                }}
                trackStyle={{height: 4}}
              />
            </View>
          ) : (
            <View style={styles.optionRow}>
              {filterValueData?.data?.map(option => {
                const isBoolean = filterValueData?.state === 'boolean';
                const isSelected =
                  selectedFilters[filterValueData?.type]?.includes(option);

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() =>
                      toggleFilter(option, filterValueData?.type, isBoolean)
                    }>
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
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: COLOR.lightGrey}]}
              onPress={onClose}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: COLOR.black,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: COLOR.primary}]}
              onPress={handleApply}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: COLOR.white,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MultiModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLOR.black,
  },
  optionRow: {
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLOR.white,
    marginRight: 10,
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
