import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLOR } from "../Constants/Colors";

const KeyValueInput = ({ onChange }) => {
  const [pairs, setPairs] = useState([{ key: "", value: "" }]);

  const handleChange = (index, field, newValue) => {
    const updatedPairs = [...pairs];
    updatedPairs[index][field] = newValue;
    setPairs(updatedPairs);
    if (onChange) onChange(updatedPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { key: "", value: "" }]);
  };

  const removePair = (index) => {
    const updatedPairs = pairs.filter((_, i) => i !== index);
    setPairs(updatedPairs.length ? updatedPairs : [{ key: "", value: "" }]);
    if (onChange) onChange(updatedPairs);
  };

  return (
    <View style={styles.container}>
      {pairs.map((pair, index) => (
        <View key={index} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Key"
            value={pair.key}
            onChangeText={(text) => handleChange(index, "key", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Value"
            value={pair.value}
            onChangeText={(text) => handleChange(index, "value", text)}
          />

          <View style={styles.btnGroup}>
            {pairs.length > 1 && (
              <TouchableOpacity style={[styles.btn, styles.removeBtn]} onPress={() => removePair(index)}>
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
            )}
            {index === pairs.length - 1 && (
              <TouchableOpacity style={[styles.btn, styles.addBtn]} onPress={addPair}>
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default KeyValueInput;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    alignSelf:'center'
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: "#fff",
    borderColor:COLOR?.primary
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: COLOR?.primary,
    marginLeft: 4,
  },
  removeBtn: {
    backgroundColor: "red",
  },
  btnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
