import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import {useIsFocused} from '@react-navigation/native';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';

const SupportList = ({navigation}) => {
  const {getRequest} = useApi();
  const showToast = useToast();
  const isFocus = useIsFocused();

  const [loader, setLoader] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const getSupportDetail = useCallback(
    async (pageNum = 1) => {
      try {
        pageNum === 1 && setLoader(true);
        const res = await getRequest(
          `public/api/support/issues?page=${pageNum}`,
        );

        const apiData = res?.data;
        if (apiData?.status === 'success' || apiData?.success === 'success') {
          const newTickets = apiData.data?.data || [];
          if (pageNum === 1) {
            setTickets(newTickets); // first page
          } else {
            setTickets(prev => [...prev, ...newTickets]); // append
          }
          setHasMore(Boolean(apiData.data?.next_page_url));
          setPage(pageNum);
        } else {
          showToast('Failed to fetch support issues', 'error');
        }
      } catch (error) {
        showToast(error?.message || 'Something went wrong', 'error');
      } finally {
        setLoader(false);
        setLoadingMore(false);
      }
    },
    [getRequest, showToast],
  );

  useEffect(() => {
    if (isFocus) {
      getSupportDetail(1); 
    }
  }, [isFocus, getSupportDetail]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      getSupportDetail(page + 1);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'open':
        return COLOR.green;
      case 'pending':
        return '#fab319';
      case 'closed':
        return COLOR.primary;
      default:
        return COLOR.black;
    }
  };

  const renderTicket = ({item}) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text
          style={[
            styles.status,
            {color: getStatusColor(item.status)},
            {textTransform: 'capitalize'},
          ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.ticketDescription}>{item.description}</Text>
    </TouchableOpacity>
  );



  return (
    <View style={styles.container}>
      <Header
        title="Support"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={tickets}
        keyExtractor={item => String(item.id)}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Text>No Support Ticket found.</Text>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={COLOR.primary}
              style={{marginVertical: 16}}
            />
          ) : null
        }
      />

      <CustomButton
        title="Create Ticket"
        onPress={() => navigation.navigate('CreateTicket')}
        style={{marginBottom: 45}}
      />
    </View>
  );
};

export default SupportList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  listContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: COLOR.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLOR.grey,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    color: COLOR.black,
  },
  ticketDescription: {
    fontSize: 14,
    color: COLOR.grey,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    marginRight: 10,
    fontWeight: 'bold',
  },
});
