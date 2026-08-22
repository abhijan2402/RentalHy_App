import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AuthContext} from '../../../Backend/AuthContent';
import {useApi} from '../../../Backend/Api';
import {COLOR} from '../../../Constants/Colors';

const CATEGORIES = [
  {key: 'property', label: 'Properties', aliases: ['property', 'properties', 'flat', 'house', 'room']},
  {key: 'hostel', label: 'Hostels', aliases: ['hostel', 'hostels', 'pg']},
  {key: 'hotel', label: 'Hotels', aliases: ['hotel', 'hotels']},
  {key: 'convention', label: 'Convention halls', aliases: ['convention', 'hall', 'banquet']},
  {key: 'resort', label: 'Resorts', aliases: ['resort', 'resorts']},
  {key: 'farm', label: 'Farm houses', aliases: ['farm house', 'farmhouse', 'farm']},
];

const ENDPOINTS = {
  property: {method: 'post', url: 'public/api/properties'},
  hostel: {method: 'post', url: 'public/api/hostels/list'},
  hotel: {method: 'get', url: 'public/api/hotels'},
  convention: {method: 'post', url: 'public/api/hall_listing'},
  resort: {method: 'post', url: 'public/api/resort_listing'},
  farm: {method: 'post', url: 'public/api/farm_listing'},
};

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: 'Hi! What kind of place are you looking for? Choose an option below or type, for example, “show me nearby resorts”.',
};

const getCategory = text => {
  const normalized = text.toLowerCase();
  const matches = CATEGORIES.flatMap(category =>
    category.aliases
      .filter(alias => normalized.includes(alias))
      .map(alias => ({category, matchLength: alias.length})),
  );

  if (!matches.length) {
    const genericPropertyRequest = /\b(?:show|find|search|nearby|around me|rent|rental|listing|available)\b/.test(normalized);
    return genericPropertyRequest ? CATEGORIES[0] : null;
  }

  matches.sort((first, second) => second.matchLength - first.matchLength);
  return matches[0].category;
};

const toAmount = value => {
  if (!value || typeof value === 'object') {
    return null;
  }
  const normalized = String(value)
    .replace(/,/g, '')
    .toLowerCase()
    .replace(/[^\d.k]/g, '');
  const number = Number.parseFloat(normalized);
  if (Number.isNaN(number)) {
    return null;
  }
  return normalized.endsWith('k') ? number * 1000 : number;
};

const parseFilters = text => {
  const normalized = text.toLowerCase();
  const filters = {};
  const between = normalized.match(/(?:between|from)\s*(\d[\d,]*(?:\.\d+)?k?)\s*(?:and|to|-)\s*(\d[\d,]*(?:\.\d+)?k?)/i);
  const maximum = normalized.match(/(?:under|below|less than|up to|max(?:imum)?(?: price)?(?: of)?)\s*₹?\s*(\d[\d,]*(?:\.\d+)?k?)/i);
  const minimum = normalized.match(/(?:above|over|more than|at least|min(?:imum)?(?: price)?(?: of)?)\s*₹?\s*(\d[\d,]*(?:\.\d+)?k?)/i);
  const bhk = normalized.match(/\b([1-9])\s*bhk\b/i);
  const capacity = normalized.match(/(?:for|capacity(?: of)?)\s*(\d+)\s*(?:people|persons|guests)/i);

  if (between) {
    filters.minPrice = toAmount(between[1]);
    filters.maxPrice = toAmount(between[2]);
  } else {
    if (maximum) {
      filters.maxPrice = toAmount(maximum[1]);
    }
    if (minimum) {
      filters.minPrice = toAmount(minimum[1]);
    }
  }
  if (bhk) {
    filters.bhk = bhk[1];
  }
  if (capacity) {
    filters.minCapacity = capacity[1];
  }
  if (/\bfurnished\b/.test(normalized) && !/unfurnished/.test(normalized)) {
    filters.furnishing = 'Furnished';
  }
  if (/\bunfurnished\b/.test(normalized)) {
    filters.furnishing = 'Unfurnished';
  }
  if (/\b(?:women|woman|girls|female)\b/.test(normalized)) {
    filters.gender = 'Female';
  } else if (/\b(?:men|man|boys|male)\b/.test(normalized)) {
    filters.gender = 'Male';
  }
  if (/\b(?:ac|air conditioned|air conditioning)\b/.test(normalized)) {
    filters.acAvailable = 1;
  }
  if (/\bparking\b/.test(normalized)) {
    filters.parking = 1;
  }
  if (/\b(?:food|meals)\b/.test(normalized)) {
    filters.food = 1;
  }
  return filters;
};

