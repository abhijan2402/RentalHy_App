// PropertyCard.js
import React, {useContext, useState} from 'react';
import {TouchableOpacity, Image, Text, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR} from '../Constants/Colors';
import {AuthContext} from '../Backend/AuthContent';
import CreateAccountModal from '../Modals/CreateAccountModal';

const PropertyCard = ({
  item = {},
  toggleLike,
  type,
  removewishlist,
  showDelete = false,
}) => {

  const navigation = useNavigation();
  const {currentStatus} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        if (currentStatus == -1) {
          setModalVisible(true);
        } else {
          navigation.navigate('PropertyDetail', {
            propertyData: type === 'wishlist' ? item?.property : item,
            type:type
          });
        }
      }}
      style={styles.card}>
      <Image
        source={{
          uri: item?.image
            ? item?.image
            : item?.property?.images[0]?.image_url ||
              item?.images[0]?.image_url,
        }}
        style={styles.propertyImage}
      />

      {(type === 'wishlist' || type === 'home') && <TouchableOpacity
        style={styles.wishlistIcon}
        onPress={() =>
          type == 'wishlist' ? removewishlist(item.id) : toggleLike(item.id)
        }>
        <Image
          source={{
            uri: showDelete
              ? 'https://cdn-icons-png.flaticon.com/128/3405/3405244.png'
              : 'https://cdn-icons-png.flaticon.com/128/4240/4240564.png',
          }}
          style={{
            width: 20,
            height: 20,
            tintColor:
              item?.is_wishlist == 1 || showDelete
                ? COLOR?.primary
                : COLOR.white,
          }}
        />
      </TouchableOpacity>}

      <Text style={styles.propertyName}>
        {item.title || item?.property?.title || item?.name}
      </Text>
      <Text style={styles.propertyLocation}>
        {item?.property?.location || item.location}
      </Text>
      <Text style={styles.propertyLocation}>
        {(() => {
          const tenantType =
            item?.preferred_tenant_type ??
            item?.property?.preferred_tenant_type;
          if (
            typeof tenantType === 'string' &&
            tenantType.trim().startsWith('[')
          ) {
            try {
              return JSON.parse(tenantType).join(', ');
            } catch {
              return tenantType;
            }
          }
          return tenantType;
        })()}{' '}
      </Text>

      <View style={styles.MainStyle}>
        <Text style={styles.propertyPrice}>
          {item?.property?.price != null && item?.property?.price !== undefined
            ? '₹' + item.property.price
            : item?.price != null && item?.price !== undefined
            ? '₹' + item.price
            :'₹' +  item?.min_price + ' - ' + item?.max_price}
        </Text>
        {(item?.status || item?.property?.status) == 1 && (
          <Text style={styles.TagStyle}>Featured</Text>
        )}
      </View>
      <CreateAccountModal
        visible={modalVisible}
        onCreateAccount={() => {
          console.log('Navigate to signup screen');
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </TouchableOpacity>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#ccc',

  },
  propertyImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  propertyLocation: {
    fontSize: 14,
    color: COLOR.grey,
  },
  propertyPrice: {
    fontSize: 14,
    color: COLOR.primary,
    fontWeight: 'bold',
  },
  MainStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TagStyle: {
    paddingVertical: 2,
    // backgroundColor: COLOR.green,
    width: '38%',
    color: 'white',
    fontWeight: 500,
    textAlign: 'center',
    borderRadius: 2,
    fontSize: 12,
    color: COLOR.green,
  },
});
