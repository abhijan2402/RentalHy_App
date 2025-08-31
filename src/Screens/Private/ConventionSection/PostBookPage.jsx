import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const PostBookPage = ({navigation}) => {
  const [eventManager, setEventManager] = useState('');
  const [catering, setCatering] = useState('');
  const [chef, setChef] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [decorations, setDecorations] = useState('');
  const [lighting, setLighting] = useState('');
  const [dj, setDj] = useState('');
  const [band, setBand] = useState('');
  const [archestors, setArchestors] = useState('');
  const [sannayi, setSannayi] = useState('');
  const [buses, setBuses] = useState('');
  const [cars, setCars] = useState('');
  const [pandit, setPandit] = useState('');
  const [groceries, setGroceries] = useState('');
  const [nonVeg, setNonVeg] = useState('');
  const [nonVegQty, setNonVegQty] = useState('');
  const [vegetables, setVegetables] = useState('');
  const [vegetablesDesc, setVegetablesDesc] = useState('');
  const [comments, setComments] = useState('');

  const renderToggle = (
    label,
    value,
    setValue,
    withInput = false,
    inputVal = '',
    setInputVal,
    placeholder = '',
  ) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.toggleRow}>
        {['yes', 'no'].map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.toggleBtn, value === opt && styles.selectedBtn]}
            onPress={() => setValue(opt)}>
            <Text
              style={[styles.toggleText, value === opt && styles.selectedText]}>
              {opt.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {withInput && value === 'yes' && (
        <TextInput
          style={styles.input}
          value={inputVal}
          onChangeText={setInputVal}
          placeholder={placeholder}
          multiline
        />
      )}
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title={'Book Now'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          contentContainerStyle={{padding: 16, paddingBottom: 60}}
          keyboardShouldPersistTaps="handled">
          {renderToggle('Event managers needed', eventManager, setEventManager)}
          {renderToggle('Catering needed', catering, setCatering)}
          {renderToggle('Chef needed', chef, setChef)}
          {renderToggle('Photographer needed', photographer, setPhotographer)}
          {renderToggle('Decorations needed', decorations, setDecorations)}
          {renderToggle('Lighting needed', lighting, setLighting)}
          {renderToggle('DJ needed', dj, setDj)}
          {renderToggle('Band needed', band, setBand)}
          {renderToggle('Archestors needed', archestors, setArchestors)}
          {renderToggle('Sannayi melam needed', sannayi, setSannayi)}
          {renderToggle('Buses needed', buses, setBuses)}
          {renderToggle('Cars needed', cars, setCars)}
          {renderToggle('Pandit needed', pandit, setPandit)}
          {renderToggle('Groceries needed', groceries, setGroceries)}

          {renderToggle(
            'Non veg needed (Goats, chicken etc)',
            nonVeg,
            setNonVeg,
            true,
            nonVegQty,
            setNonVegQty,
            'Enter details & quantity (e.g., 5kg chicken, 2 goats)',
          )}

          {renderToggle(
            'Vegetables needed',
            vegetables,
            setVegetables,
            true,
            vegetablesDesc,
            setVegetablesDesc,
            'Mention if any along with kgs',
          )}

          <View style={styles.section}>
            <Text style={styles.label}>Comments (optional)</Text>
            <TextInput
              style={[styles.input, {minHeight: 80}]}
              value={comments}
              onChangeText={setComments}
              placeholder="Enter any comments..."
              multiline
            />
          </View>
        </ScrollView>
        <CustomButton title={'Pay now'} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostBookPage;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
  },
  selectedBtn: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  toggleText: {
    fontSize: 14,
    color: '#555',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    textAlignVertical: 'top',
  },
});