const appendFilters = (target, filters) => {
  const values = {
    min_price: filters.minPrice,
    price_min: filters.minPrice,
    max_price: filters.maxPrice,
    price_max: filters.maxPrice,
    'bhk[0]': filters.bhk,
    'furnishing_status[0]': filters.furnishing,
    'genders[0]': filters.gender,
    seating_capacity_min: filters.minCapacity,
    ac_available: filters.acAvailable,
    parking_available: filters.parking,
    'facilities[0]': filters.parking ? 'Parking' : null,
    'food_option[0]': filters.food ? 'Food' : null,
  };
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      target.append(key, String(value));
    }
  });
};

const getNumericPrice = item => {
  const values = [
    item?.price,
    item?.rent,
    item?.min_amount,
    item?.starting_price,
    item?.day_visit_price,
  ].map(toAmount).filter(value => value !== null);
  return values.length ? Math.min(...values) : null;
};

const applyPriceFilter = (items, filters) => items.filter(item => {
  const price = getNumericPrice(item);
  if (price === null) {
    return true;
  }
  return (!filters.minPrice || price >= filters.minPrice) &&
    (!filters.maxPrice || price <= filters.maxPrice);
});

const unpackResults = response => {
  const payload = response?.data?.data;
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
};

const getImage = item =>
  item?.image ||
  item?.thumbnail ||
  item?.images?.[0]?.image_path ||
  item?.images?.[0]?.image ||
  item?.images_grouped?.room?.[0]?.image_path ||
  item?.images_grouped?.hall?.[0]?.image_path ||
  item?.images_grouped?.kitchen?.[0]?.image_path;

