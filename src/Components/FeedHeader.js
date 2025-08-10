import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LanguageSelector from './LanguageSelector';
import {LanguageContext} from '../localization/LanguageContext';

const Header = ({title, onBackPress, showBack = false}) => {
  const langShow = ['Vendor Dashboard', 'विक्रेता डैशबोर्ड'];

  return (
    <SafeAreaView style={styles.safeHeader}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Image
              style={{width: 20, height: 20}}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/130/130882.png',
              }}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {langShow.includes(title) && (
          <View style={styles.languageWrapper}>
            <LanguageSelector />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeHeader: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
    paddingVertical: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  languageWrapper: {
    width: 120,
    alignItems: 'flex-end',
  },
});
