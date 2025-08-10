import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLOR } from '../Constants/Colors';
import { windowWidth } from '../Constants/Dimensions';

const CustomButton = ({ title, onPress, style, textStyle, loading }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            {
                loading ?
                    <ActivityIndicator size={"small"} color={COLOR.white} />
                    : <Text style={[styles.buttonText, textStyle]}>{title}</Text>
            }
        </TouchableOpacity>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOR.royalBlue,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth / 1.2,
        alignSelf: "center"
    },
    buttonText: {
        color: COLOR.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
