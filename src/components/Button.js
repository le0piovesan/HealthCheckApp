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
    backgroundColor: "#1f9117",
  },
  outline: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#1f9117",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  textOutline: {
    color: "#1f9117",
    fontWeight: "bold",
  },
});
