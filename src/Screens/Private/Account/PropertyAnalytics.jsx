import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {useApi} from '../../../Backend/Api';

const EMPTY_SUMMARY = {
  total_listings: 0,
  total_bookings: 0,
  total_revenue: 0,
  pending_bookings: 0,
  confirmed_bookings: 0,
  rejected_bookings: 0,
};

const number = value => Number(value) || 0;
const formatNumber = value => new Intl.NumberFormat('en-IN').format(number(value));
const formatMoney = value => `₹${formatNumber(value)}`;

const MetricCard = ({icon, label, value, tint, wide}) => (
  <View style={[styles.metricCard, wide && styles.wideMetricCard]}>
    <View style={[styles.metricIcon, {backgroundColor: `${tint}18`}]}>
      <Text style={styles.metricIconText}>{icon}</Text>
    </View>
    <View style={styles.metricText}>
      <Text style={styles.metricValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  </View>
);

const MiniStat = ({label, value, color = '#344054'}) => (
  <View style={styles.miniStat}>
    <Text style={[styles.miniValue, {color}]}>{formatNumber(value)}</Text>
    <Text style={styles.miniLabel}>{label}</Text>
  </View>
);

const SectionHeader = ({title, subtitle}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

const PropertyAnalytics = ({navigation}) => {
  const {getRequest} = useApi();
  const getRequestRef = useRef(getRequest);
  getRequestRef.current = getRequest;
  const isFocused = useIsFocused();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const getPropertyData = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const response = await getRequestRef.current('public/api/my-property');
      if (response?.data?.status) {
        setAnalytics(response.data.data || {});
      } else {
        setError(response?.data?.message || response?.error || 'Unable to load analytics.');
      }
    } catch (requestError) {
      setError('Something went wrong while loading analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getPropertyData();
    }
  }, [isFocused, getPropertyData]);

  const summary = analytics?.overall_summary || EMPTY_SUMMARY;
  const propertySummary = analytics?.properties?.summary || {};
  const conventionSummary = analytics?.convention_halls?.summary || {};
  const hotelSummary = analytics?.hotels?.summary || {};
  const hotelBookings = analytics?.hotels?.bookings || {};
  const hostelSummary = analytics?.hostels?.summary || {};

  const recentBookings = useMemo(() => {
    const conventionList = (analytics?.convention_halls?.bookings?.list || []).map(item => ({
      ...item,
      analyticsType: 'Convention',
      reference: item.order_id,
      status: item.order_status_text || item.order_status,
      date: item.booking_date,
      amount: item.total_amount ?? item.amount,
    }));
    const hotelList = (analytics?.hotels?.bookings?.list || []).map(item => ({
      ...item,
      analyticsType: 'Hotel',
      reference: item.booking_reference,
      status: item.order_status_text || item.booking_status,
      date: item.check_in?.split(' ')[0],
      amount: item.total_amount,
    }));
    return [...conventionList, ...hotelList]
      .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
      .slice(0, 10);
  }, [analytics]);

  const getStatusStyle = status => {
    const normalized = String(status || '').toLowerCase();
    if (normalized.includes('confirm') || normalized === 'success') {
      return styles.confirmedBadge;
    }
    if (normalized.includes('reject') || normalized.includes('cancel')) {
      return styles.rejectedBadge;
    }
    return styles.pendingBadge;
  };

  const renderBooking = ({item}) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingTopRow}>
        <View style={styles.bookingTypeWrap}>
          <Text style={styles.bookingType}>{item.analyticsType}</Text>
          <Text style={styles.bookingReference} numberOfLines={1}>{item.reference || `Booking #${item.id}`}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.bookingBottomRow}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingName} numberOfLines={1}>{item.full_name || item.contact_number || 'Guest booking'}</Text>
          <Text style={styles.bookingDate}>📅 {item.date || 'Date unavailable'}{item.event_time ? `  •  ${item.event_time}` : ''}</Text>
        </View>
        <Text style={styles.bookingAmount}>{formatMoney(item.amount)}</Text>
      </View>
    </View>
  );

  const listHeader = (
    <>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>PERFORMANCE OVERVIEW</Text>
        <Text style={styles.heroTitle}>Your business at a glance</Text>
        <Text style={styles.heroSubtitle}>Live insights across all your listings and bookings</Text>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard icon="₹" label="Total revenue" value={formatMoney(summary.total_revenue)} tint="#16A34A" wide />
        <MetricCard icon="⌂" label="Total listings" value={formatNumber(summary.total_listings)} tint="#7C3AED" />
        <MetricCard icon="▣" label="Total bookings" value={formatNumber(summary.total_bookings)} tint="#2563EB" />
      </View>

      <SectionHeader title="Booking status" subtitle="Overall booking distribution" />
      <View style={styles.statusPanel}>
        <MiniStat label="Pending" value={summary.pending_bookings} color="#D97706" />
        <View style={styles.verticalDivider} />
        <MiniStat label="Confirmed" value={summary.confirmed_bookings} color="#16A34A" />
        <View style={styles.verticalDivider} />
        <MiniStat label="Rejected" value={summary.rejected_bookings} color="#DC2626" />
      </View>

      <SectionHeader title="Listing breakdown" subtitle="Performance by property category" />
      <View style={styles.categoryCard}>
        <Text style={styles.categoryIcon}>🏡</Text>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>Properties</Text>
          <Text style={styles.categoryCaption}>{formatNumber(propertySummary.approved)} approved • {formatNumber(propertySummary.pending)} pending</Text>
        </View>
        <Text style={styles.categoryTotal}>{formatNumber(propertySummary.total)}</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryIcon}>🏨</Text>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>Hotels</Text>
          <Text style={styles.categoryCaption}>{formatNumber(hotelBookings.total)} bookings • {formatMoney(hotelBookings.revenue)} revenue</Text>
        </View>
        <Text style={styles.categoryTotal}>{formatNumber(hotelSummary.total)}</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryIcon}>🎪</Text>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>Convention venues</Text>
          <Text style={styles.categoryCaption}>{formatNumber(conventionSummary.halls)} halls • {formatNumber(conventionSummary.farms)} farms • {formatNumber(conventionSummary.resorts)} resorts</Text>
        </View>
        <Text style={styles.categoryTotal}>{formatNumber(conventionSummary.total)}</Text>
      </View>
      <View style={styles.categoryCard}>
        <Text style={styles.categoryIcon}>🛏️</Text>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>Hostels</Text>
          <Text style={styles.categoryCaption}>Managed hostel listings</Text>
        </View>
        <Text style={styles.categoryTotal}>{formatNumber(hostelSummary.total)}</Text>
      </View>

      <SectionHeader title="Recent bookings" subtitle={`Showing ${recentBookings.length} latest bookings`} />
    </>
  );

  if (loading && !analytics) {
    return (
      <View style={styles.screen}>
        <Header title="Property Analytics" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Text style={styles.stateText}>Preparing your analytics…</Text>
        </View>
      </View>
    );
  }

  if (error && !analytics) {
    return (
      <View style={styles.screen}>
        <Header title="Property Analytics" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.centerState}>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.errorTitle}>Analytics unavailable</Text>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => getPropertyData()}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Property Analytics" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={recentBookings}
        keyExtractor={item => `${item.analyticsType}-${item.id}`}
        renderItem={renderBooking}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<View style={styles.emptyBox}><Text style={styles.emptyTitle}>No bookings yet</Text><Text style={styles.emptyText}>New bookings will appear here.</Text></View>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getPropertyData(true)} colors={[COLOR.primary]} tintColor={COLOR.primary} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F6F7FB'},
  listContent: {padding: 16, paddingBottom: 36},
  hero: {backgroundColor: COLOR.primary, borderRadius: 20, padding: 22, marginBottom: 16, shadowColor: COLOR.primary, shadowOffset: {width: 0, height: 7}, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5},
  heroEyebrow: {color: '#FFFFFFB8', fontSize: 10, fontWeight: '800', letterSpacing: 1.2},
  heroTitle: {color: '#FFF', fontSize: 23, fontWeight: '800', marginTop: 8},
  heroSubtitle: {color: '#FFFFFFD6', fontSize: 13, lineHeight: 19, marginTop: 5},
  metricsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  metricCard: {width: '48.5%', minHeight: 94, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EAECF0'},
  wideMetricCard: {width: '100%'},
  metricIcon: {width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 11},
  metricIconText: {fontSize: 19, fontWeight: '800', color: '#344054'},
  metricText: {flex: 1},
  metricValue: {fontSize: 20, fontWeight: '800', color: '#101828'},
  metricLabel: {fontSize: 12, color: '#667085', marginTop: 3},
  sectionHeader: {marginTop: 26, marginBottom: 11},
  sectionTitle: {fontSize: 18, fontWeight: '800', color: '#101828'},
  sectionSubtitle: {fontSize: 12, color: '#98A2B3', marginTop: 3},
  statusPanel: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 18, borderWidth: 1, borderColor: '#EAECF0'},
  miniStat: {flex: 1, alignItems: 'center'},
  miniValue: {fontSize: 20, fontWeight: '800'},
  miniLabel: {fontSize: 11, color: '#667085', marginTop: 4},
  verticalDivider: {height: 34, width: 1, backgroundColor: '#EAECF0'},
  categoryCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 15, marginBottom: 9, borderWidth: 1, borderColor: '#EAECF0'},
  categoryIcon: {fontSize: 25, width: 42},
  categoryContent: {flex: 1},
  categoryTitle: {fontSize: 14, fontWeight: '700', color: '#1D2939'},
  categoryCaption: {fontSize: 11, color: '#667085', marginTop: 4},
  categoryTotal: {fontSize: 20, fontWeight: '800', color: COLOR.primary, marginLeft: 8},
  bookingCard: {backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 11, borderWidth: 1, borderColor: '#EAECF0'},
  bookingTopRow: {flexDirection: 'row', alignItems: 'flex-start'},
  bookingTypeWrap: {flex: 1, paddingRight: 10},
  bookingType: {fontSize: 14, fontWeight: '800', color: '#1D2939'},
  bookingReference: {fontSize: 10, color: '#98A2B3', marginTop: 3},
  statusBadge: {paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20},
  pendingBadge: {backgroundColor: '#FFF4E5'},
  confirmedBadge: {backgroundColor: '#EAF8EF'},
  rejectedBadge: {backgroundColor: '#FDECEC'},
  statusText: {fontSize: 10, fontWeight: '700', color: '#475467', textTransform: 'capitalize'},
  divider: {height: 1, backgroundColor: '#F2F4F7', marginVertical: 12},
  bookingBottomRow: {flexDirection: 'row', alignItems: 'center'},
  bookingInfo: {flex: 1, paddingRight: 10},
  bookingName: {fontSize: 13, fontWeight: '700', color: '#344054'},
  bookingDate: {fontSize: 11, color: '#667085', marginTop: 5},
  bookingAmount: {fontSize: 15, fontWeight: '800', color: COLOR.primary},
  centerState: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30},
  stateText: {fontSize: 13, color: '#667085', textAlign: 'center', marginTop: 12},
  errorIcon: {width: 48, height: 48, borderRadius: 24, textAlign: 'center', textAlignVertical: 'center', lineHeight: 48, backgroundColor: '#FDECEC', color: '#D92D20', fontSize: 24, fontWeight: '800'},
  errorTitle: {fontSize: 18, fontWeight: '800', color: '#1D2939', marginTop: 14},
  retryButton: {backgroundColor: COLOR.primary, paddingHorizontal: 24, paddingVertical: 11, borderRadius: 10, marginTop: 20},
  retryText: {color: '#FFF', fontWeight: '700'},
  emptyBox: {alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 28, borderWidth: 1, borderColor: '#EAECF0'},
  emptyTitle: {fontSize: 15, fontWeight: '700', color: '#344054'},
  emptyText: {fontSize: 12, color: '#98A2B3', marginTop: 5},
});

export default PropertyAnalytics;
