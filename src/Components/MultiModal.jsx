import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import {COLOR} from '../Constants/Colors';

const MultiModal = ({
  visible,
  onClose,
  onSelectSort,
  filterValueData,
  initialSelected = {},
}) => {
  const [selectedFilters, setSelectedFilters] = useState(initialSelected);

  useEffect(() => {
    if (visible) {
      setSelectedFilters(initialSelected);
    }
  }, [visible]);

  const toggleFilter = (filter, filterType) => {
    const currentFilters = selectedFilters[filterType] || [];

    let updatedFilters;
    if (currentFilters.includes(filter)) {
      // remove if exists
      updatedFilters = currentFilters.filter(f => f !== filter);
    } else {
      // add new
      updatedFilters = [filter]; // ...currentFilters
    }

    setSelectedFilters({
      ...selectedFilters,
      [filterType]: updatedFilters,
    });
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

          {/* Options */}
          <View style={styles.optionRow}>
            {filterValueData?.data?.map(option => {
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
                    toggleFilter(option, filterValueData?.type)
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

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: COLOR.lightGrey}]}
              onPress={onClose}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: COLOR.black}}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: COLOR.primary}]}
              onPress={() => {
                onSelectSort(selectedFilters); // ✅ key-value pair object
                onClose();
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: COLOR.white}}>
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
