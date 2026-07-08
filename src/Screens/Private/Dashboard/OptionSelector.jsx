import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';

const destinations = [
  { screen: 'Home' },
  { screen: 'Hostel' },
  { screen: 'Convention', params: { type: 'conv' } },
  { screen: 'Convention', params: { type: 'resort' } },
  { screen: 'Convention', params: { type: 'farm' } },
];

const OptionSelector = ({ data = [], onSelect, navigation, defaultIndex = 0 }) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  useEffect(() => {
    setSelectedIndex(defaultIndex);
  }, [defaultIndex]);

  const handlePress = (item, index) => {
    setSelectedIndex(index);
    onSelect?.(item, index);

    const destination = destinations[index];
    if (destination) {
      navigation.navigate(destination.screen, destination.params);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.list}>
        {data.map((item, index) => {
          const isSelected = selectedIndex === index;

          return (
            <TouchableOpacity
              key={`${item?.id}-${item?.title}-${index}`}
              activeOpacity={0.78}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Show ${item?.title}`}
              onPress={() => handlePress(item, index)}
              style={[styles.card, isSelected && styles.selectedCard]}>
              {isSelected && <View style={styles.activeIndicator} />}

              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}>
                <Image
                  source={{ uri: item?.image }}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={[styles.title, isSelected && styles.selectedTitle]}
                numberOfLines={2}>
                {item?.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default OptionSelector;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  card: {
    flex: 1,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fb',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#eceef2',
    paddingHorizontal: 2,
    paddingVertical: 5,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  selectedCard: {
    backgroundColor: '#fff',
    borderColor: COLOR.primary,
    shadowColor: COLOR.primary,
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 26,
    height: 3,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: COLOR.primary,
  },
  iconContainer: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 3,
  },
  selectedIconContainer: {
    backgroundColor: '#fff4ec',
  },
  icon: {
    width: 19,
    height: 19,
  },
  title: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '600',
    color: '#626975',
    textAlign: 'center',
  },
  selectedTitle: {
    color: COLOR.primary,
    fontWeight: '700',
  },
});
