import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLOR } from '../Constants/Colors';

const ConfirmationModal = ({
  visible,
  title = 'Are you sure?',
  message,
  icon = '!',
  iconSource,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  loading = false,
  dismissOnBackdrop = true,
  onConfirm,
  onCancel,
}) => {
  const accentColor = destructive ? '#d64545' : COLOR.primary;

  const handleBackdropPress = () => {
    if (dismissOnBackdrop && !loading) {
      onCancel?.();
    }
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="fade"
      visible={visible}
      onRequestClose={handleBackdropPress}>
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${accentColor}14` },
            ]}>
            {iconSource ? (
              <Image source={iconSource} style={styles.iconImage} />
            ) : (
              <Text style={[styles.iconText, { color: accentColor }]}>{icon}</Text>
            )}
          </View>

          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.75}
              disabled={loading}
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.78}
              disabled={loading}
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: accentColor },
                loading && styles.disabledButton,
              ]}
              onPress={onConfirm}>
              {loading ? (
                <ActivityIndicator size="small" color={COLOR.white} />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.58)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    backgroundColor: COLOR.white,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 12,
  },
  iconContainer: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 17,
  },
  iconText: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '800',
  },
  iconImage: {
    width: 31,
    height: 31,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
    color: '#20242a',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#6f7681',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 24,
  },
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  confirmButton: {
    marginLeft: 8,
    shadowColor: '#991b1b',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 7,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.65,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b5260',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.white,
  },
});
