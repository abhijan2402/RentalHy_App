import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import ImagePicker from 'react-native-image-crop-picker';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const PostProperty = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [images, setImages] = useState([]);

  const pickImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      cropping: false,
    }).then(selectedImages => {
      const newImages = selectedImages.map(img => ({
        uri: img.path,
        mime: img.mime,
      }));
      setImages(prev => [...prev, ...newImages]);
    });
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePostProperty = () => {
    if (!title || !description || !price || !location) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    // API Call can go here
    Alert.alert('Success', 'Your property has been posted successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Post Property'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.label}>Property Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter property title"
          placeholderTextColor={COLOR.grey}
        />

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter property description"
          placeholderTextColor={COLOR.grey}
          multiline
        />

        {/* Price */}
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor={COLOR.grey}
          keyboardType="numeric"
        />

        {/* Location */}
        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          placeholderTextColor={COLOR.grey}
        />

        {/* Bedrooms */}
        <Text style={styles.label}>Bedrooms</Text>
        <TextInput
          style={styles.input}
          value={bedrooms}
          onChangeText={setBedrooms}
          placeholder="Number of bedrooms"
          placeholderTextColor={COLOR.grey}
          keyboardType="numeric"
        />

        {/* Bathrooms */}
        <Text style={styles.label}>Bathrooms</Text>
        <TextInput
          style={styles.input}
          value={bathrooms}
          onChangeText={setBathrooms}
          placeholder="Number of bathrooms"
          placeholderTextColor={COLOR.grey}
          keyboardType="numeric"
        />

        {/* Area */}
        <Text style={styles.label}>Area (sq ft)</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Enter area size"
          placeholderTextColor={COLOR.grey}
          keyboardType="numeric"
        />

        {/* Upload Images */}
        <Text style={styles.label}>Property Images</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
          <Text style={styles.uploadText}>+ Add Images</Text>
        </TouchableOpacity>

        {/* Images Preview */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{uri: img.uri}} style={styles.image} />
              <TouchableOpacity
                style={styles.crossContainer}
                onPress={() => removeImage(index)}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png',
                  }}
                  style={styles.crossIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Post Button */}
        <CustomButton title={'Post Property'} style={{marginTop: 20}} />
      </ScrollView>
    </View>
  );
};

export default PostProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.black,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLOR.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: COLOR.primary,
    fontWeight: '600',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  crossContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLOR.white,
    borderRadius: 12,
    padding: 5,
    elevation: 2,
  },
  crossIcon: {
    width: 10,
    height: 10,
    tintColor: COLOR.black,
  },
  postBtn: {
    backgroundColor: COLOR.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  postBtnText: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
