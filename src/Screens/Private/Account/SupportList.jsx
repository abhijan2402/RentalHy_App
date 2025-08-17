import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const SupportList = ({navigation}) => {
  // Dummy support tickets data
  const tickets = [
    {
      id: '1',
      title: 'Payment not processed',
      description: 'I made a payment but it is not reflecting in my account.',
      status: 'Open',
    },
    {
      id: '2',
      title: 'App crashing on login',
      description: 'Whenever I try to log in, the app crashes immediately.',
      status: 'Pending',
    },
    {
      id: '3',
      title: 'App crashing on login',
      description: 'Whenever I try to log in, the app crashes immediately.',
      status: 'Closed',
    },
  ];

  // Status color mapping using COLOR constants
  const getStatusColor = status => {
    switch (status) {
      case 'Open':
        return COLOR.green; // green
      case 'Pending':
        return '#fab319'; // using your royalBlue for pending
      case 'Closed':
        return COLOR.primary; // using pink for closed
      default:
        return COLOR.black;
    }
  };

  const renderTicket = ({item}) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
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

      {/* Ticket list */}
      <FlatList
        data={tickets}
        keyExtractor={item => item.id}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContainer}
      />

      {/* Create ticket button */}
      <CustomButton
        title={'Create Ticket'}
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
    fontWeight: 'bold',
  },
});
