import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import {Calendar} from 'react-native-calendars';

const ADVANCE_PAYMENT_MESSAGE =
  '⚠️ Your booking is not confirmed until the advance payment is successfully made to the vendor. Please contact the number above to proceed with the payment and secure your booking';

const SLOT_OPTIONS = ['day', 'night', 'full_day'];

const parseArray = value => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const parseDates = value => {
  if (value && typeof value === 'object') {
    return value;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      return {};
    }
  }
  return {};
};

const isDateKey = date =>
  /^\d{2}\/\d{2}\/\d{4}$/.test(date) || /^\d{4}-\d{2}-\d{2}$/.test(date);

const formatDateToISO = date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const [day, month, year] = date.split('/');
  return `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`;
};

const normalizeSlot = slot =>
  String(slot || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
const getSlotsForDate = value =>
  String(value || '')
    .split(',')
    .map(normalizeSlot)
    .filter(Boolean);

const isSlotRestricted = (slot, restrictedSlots) => {
  const fullDayBooked = restrictedSlots.includes('full_day');
  const partialDayBooked =
    restrictedSlots.includes('day') || restrictedSlots.includes('night');
  return (
    fullDayBooked ||
    restrictedSlots.includes(slot) ||
    (slot === 'full_day' && partialDayBooked)
  );
};

const buildUnavailableDates = (dates, availabilitySummary, datesData) => {
  const embeddedDateRecords = [];
  const unavailable = Object.entries(parseDates(dates)).reduce(
    (result, [date, value]) => {
      if (isDateKey(date) && typeof value === 'string') {
        result[date] = value;
      }
      if (value && typeof value === 'object' && value.date) {
        embeddedDateRecords.push(value);
      }
      return result;
    },
    {},
  );

  [...embeddedDateRecords, ...parseArray(datesData)].forEach(dateData => {
    const bookedSlots = parseArray(dateData?.slots)
      .filter(slot => String(slot?.status || '').toLowerCase() === 'booked')
      .map(slot => slot?.event_time)
      .filter(Boolean);
    const slots = bookedSlots.length
      ? bookedSlots
      : [dateData?.event_time].filter(Boolean);
    slots.forEach(slot => {
      if (!isDateKey(dateData?.date)) {
        return;
      }
      const current = getSlotsForDate(unavailable[dateData.date]);
      const next = normalizeSlot(slot);
      unavailable[dateData.date] = [...new Set([...current, next])].join(',');
    });
  });

  availabilitySummary?.booked_dates_list?.forEach(date => {
    if (isDateKey(date) && !unavailable[date]) {
      unavailable[date] = 'full_day';
    }
  });
  return unavailable;
};

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const parseBookingDate = value => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const dateText = String(value).trim();
  const dateOnly = dateText.split(/[T\s]/)[0];
  const isoMatch = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const localMatch = dateOnly.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);

  if (isoMatch) {
    return new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3]),
    );
  }

  if (localMatch) {
    return new Date(
      Number(localMatch[3]),
      Number(localMatch[2]) - 1,
      Number(localMatch[1]),
    );
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

const isUpcomingBooking = booking => {
  const bookingDate = parseBookingDate(booking?.booking_date);
  // Keep records with an unknown date instead of accidentally hiding them.
  if (!bookingDate) {
    return true;
  }

  return bookingDate >= getStartOfToday();
};

// Enable Layout Animation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getStatusTheme = status => {
  switch (status) {
    case 'accepted':
    case 'success':
      return {backgroundColor: '#E8F7EE', color: '#167A3E'};
    case 'cancelled':
    case 'rejected':
      return {backgroundColor: '#FDECEC', color: '#B42318'};
    default:
      return {backgroundColor: '#FFF4E5', color: '#B54708'};
  }
};

const DetailRow = ({label, value}) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{String(value)}</Text>
    </View>
  );
};

