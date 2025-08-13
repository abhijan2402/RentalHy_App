import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {COLOR} from '../Constants/Colors';

const MultiModal = ({
  visible,
  onClose,
  onSelectSort,
  filterValueData,
  initialSelected = [],
}) => {
  const [selectedFilters, setSelectedFilters] = useState(initialSelected);

  const toggleFilter = filter => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Filters</Text>

          {/* Horizontal scroll filter options */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 20,
            }}>
            {filterValueData?.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  {
                    borderWidth: 1,
                    borderColor: COLOR.grey,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: COLOR.white,
                    marginRight: 10,
                    marginBottom: 10, // space between rows
                  },
                  selectedFilters.includes(option) && {
                    backgroundColor: COLOR.primary,
                    borderColor: COLOR.primary,
                  },
                ]}
                onPress={() => toggleFilter(option)}>
                <Text
                  style={[
                    {color: COLOR.black},
                    selectedFilters.includes(option) && {color: COLOR.white},
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Two buttons side-by-side */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: COLOR.lightGrey}]}
              onPress={onClose}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', color: COLOR.black}}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: COLOR.primary}]}
              onPress={() => {
                onSelectSort(selectedFilters); // pass array
                onClose();
              }}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', color: COLOR.white}}>
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