const ResultCard = ({item, onPress}) => {
  const image = getImage(item);
  const price = item?.price || item?.rent || item?.min_amount || item?.starting_price;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {image ? <Image source={{uri: image}} style={styles.cardImage} /> : null}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item?.title || item?.name || item?.property_name || 'Property'}
        </Text>
        <Text style={styles.cardLocation} numberOfLines={2}>
          📍 {item?.location || item?.address || item?.city || 'Location available in details'}
        </Text>
        {price ? <Text style={styles.cardPrice}>₹ {price}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const PropertyAssistant = ({navigation}) => {
  const messageListRef = useRef(null);
  const chatSessionRef = useRef(0);
  const {currentAddress} = useContext(AuthContext);
  const {getRequest, postRequest} = useApi();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  const scrollToLatest = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      messageListRef.current?.scrollToEnd({animated});
    });
  }, []);

  useEffect(() => {
    scrollToLatest();
  }, [messages, scrollToLatest]);

  useEffect(() => {
    const eventName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(eventName, () => {
      setKeyboardVisible(true);
      scrollToLatest();
    });
    const hideSubscription = Keyboard.addListener(hideEventName, () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [scrollToLatest]);

  const fetchListings = useCallback(async (category, requestText, filters) => {
    const config = ENDPOINTS[category.key];
    const nearby = /near\s*by|nearby|around me|close to me/i.test(requestText);
    const lat = currentAddress?.lat;
    const long = currentAddress?.lng;

    if (config.method === 'get') {
      const params = new URLSearchParams({status: '1', page: '1', per_page: '20'});
      if (nearby && lat) {
        params.append('lat', String(lat));
      }
      if (nearby && long) {
        params.append('long', String(long));
      }
      appendFilters(params, filters);
      return getRequest(`${config.url}?${params.toString()}`);
    }

    const formData = new FormData();
    formData.append('page', '1');
    formData.append('per_page', '20');
    if (nearby && lat) {
      formData.append('lat', String(lat));
    }
    if (nearby && long) {
      formData.append('long', String(long));
    }
    appendFilters(formData, filters);
    return postRequest(config.url, formData, true);
  }, [currentAddress, getRequest, postRequest]);

  const handleRequest = useCallback(async text => {
    const cleanText = text.trim();
    if (!cleanText || loading) {
      return;
    }

    const category = getCategory(cleanText);
    const filters = parseFilters(cleanText);
    const requestSession = chatSessionRef.current;
    const userMessage = {id: `user-${Date.now()}`, sender: 'user', text: cleanText};
    setMessages(previous => [...previous, userMessage]);
    setInput('');

    if (!category) {
      setMessages(previous => [
        ...previous,
        {
          id: `support-${Date.now()}`,
          sender: 'bot',
          text: 'This question is outside property search. Please ask ToLetIndia Support for help.',
          action: 'support',
        },
      ]);
      return;
    }

    setLoading(true);

    const response = await fetchListings(category, cleanText, filters);
    if (requestSession !== chatSessionRef.current) {
      return;
    }
    const results = applyPriceFilter(unpackResults(response), filters);
    const nearby = /near\s*by|nearby|around me|close to me/i.test(cleanText);
    const locationNote = nearby && !currentAddress?.lat
      ? ' I could not find your current location, so these are the latest listings.'
      : '';
    const reply = response?.success
      ? results.length
        ? `I found ${results.length} ${category.label.toLowerCase()} for you.${locationNote}`
        : `I could not find any ${category.label.toLowerCase()} right now. Try another option or location.`
      : response?.error || 'I could not load listings. Please try again.';

    setMessages(previous => [
      ...previous,
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        results,
        category: category.key,
      },
    ]);
    setLoading(false);
  }, [currentAddress, fetchListings, loading]);

  const restartChat = () => {
    chatSessionRef.current += 1;
    Keyboard.dismiss();
    setInput('');
    setLoading(false);
    setMessages([{...WELCOME_MESSAGE, id: `welcome-${Date.now()}`}]);
  };

  const openDetails = (item, category) => {
    navigation.navigate('Home', {
      screen: 'PropertyDetail',
      params: {
        propertyData: item,
        type: ['convention', 'resort', 'farm'].includes(category)
          ? 'convention'
          : category,
        semiType: category === 'farm' ? 'farm' : category,
      },
    });
  };

  const showMore = category => {
    if (category === 'hotel') {
      navigation.navigate('Hotels');
      return;
    }

    if (category === 'property') {
      navigation.navigate('Home', {screen: 'Home'});
      return;
    }

    if (category === 'hostel') {
      navigation.navigate('Home', {screen: 'Hostel'});
      return;
    }

    const conventionType = category === 'farm' ? 'farm' : category === 'resort' ? 'resort' : 'conv';
    navigation.navigate('Home', {
      screen: 'Convention',
      params: {type: conventionType},
    });
  };

  const renderMessage = ({item}) => (
    <View style={item.sender === 'user' ? styles.userWrap : styles.botWrap}>
      <View style={item.sender === 'user' ? styles.userBubble : styles.botBubble}>
        <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
          {item.text}
        </Text>
      </View>
      {item.action === 'support' ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Ask ToLetIndia Support"
          style={styles.supportButton}
          onPress={() => navigation.navigate('Home', {screen: 'SupportList'})}>
          <Text style={styles.supportButtonText}>Ask Support</Text>
          <Text style={styles.supportButtonArrow}>›</Text>
        </TouchableOpacity>
      ) : null}
      {item.results?.length ? (
        <View style={styles.resultBlock}>
          <FlatList
            horizontal
            data={item.results.slice(0, 5)}
            keyExtractor={(result, index) => `${result?.id || index}`}
            renderItem={({item: result}) => (
              <ResultCard item={result} onPress={() => openDetails(result, item.category)} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.results}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Show all ${item.category} listings`}
            style={styles.showMoreButton}
            onPress={() => showMore(item.category)}>
            <Text style={styles.showMoreText}>Show more</Text>
            <Text style={styles.showMoreArrow}>›</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={0}>
        <View style={styles.header}>
          <View style={styles.botIcon}><Text style={styles.botIconText}>⌂</Text></View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>ToLetIndia Assistant</Text>
            <Text style={styles.headerSubtitle}>Uses ToLetIndia listings</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Restart chat"
            style={styles.restartButton}
            onPress={restartChat}>
            <Text style={styles.restartIcon}>↻</Text>
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={messageListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets
          onContentSizeChange={() => scrollToLatest(false)}
        />

        <View style={styles.quickArea}>
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={item => item.key}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleRequest(`Show me nearby ${item.label}`)}>
                <Text style={styles.chipText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View
          style={[
            styles.inputRow,
            keyboardVisible && Platform.OS === 'android' && styles.inputRowKeyboard,
          ]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onFocus={() => scrollToLatest()}
            onSubmitEditing={() => handleRequest(input)}
            placeholder="Ask for a property..."
            placeholderTextColor="#8A9099"
            returnKeyType="send"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => handleRequest(input)}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.sendText}>➤</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PropertyAssistant;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLOR.white},
  container: {flex: 1, backgroundColor: '#F7F8FA'},
  header: {height: 68, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: COLOR.white, borderBottomWidth: 1, borderBottomColor: '#ECEEF2'},
  headerText: {flex: 1},
  botIcon: {width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR.primary, marginRight: 11},
  botIconText: {fontSize: 24, color: COLOR.white, fontWeight: '700'},
  headerTitle: {fontSize: 17, fontWeight: '700', color: COLOR.black},
  headerSubtitle: {fontSize: 12, color: '#69707D', marginTop: 2},
  restartButton: {height: 34, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: '#FFF1E8'},
  restartIcon: {fontSize: 19, lineHeight: 20, color: COLOR.primary, marginRight: 4},
  restartText: {fontSize: 12, fontWeight: '700', color: COLOR.primary},
  messageList: {padding: 14, paddingBottom: 20},
  userWrap: {alignItems: 'flex-end', marginBottom: 13},
  botWrap: {alignItems: 'flex-start', marginBottom: 13},
  userBubble: {maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomRightRadius: 4, backgroundColor: COLOR.primary},
  botBubble: {maxWidth: '86%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomLeftRadius: 4, backgroundColor: COLOR.white, borderWidth: 1, borderColor: '#E7E9ED'},
  userText: {fontSize: 15, lineHeight: 21, color: COLOR.white},
  botText: {fontSize: 15, lineHeight: 21, color: COLOR.black},
  results: {paddingTop: 10, paddingRight: 12},
  resultBlock: {width: '100%'},
  card: {width: 210, marginRight: 10, borderRadius: 13, overflow: 'hidden', backgroundColor: COLOR.white, borderWidth: 1, borderColor: '#E7E9ED'},
  cardImage: {width: '100%', height: 105, backgroundColor: '#ECEEF2'},
  cardContent: {padding: 10},
  cardTitle: {fontSize: 14, fontWeight: '700', color: COLOR.black},
  cardLocation: {fontSize: 12, color: '#69707D', lineHeight: 17, marginTop: 5},
  cardPrice: {fontSize: 14, color: COLOR.primary, fontWeight: '700', marginTop: 6},
  showMoreButton: {alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 14, height: 38, borderRadius: 19, backgroundColor: COLOR.primary},
  showMoreText: {fontSize: 13, fontWeight: '700', color: COLOR.white},
  showMoreArrow: {fontSize: 22, lineHeight: 23, marginLeft: 6, color: COLOR.white},
  supportButton: {flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 14, height: 38, borderRadius: 19, backgroundColor: COLOR.primary},
  supportButtonText: {fontSize: 13, fontWeight: '700', color: COLOR.white},
  supportButtonArrow: {fontSize: 22, lineHeight: 23, marginLeft: 6, color: COLOR.white},
  quickArea: {paddingVertical: 9, paddingLeft: 12, borderTopWidth: 1, borderTopColor: '#ECEEF2', backgroundColor: COLOR.white},
  chip: {paddingHorizontal: 13, paddingVertical: 8, marginRight: 8, borderRadius: 18, backgroundColor: '#FFF1E8', borderWidth: 1, borderColor: '#FFD7BF'},
  chipText: {fontSize: 13, color: COLOR.primary, fontWeight: '600'},
  inputRow: {paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', backgroundColor: COLOR.white},
  inputRowKeyboard: {marginBottom: 28},
  input: {flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, color: COLOR.black, backgroundColor: '#F1F3F5'},
  sendButton: {width: 44, height: 44, borderRadius: 22, marginLeft: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR.primary},
  sendText: {fontSize: 20, color: COLOR.white, marginLeft: 2},
});
