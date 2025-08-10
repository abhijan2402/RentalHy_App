import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {LanguageContext} from '../localization/LanguageContext';

const LanguageSelector = () => {
  const {language, changeLanguage} = useContext(LanguageContext);

  return (
    <View style={styles.wrapper}>
      <Picker
        selectedValue={language}
        onValueChange={value => changeLanguage(value)}
        style={styles.picker}
        dropdownIconColor="#000"
        mode="dropdown">
        <Picker.Item label="En" value="en" />
        <Picker.Item label="हिंदी" value="hi" />
      </Picker>
    </View>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 40,
    width: 90,
    justifyContent: 'center',
  },
  picker: {
    height: 60,
    width: 100,
    color: '#000',
  },
});
