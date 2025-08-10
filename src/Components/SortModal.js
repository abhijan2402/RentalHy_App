// Components/SortModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLOR } from '../Constants/Colors';

const SortModal = ({ visible, onClose, onSelectSort }) => {
    const sortOptions = [
        { label: 'Price: Low to High', value: 'price_low_high' },
        { label: 'Price: High to Low', value: 'price_high_low' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Sort Properties</Text>

                    {sortOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.optionButton}
                            onPress={() => {
                                onSelectSort(option.value);
                                onClose();
                            }}
                        >
                            <Text style={styles.optionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SortModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: COLOR.black,
    },
    optionButton: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.lightGrey,
    },
    optionText: {
        fontSize: 16,
        color: COLOR.black,
    },
    closeButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    closeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.red,
    },
});
