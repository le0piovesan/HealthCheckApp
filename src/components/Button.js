import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function Button({ title, outline, ...props }) {
  return (
    <TouchableOpacity
      {...props}
      style={outline ? styles.outline : styles.container}
    >
      <Text style={outline ? styles.textOutline : styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#19CEDB",
  },
  outline: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderWidth: 3,
    borderColor: "#19CEDB",
  },
  text: {
    color: "#f7f7f7",
    fontWeight: "bold",
    fontSize: 20,
  },
  textOutline: {
    color: "#19CEDB",
    fontWeight: "bold",
    fontSize: 20,
  },
});
