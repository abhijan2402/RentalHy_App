import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
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
  { screen: 'Hotels' },
];

const OptionSelector = ({
  data = [],
  onSelect,
  navigation,
  defaultIndex = 0,
  compact = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const collapseAnimation = useRef(new Animated.Value(compact ? 1 : 0)).current;

  useEffect(() => {
    setSelectedIndex(defaultIndex);
  }, [defaultIndex]);

  useEffect(() => {
    Animated.timing(collapseAnimation, {
      toValue: compact ? 1 : 0,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [collapseAnimation, compact]);

  const handlePress = (item, index) => {
    if (item?.upcoming) {
      return;
    }

    setSelectedIndex(index);
    onSelect?.(item, index);

    const destination = destinations[index];
    if (destination) {
      navigation.navigate(destination.screen, destination.params);
    }
  };

  const renderOption = (item, index, isCompact = false) => {
    const isSelected = selectedIndex === index;

    return (
      <TouchableOpacity
        key={`${item?.id}-${item?.title}-${index}`}
        activeOpacity={item?.upcoming ? 1 : 0.78}
        accessibilityRole="button"
        accessibilityState={{
          selected: isSelected,
          disabled: !!item?.upcoming,
        }}
        accessibilityLabel={
          item?.upcoming ? 'Upcoming section' : `Show ${item?.title}`
        }
        disabled={!!item?.upcoming}
        onPress={() => handlePress(item, index)}
        style={[
          isCompact ? styles.compactCard : styles.card,
          isSelected &&
            (isCompact ? styles.selectedCompactCard : styles.selectedCard),
          item?.upcoming && styles.upcomingCard,
        ]}>
        {!isCompact && isSelected && <View style={styles.activeIndicator} />}

        {!isCompact && (
          <View
            style={[
              styles.iconContainer,
              isSelected && styles.selectedIconContainer,
            ]}>
            <Image
              source={
                typeof item?.image === 'string'
                  ? {uri: item.image}
                  : item?.image
              }
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        )}

        <Text
          style={[
            isCompact ? styles.compactTitle : styles.title,
            isSelected && styles.selectedTitle,
            item?.upcoming && styles.upcomingTitle,
          ]}
          numberOfLines={1}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const selectorHeight = collapseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [152, 46],
  });
  const expandedScale = collapseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.94],
  });

  return (
    <Animated.View
      style={[styles.animatedWrapper, {height: selectorHeight}]}>
      <Animated.View
        pointerEvents={compact ? 'none' : 'auto'}
        style={[
          styles.animatedLayer,
          {
            opacity: collapseAnimation.interpolate({
              inputRange: [0, 0.55, 1],
              outputRange: [1, 0, 0],
            }),
            transform: [{scale: expandedScale}],
          },
        ]}>
        <View style={styles.wrapper}>
          <View style={styles.list}>
            {data.map((item, index) => renderOption(item, index))}
          </View>
        </View>
      </Animated.View>

      <Animated.View
        pointerEvents={compact ? 'auto' : 'none'}
        style={[
          styles.animatedLayer,
          {
            opacity: collapseAnimation.interpolate({
              inputRange: [0, 0.45, 1],
              outputRange: [0, 0, 1],
            }),
          },
        ]}>
        <View style={[styles.wrapper, styles.compactWrapper]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.compactList}>
            {data.map((item, index) => renderOption(item, index, true))}
          </ScrollView>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default OptionSelector;

const styles = StyleSheet.create({
  animatedWrapper: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  animatedLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  card: {
    width: '18.5%',
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
    marginVertical: 2,
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
  upcomingCard: {
    opacity: 0.58,
  },
  upcomingTitle: {
    color: '#8b9098',
  },
  compactWrapper: {
    paddingVertical: 6,
  },
  compactList: {
    paddingHorizontal: 10,
  },
  compactCard: {
    minWidth: 72,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fb',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#eceef2',
    paddingHorizontal: 10,
    marginHorizontal: 2,
  },
  selectedCompactCard: {
    backgroundColor: '#fff4ec',
    borderColor: COLOR.primary,
  },
  compactTitle: {
    color: '#626975',
    fontSize: 10,
    fontWeight: '600',
  },
});
