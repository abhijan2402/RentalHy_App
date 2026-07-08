import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../Constants/Colors';

const hasValue = value =>
  value !== undefined &&
  value !== null &&
  value !== '' &&
  value !== 'N/A' &&
  (!Array.isArray(value) || value.length > 0);

const displayValue = value => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }
  return String(value);
};

const AmedSection = ({ title, icon = '✦', data, accent = COLOR.primary }) => {
  const visibleData = data.filter(item => hasValue(item.value));

  if (!visibleData.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: `${accent}14` }]}>
          <Text style={styles.headerIconText}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.card}>
        {visibleData.map((item, index) => {
          const value = displayValue(item.value);
          const isStatus = value === 'Yes' || value === 'No';
          const showBadge = isStatus || item.badge;

          return (
            <View
              key={`${item.label}-${index}`}
              style={[
                styles.row,
                index === visibleData.length - 1 && styles.lastRow,
              ]}>
              <View style={styles.labelWrap}>
                <Text style={styles.itemIcon}>{item.icon || '•'}</Text>
                <Text style={styles.label}>{item.label}</Text>
              </View>
              {showBadge ? (
                <View
                  style={[
                    styles.statusPill,
                    item.badge === 'danger'
                      ? styles.dangerPill
                      : value === 'Yes'
                        ? styles.yesPill
                        : styles.noPill,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      item.badge === 'danger'
                        ? styles.dangerText
                        : value === 'Yes'
                          ? styles.yesText
                          : styles.noText,
                    ]}>
                    {isStatus ? (value === 'Yes' ? '✓ ' : '– ') : ''}
                    {value}
                  </Text>
                </View>
              ) : (
                <Text style={styles.value}>{value}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default AmedSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  headerIconText: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24272d',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e9ebef',
    paddingHorizontal: 13,
    shadowColor: '#172033',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f1f3',
    paddingVertical: 10,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  labelWrap: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 25,
    fontSize: 16,
  },
  label: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#656b76',
    fontWeight: '500',
  },
  value: {
    width: '50%',
    fontSize: 13,
    lineHeight: 19,
    color: '#25282e',
    fontWeight: '600',
    textAlign: 'right',
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  yesPill: {
    backgroundColor: '#e8f7ef',
  },
  noPill: {
    backgroundColor: '#f3f4f6',
  },
  dangerPill: {
    maxWidth: '50%',
    backgroundColor: '#fff0f0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  yesText: {
    color: '#18864b',
  },
  noText: {
    color: '#777d87',
  },
  dangerText: {
    color: '#c24141',
    textAlign: 'right',
  },
});