export const BookingCard = ({
  booking,
  onUpdateService,
  onEdit,
  onReject,
  actionLoading,
}) => {
  const [expanded, setExpanded] = useState(false);
  const normalizedStatus = String(booking?.order_status || '').toLowerCase();
  const isSuccessStatus = normalizedStatus === 'success';
  const isPendingStatus = normalizedStatus === 'pending';
  const isClosedStatus = ['cancelled', 'rejected', 'failed'].includes(
    normalizedStatus,
  );
  const statusTheme = getStatusTheme(normalizedStatus);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };
  const hall = booking?.property || booking?.convention_hall;
  const venueName =
    hall?.title ||
    hall?.hotel_name ||
    hall?.name ||
    booking?.hotel?.name ||
    booking?.hotel?.hotel_name ||
    booking?.property?.title ||
    booking?.property?.name;

  const vendorMobile =
    hall?.contact_number ||
    hall?.phone_number ||
    hall?.contact_number ||
    hall?.mobile_number ||
    hall?.user?.phone_number ||
    booking?.vendor?.phone_number ||
    booking?.vendor_phone_number ||
    booking?.vendor_mobile_number;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={{
            uri:
              hall?.images?.[0]?.image_url ||
              booking?.convention_hall?.type_images?.[0]?.image_url ||
              hall?.image_url ||
              'https://via.placeholder.com/80',
          }}
          style={styles.image}
        />
        <View style={styles.headerContent}>
          {venueName ? (
            <View style={styles.venueBox}>
              <Text style={styles.venueLabel}>Venue</Text>
              <Text style={styles.venueName}>{venueName}</Text>
            </View>
          ) : null}
          <Text style={styles.orderId}>Order #{booking?.id || '—'}</Text>
          <Text style={styles.price}>
            ₹{booking.total_amount || booking.amount || '0'}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: statusTheme.backgroundColor},
          ]}>
          <Text style={[styles.status, {color: statusTheme.color}]}>
            {booking.order_status || 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailsTitle}>Booking details</Text>
        <DetailRow label="Customer" value={booking.full_name} />
        <DetailRow label="Date" value={booking.booking_date} />
        <DetailRow label="Event time" value={booking.event_time} />
        <DetailRow
          label="Guests"
          value={booking.number_of_attendees ?? booking.number_of_attendess}
        />
        <DetailRow label="Address" value={booking.address || 'N/A'} />
        <DetailRow label="Rejection reason" value={booking.rejection_note} />
        {isSuccessStatus ? (
          <>
            <DetailRow
              label="Mobile"
              value={booking.mobile ?? booking.mobail_number}
            />
            <DetailRow
              label="Alternate mobile"
              value={booking.alternate ?? booking.alt_number}
            />
            {vendorMobile ? (
              <View style={styles.vendorMobileBox}>
                <Text style={styles.vendorMobileLabel}>Vendor Mobile</Text>
                <Text style={styles.vendorMobileText}>{vendorMobile}</Text>
              </View>
            ) : null}
          </>
        ) : null}
        {isPendingStatus && vendorMobile ? (
          <>
            <View style={styles.vendorMobileBox}>
              <Text style={styles.vendorMobileLabel}>Vendor Mobile</Text>
              <Text style={styles.vendorMobileText}>{vendorMobile}</Text>
            </View>
            <Text style={styles.advancePaymentMessage}>
              {ADVANCE_PAYMENT_MESSAGE}
            </Text>
          </>
        ) : null}
      </View>

      {/* Services Section - Expandable */}
      <TouchableOpacity onPress={toggleExpand} style={styles.expandToggle}>
        <Text style={styles.sectionTitle}>Services Required</Text>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.servicesSection}>
          {[
            {
              label: 'Catering Needed',
              key: 'catering_needed',
              legacyKey: 'catering_needed',
            },
            {
              label: 'Chef Needed',
              key: 'chef_needed',
              legacyKey: 'chef_needed',
            },
            {
              label: 'Photographer Needed',
              key: 'photographer_needed',
              legacyKey: 'photograper_needed',
            },
            {
              label: 'Groceries Needed',
              key: 'groceries_needed',
              legacyKey: 'groceries_needed',
            },
            {
              label: 'Decorations Needed',
              key: 'decoration_needed',
              legacyKey: 'decore_needed',
            },
          ].map(service => (
            <View style={styles.serviceRow} key={service.key}>
              <Text style={styles.serviceLabel}>{service.label}:</Text>
              <View style={styles.toggleGroup}>
                {/* YES Button */}
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    (booking?.services?.[service.key] === true ||
                      booking[service.legacyKey] === 1) &&
                      styles.selectedYes,
                  ]}
                  onPress={() =>
                    onUpdateService(booking.id, service.legacyKey, 1)
                  }>
                  <Text
                    style={[
                      styles.toggleText,
                      (booking?.services?.[service.key] === true ||
                        booking[service.legacyKey] === 1) &&
                        styles.selectedText,
                    ]}>
                    Yes
                  </Text>
                </TouchableOpacity>

                {/* NO Button */}
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    (booking?.services?.[service.key] === false ||
                      booking[service.legacyKey] === 0) &&
                      styles.selectedNo,
                  ]}
                  onPress={() =>
                    onUpdateService(booking.id, service.legacyKey, 0)
                  }>
                  <Text
                    style={[
                      styles.toggleText,
                      (booking?.services?.[service.key] === false ||
                        booking[service.legacyKey] === 0) &&
                        styles.selectedText,
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {booking.comment ? (
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Comment:</Text>
              <Text style={[styles.serviceValue, styles.flexOne]}>
                {booking.comment}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {!isClosedStatus ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(booking)}
            disabled={Boolean(actionLoading)}>
            <Text style={styles.editButtonText}>Edit booking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => onReject(booking)}
            disabled={Boolean(actionLoading)}>
            {actionLoading === `reject-${booking.id}` ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.rejectButtonText}>Cancel booking</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const MyBooking = ({navigation}) => {
  const isFocus = navigation.isFocused();
  const {getRequest, postRequest, putRequest} = useApi();
  const [loader, setLoader] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [rejectModal, setRejectModal] = useState({
    visible: false,
    booking: null,
  });
  const [rejectReason, setRejectReason] = useState('');
  const [editModal, setEditModal] = useState({visible: false, booking: null});
  const [editForm, setEditForm] = useState({});
  const [unavailableDates, setUnavailableDates] = useState({});
  const [calendarLoading, setCalendarLoading] = useState(false);
  const {showToast} = useToast();
  // Fetch bookings
  const getBooking = async (pageNum = 1, append = false) => {
    if (pageNum > lastPage && append) {
      return;
    }
    if (append) {
      setLoadingMore(true);
    } else {
      setLoader(true);
    }

    await getRequest(`public/api/payment_list?page=${pageNum}`)
      .then(res => {
        if (res?.success) {
          console.log(res.data, 'REWWWWW');

          const apiData = res.data;
          setLastPage(apiData.last_page);
          setPage(apiData.current_page);
          const upcomingBookings = (apiData.data || []).filter(
            isUpcomingBooking,
          );
          if (append) {
            setBookings(prev => [...prev, ...upcomingBookings]);
          } else {
            setBookings(upcomingBookings);
          }
        } else {
          showToast(res?.error || 'Failed to fetch bookings', 'error');
        }
      })
      .catch(err => {
        console.error('Booking Error:', err);
        showToast('An error occurred while fetching bookings', 'error');
      })
      .finally(() => {
        setLoader(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    if (isFocus) {
      setPage(1);
      getBooking(1, false);
    }
    // API context methods are not referentially stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus]);

  const loadMore = () => {
    if (!loadingMore && page < lastPage) {
      getBooking(page + 1, true);
    }
  };
  const onUpdateService = async (bookingId, field, value) => {
    try {
      // Find the booking object to get current states of all services
      const currentBooking = bookings.find(b => b.id === bookingId);

      if (!currentBooking) {
        return;
      }

      const serviceFields = [
        'groceries_needed',
        'decore_needed',
        'photograper_needed',
        'chef_needed',
        'catering_needed',
      ];
      const formData = new FormData();

      // Append each field once. The selected field must replace its old value;
      // appending it twice can make the API read the earlier null value.
      serviceFields.forEach(serviceField => {
        const normalizedServiceKey =
          {
            decore_needed: 'decoration_needed',
            photograper_needed: 'photographer_needed',
          }[serviceField] || serviceField;
        const serviceValue =
          serviceField === field
            ? value
            : currentBooking[serviceField] ??
              Number(Boolean(currentBooking?.services?.[normalizedServiceKey]));

        formData.append(serviceField, serviceValue ?? '');
      });

      const response = await postRequest(
        `public/api/book-property/update-order/${bookingId}`,
        formData,
        true, // <- If your API expects form-data
      );
      if (response.success) {
        showToast(
          response?.data?.message || 'Service updated successfully',
          'success',
        );
        getBooking(1, false);
      } else {
        showToast(response?.error || 'Failed to update service', 'error');
      }
    } catch (err) {
      console.error('Update Service Error:', err);
      showToast('Error updating service', 'error');
    }
  };

  const getRestrictedSlots = date => {
    const matchedDate = Object.keys(unavailableDates).find(
      item => formatDateToISO(item) === date,
    );
    return matchedDate ? getSlotsForDate(unavailableDates[matchedDate]) : [];
  };

  const getEditableRestrictedSlots = date => {
    const slots = getRestrictedSlots(date);
    const originalDate = editModal.booking?.booking_date;
    const originalSlot = normalizeSlot(editModal.booking?.event_time);
    if (date === originalDate && originalSlot) {
      return slots.filter(slot => slot !== originalSlot);
    }
    return slots;
  };

  const selectEditDate = day => {
    const slots = getEditableRestrictedSlots(day.dateString);
    updateEditField('booking_date', day.dateString);
    if (isSlotRestricted(editForm.event_time, slots)) {
      const availableSlot = SLOT_OPTIONS.find(
        slot => !isSlotRestricted(slot, slots),
      );
      updateEditField('event_time', availableSlot || '');
    }
  };

  const fetchAvailability = async booking => {
    const propertyId = booking?.property?.id || booking?.property_id;
    if (!propertyId) {
      setUnavailableDates({});
      return;
    }
    setCalendarLoading(true);
    const response = await getRequest(`public/api/hall-timings/${propertyId}`);
    if (response?.success && response?.data?.status) {
      const data = response.data.data || {};
      const hallData = data.convention_hall || {};
      setUnavailableDates(
        buildUnavailableDates(
          hallData.dates,
          hallData.availability_summary || data.availability_summary,
          [...parseArray(hallData.dates_data), ...parseArray(data.dates_data)],
        ),
      );
    } else {
      setUnavailableDates({});
      showToast('Could not load unavailable booking dates', 'error');
    }
    setCalendarLoading(false);
  };

  const openEditModal = booking => {
    const bookingDate = booking?.booking_date || '';
    const eventTime = normalizeSlot(booking?.event_time) || 'day';
    setEditForm({
      booking_date: bookingDate,
      event_time: eventTime,
      number_of_attendess: String(
        booking?.number_of_attendees ?? booking?.number_of_attendess ?? '',
      ),
      full_name: booking?.full_name || '',
      mobail_number: booking?.mobile ?? booking?.mobail_number ?? '',
      alt_number: booking?.alternate ?? booking?.alt_number ?? '',
    });
    setUnavailableDates({});
    setEditModal({visible: true, booking});
    fetchAvailability(booking);
  };

  const closeEditModal = () => {
    if (!actionLoading) {
      setEditModal({visible: false, booking: null});
    }
  };

  const updateEditField = (field, value) => {
    setEditForm(current => ({...current, [field]: value}));
  };

  const submitEdit = async () => {
    const bookingId = editModal.booking?.id;
    if (!bookingId) {
      return;
    }
    if (
      !editForm.booking_date.trim() ||
      !editForm.full_name.trim() ||
      !editForm.event_time
    ) {
      showToast('Name, booking date and event time are required', 'error');
      return;
    }
    if (
      isSlotRestricted(
        editForm.event_time,
        getEditableRestrictedSlots(editForm.booking_date),
      )
    ) {
      showToast('This date and time slot is unavailable', 'error');
      return;
    }

    setActionLoading(`edit-${bookingId}`);
    const payload = {
      ...editForm,
      number_of_attendess: Number(editForm.number_of_attendess) || 0,
    };
    const response = await putRequest(
      `public/api/payment/edit/${bookingId}`,
      payload,
    );

    if (response.success) {
      showToast(
        response?.data?.message || 'Booking updated successfully',
        'success',
      );
      setEditModal({visible: false, booking: null});
      await getBooking(1, false);
    } else {
      showToast(response?.error || 'Failed to update booking', 'error');
    }
    setActionLoading('');
  };

  const openRejectModal = booking => {
    setRejectReason('');
    setRejectModal({visible: true, booking});
  };

  const submitReject = async () => {
    const bookingId = rejectModal.booking?.id;
    if (!rejectReason.trim()) {
      showToast('Please enter a cancellation reason', 'error');
      return;
    }

    setActionLoading(`reject-${bookingId}`);
    const formData = new FormData();
    formData.append('reason', rejectReason.trim());
    const response = await postRequest(
      `public/api/payments/${bookingId}/reject`,
      formData,
      true,
    );

    if (response.success) {
      showToast(
        response?.data?.message || 'Booking cancelled successfully',
        'success',
      );
      setRejectModal({visible: false, booking: null});
      setBookings(current =>
        current.map(item =>
          item.id === bookingId ? {...item, order_status: 'cancelled'} : item,
        ),
      );
    } else {
      showToast(response?.error || 'Failed to cancel booking', 'error');
    }
    setActionLoading('');
  };

  return (
    <View style={styles.container}>
      <Header
        title={'My Bookings'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={bookings}
        keyExtractor={item => item.id?.toString()}
        renderItem={({item}) => (
          <BookingCard
            booking={item}
            onUpdateService={onUpdateService}
            onEdit={openEditModal}
            onReject={openRejectModal}
            actionLoading={actionLoading}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          !loader && bookings.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loader ? (
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" color={COLOR.primary} />
              <Text style={styles.loadingText}>Loading your bookings…</Text>
            </View>
          ) : (
            <View style={styles.emptyView}>
              <Text style={styles.emptyTitle}>No upcoming bookings</Text>
              <Text style={styles.emptyText}>
                Your new venue bookings will appear here.
              </Text>
            </View>
          )
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={COLOR.primary}
              style={styles.footerLoader}
            />
          ) : null
        }
      />

      <Modal
        visible={rejectModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModal({visible: false, booking: null})}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancel booking?</Text>
            <Text style={styles.modalDescription}>
              Tell the venue why you need to cancel this booking.
            </Text>
            <TextInput
              style={[styles.input, styles.reasonInput]}
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Enter cancellation reason"
              placeholderTextColor="#98A2B3"
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                disabled={Boolean(actionLoading)}
                onPress={() => setRejectModal({visible: false, booking: null})}>
                <Text style={styles.secondaryButtonText}>Keep booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.dangerButton]}
                disabled={Boolean(actionLoading)}
                onPress={submitReject}>
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Cancel booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={editModal.visible}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.modalCard, styles.editModalCard]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit booking</Text>
                <Text style={styles.modalDescription}>
                  Update your booking information.
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeEditModal}
                disabled={Boolean(actionLoading)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Full name *</Text>
              <TextInput
                style={styles.input}
                value={editForm.full_name}
                onChangeText={value => updateEditField('full_name', value)}
                placeholder="Full name"
              />
              <Text style={styles.inputLabel}>Booking date *</Text>
              <View style={styles.calendarBox}>
                {calendarLoading ? (
                  <View style={styles.calendarLoader}>
                    <ActivityIndicator color={COLOR.primary} />
                    <Text style={styles.calendarLoaderText}>
                      Checking availability…
                    </Text>
                  </View>
                ) : (
                  <Calendar
                    minDate={new Date().toISOString().split('T')[0]}
                    onDayPress={selectEditDate}
                    markedDates={{
                      ...Object.keys(unavailableDates).reduce(
                        (result, date) => {
                          const isoDate = formatDateToISO(date);
                          const slots = getEditableRestrictedSlots(isoDate);
                          const disabled =
                            slots.includes('full_day') ||
                            slots.includes('booked') ||
                            (slots.includes('day') && slots.includes('night'));
                          result[isoDate] = {
                            disabled,
                            disableTouchEvent: disabled,
                            marked: true,
                            dotColor: '#D92D20',
                          };
                          return result;
                        },
                        {},
                      ),
                      [editForm.booking_date]: {
                        selected: true,
                        selectedColor: COLOR.primary,
                      },
                    }}
                    theme={{
                      todayTextColor: COLOR.primary,
                      selectedDayBackgroundColor: COLOR.primary,
                      arrowColor: COLOR.primary,
                    }}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Event time *</Text>
              <View style={styles.slotRow}>
                {SLOT_OPTIONS.map(option => {
                  const restricted = isSlotRestricted(
                    option,
                    getEditableRestrictedSlots(editForm.booking_date),
                  );
                  return (
                    <TouchableOpacity
                      key={option}
                      disabled={restricted}
                      onPress={() => updateEditField('event_time', option)}
                      style={[
                        styles.slotButton,
                        editForm.event_time === option && styles.selectedSlot,
                        restricted && styles.disabledSlot,
                      ]}>
                      <Text
                        style={[
                          styles.slotText,
                          editForm.event_time === option &&
                            styles.selectedSlotText,
                          restricted && styles.disabledSlotText,
                        ]}>
                        {option.replace('_', ' ').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.inputLabel}>Number of guests</Text>
              <TextInput
                style={styles.input}
                value={editForm.number_of_attendess}
                onChangeText={value =>
                  updateEditField('number_of_attendess', value)
                }
                keyboardType="number-pad"
                placeholder="100"
              />
              <View style={styles.inputPair}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Mobile number</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.mobail_number}
                    onChangeText={value =>
                      updateEditField('mobail_number', value)
                    }
                    keyboardType="phone-pad"
                    placeholder="Mobile"
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Alternate number</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.alt_number}
                    onChangeText={value => updateEditField('alt_number', value)}
                    keyboardType="phone-pad"
                    placeholder="Optional"
                  />
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={closeEditModal}
                disabled={Boolean(actionLoading)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={submitEdit}
                disabled={Boolean(actionLoading)}>
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Save changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default MyBooking;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F6F7F9'},
  listContent: {padding: 16, paddingBottom: 32},
  emptyListContent: {flex: 1},
  loadingView: {paddingTop: 90, alignItems: 'center'},
  loadingText: {
    marginTop: 12,
    color: '#667085',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {fontSize: 18, fontWeight: '700', color: '#101828'},
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#667085',
    textAlign: 'center',
  },
  footerLoader: {marginVertical: 15},
  card: {
    borderWidth: 1,
    borderColor: '#EAECF0',
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#101828',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
  },
  image: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: '#F2F4F7',
  },
  headerContent: {flex: 1, marginLeft: 12},
  venueBox: {
    marginBottom: 4,
  },
  venueLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLOR.primary,
    textTransform: 'uppercase',
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  orderId: {fontSize: 12, color: '#98A2B3', marginTop: 2},
  price: {
    fontSize: 14,
    color: COLOR.primary,
    fontWeight: '700',
    marginTop: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  details: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#344054',
    marginBottom: 7,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {flex: 0.4, fontSize: 14, color: '#667085'},
  detailValue: {
    flex: 0.6,
    fontSize: 14,
    fontWeight: '500',
    color: '#101828',
    textAlign: 'right',
  },
  vendorMobileBox: {
    marginTop: 8,
    marginBottom: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F2C6C8',
    backgroundColor: '#FFF7F7',
  },
  vendorMobileLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.primary,
    marginBottom: 2,
  },
  vendorMobileText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  advancePaymentMessage: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#8a5a00',
    fontWeight: '600',
  },
  expandToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  expandIcon: {
    fontSize: 18,
    color: '#444',
  },
  servicesSection: {
    padding: 12,
    backgroundColor: '#fdfdfd',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceLabel: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  toggleGroup: {
    flexDirection: 'row',
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  selectedYes: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  selectedNo: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  toggleText: {
    fontSize: 14,
    color: '#444',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  serviceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  flexOne: {flex: 1},
  actionRow: {
    flexDirection: 'row',
    padding: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    marginRight: 6,
    backgroundColor: '#FFF7F7',
    borderWidth: 1,
    borderColor: '#E7B3B5',
  },
  rejectButton: {marginLeft: 6, backgroundColor: COLOR.primary},
  editButtonText: {color: COLOR.primary, fontSize: 14, fontWeight: '700'},
  rejectButtonText: {color: '#fff', fontSize: 14, fontWeight: '700'},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 40, 0.55)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {backgroundColor: '#fff', borderRadius: 18, padding: 20},
  editModalCard: {maxHeight: '90%'},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {fontSize: 20, fontWeight: '700', color: '#101828'},
  modalDescription: {
    fontSize: 14,
    color: '#667085',
    marginTop: 5,
    marginBottom: 16,
  },
  closeButton: {fontSize: 20, color: '#667085', paddingHorizontal: 4},
  inputLabel: {
    color: '#344054',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#101828',
    backgroundColor: '#fff',
    fontSize: 14,
    marginBottom: 14,
  },
  reasonInput: {minHeight: 110},
  inputPair: {flexDirection: 'row', justifyContent: 'space-between'},
  inputHalf: {width: '48.5%'},
  calendarBox: {
    borderWidth: 1,
    borderColor: '#EAECF0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  calendarLoader: {
    minHeight: 290,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarLoaderText: {
    color: '#667085',
    fontSize: 13,
    marginTop: 10,
  },
  slotRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  slotButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#fff',
  },
  selectedSlot: {
    borderColor: COLOR.primary,
    backgroundColor: COLOR.primary,
  },
  disabledSlot: {
    borderColor: '#EAECF0',
    backgroundColor: '#F2F4F7',
  },
  slotText: {
    color: '#344054',
    fontSize: 11,
    fontWeight: '700',
  },
  selectedSlotText: {color: '#fff'},
  disabledSlotText: {color: '#98A2B3'},
  modalActions: {flexDirection: 'row', marginTop: 4},
  modalButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {borderWidth: 1, borderColor: '#D0D5DD', marginRight: 6},
  dangerButton: {backgroundColor: '#B42318', marginLeft: 6},
  saveButton: {backgroundColor: COLOR.primary, marginLeft: 6},
  secondaryButtonText: {color: '#344054', fontSize: 14, fontWeight: '700'},
  primaryButtonText: {color: '#fff', fontSize: 14, fontWeight: '700'},
});
