import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import { useApi } from '../../../Backend/Api';
import { useIsFocused } from '@react-navigation/native';
import { useToast } from '../../../Constants/ToastContext';

const SpaceManagement = ({ navigation }) => {
  const { getRequest, postRequest } = useApi();
  const { showToast } = useToast();
  const isFocus = useIsFocused();

  const [loader, setLoader] = useState(true);
  const [propertyData, setPropertyData] = useState([]);
  const [activeTab, setActiveTab] = useState('property');

  // modal states for hostel capacity editing
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [capacityInput, setCapacityInput] = useState('');

  const fetchData = async (type = activeTab) => {
    setLoader(true);
    try {
      const endpoint =
        type === 'property'
          ? 'public/api/my-property'
          : 'public/api/my-list/hostels';
      const response =
        type === 'property'
          ? await getRequest(endpoint)
          : await getRequest(endpoint);

      if (response?.data?.status || response?.data?.success) {
        setPropertyData(response.data.data || []);
      } else {
        setPropertyData([]);
      }
    } catch {
      showToast?.('Something went wrong while fetching data.', 'error');
      setPropertyData([]);
    } finally {
      setLoader(false);
    }
  };

  // ✅ Optimistic toggle with proper boolean handling
  const togglePropertyStatus = async (id) => {
    // instant local update
    setPropertyData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, is_active: !Boolean(item.is_active) }
          : item
      )
    );

    try {
      await postRequest(`public/api/properties/active/${id}`);
      // optional refresh from server
      fetchData('property');
    } catch {
      // revert on failure
      setPropertyData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, is_active: !Boolean(item.is_active) }
            : item
        )
      );
      showToast?.('Something went wrong while updating status.', 'error');
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setCapacityInput(item?.seating_capacity?.toString() || '');
    setEditModalVisible(true);
  };

  const updateCapacity = async () => {
    if (!editingItem) return;
    try {
      const formData = new FormData();
      formData.append('seating_capacity', capacityInput);
      const endpoint = `public/api/hostel-update/${editingItem.id}`;
      const res = await postRequest(endpoint, formData, true);
      if (res?.data?.status || res?.data?.success) {
        showToast?.('Seating capacity updated', 'success');
        setEditModalVisible(false);
        setEditingItem(null);
        await fetchData('hostel');
      } else {
        showToast?.(res?.data?.message || 'Update failed', 'error');
      }
    } catch {
      showToast?.('Something went wrong while updating.', 'error');
    }
  };

  useEffect(() => {
    if (isFocus) fetchData();
  }, [isFocus, activeTab]);

  const renderItem = ({ item }) => {
    const isPropertyTab = activeTab === 'property';
    const id = item?.id;
    const isActive = !!item?.is_active; // ✅ always boolean

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('PropertyDetail', { propertyData: item })
          }
          style={styles.leftContent}>
          {/* <Image
            source={
              item?.images?.length > 0 && item?.images[0]?.image_path
                ? { uri: item?.images[0]?.image_url || item.images[0].image_path }
                : { uri: 'https://cdn-icons-png.flaticon.com/128/25/25694.png' }
            }
            style={styles.image}
            resizeMode="cover"
          /> */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.title || 'Untitled'}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {item?.location || '-'}
            </Text>
            <Text style={styles.priceSmall}>
              {isPropertyTab
                ? item?.price
                  ? `₹${item.price}`
                  : `₹${item?.min_price || 0} - ₹${item?.max_price || 0}`
                : `Capacity: ${item?.seating_capacity || 0}`}
            </Text>
          </View>
        </TouchableOpacity>

        {isPropertyTab ? (
          <View style={styles.rightCol}>
            <Text style={styles.toggleLabel}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
            <Switch
              value={!!isActive}
              onValueChange={() => togglePropertyStatus(id)}
              trackColor={{
                false: '#ccc',
                true: '#999',
              }}
              thumbColor={isActive ? COLOR.primary : '#888'}
              ios_backgroundColor="#ccc"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />

          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(item)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const TabButton = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === value && styles.tabButtonActive]}
      onPress={() => activeTab !== value && setActiveTab(value)}>
      <Text style={[styles.tabText, activeTab === value && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <Header
        title="Space Management"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.tabContainer}>
        <TabButton label="Property" value="property" />
        <TabButton label="Hostels" value="hostel" />
      </View>

      {loader ? (
        <ActivityIndicator size="large" color={COLOR.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={propertyData}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
              No data found
            </Text>
          }
        />
      )}

      {/* Seating capacity edit modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeader}>Seating Capacity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={capacityInput}
              onChangeText={setCapacityInput}
              placeholder="Enter capacity"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: COLOR.primary }]}
                onPress={updateCapacity}>
                <Text style={styles.modalBtnText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setEditModalVisible(false)}>
                <Text style={[styles.modalBtnText, { color: '#333' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SpaceManagement;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabButtonActive: { backgroundColor: COLOR.primary },
  tabText: { fontSize: 15, color: '#666', fontWeight: '600' },
  tabTextActive: { color: COLOR.white },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
  },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  image: { width: 84, height: 84, borderRadius: 8, marginRight: 12, backgroundColor: '#f0f0f0' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: COLOR.black },
  location: { color: '#666', marginTop: 4 },
  priceSmall: { color: COLOR.primary, fontWeight: '700', marginTop: 6 },
  rightCol: { width: 90, alignItems: 'center', justifyContent: 'center' },
  toggleLabel: { fontSize: 12, marginBottom: 6, color: '#444' },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLOR.primary,
    borderRadius: 6,
    alignSelf: 'center',
  },
  editText: { color: COLOR.white, fontWeight: '600', fontSize: 14 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
