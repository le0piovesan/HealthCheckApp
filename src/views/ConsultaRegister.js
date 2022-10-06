import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Button from "../components/Button";
import { Formik } from "formik";
import Consulta from "../services/sqlite/Consulta";
import Checkbox from "expo-checkbox";

export default function ConsultaRegister({ route, navigation }) {
  const { currentUserId } = route.params;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.subtitle}>
              Cadastre abaixo o tipo de consulta que procura:
            </Text>
          </View>

          <View style={styles.main}>
            <Formik
              initialValues={{ name: "", date: "", insurance: false }}
              onSubmit={({ name, date, insurance }) => {
                Consulta.create({
                  name,
                  date,
                  insurance,
                  userReference: currentUserId,
                })
                  .then((id) => {
                    console.log("Consulta created with id: " + id);
                    navigation.navigate("Home", {
                      currentUserId: currentUserId,
                    });
                  })
                  .catch((err) => console.log(err));
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
              }) => (
                <View>
                  <Text style={styles.inputTitle}>Especialidade:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />

                  <Text style={styles.inputTitle}>Data desejada:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("date")}
                    onBlur={handleBlur("date")}
                    value={values.date}
                    keyboardType="numeric"
                  />

                  <View style={styles.section}>
                    <Text style={styles.inputTitle}>
                      Possui plano de saúde?
                    </Text>

                    <Checkbox
                      color="#1f9117"
                      style={styles.checkbox}
                      value={values.insurance}
                      onValueChange={(nextValue) =>
                        setFieldValue("insurance", nextValue)
                      }
                    />
                  </View>

                  <Button title="Cadastrar" onPress={handleSubmit} />
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    color: "#1f9117",
    fontSize: 18,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  inputTitle: { fontSize: 16 },
  input: {
    flex: 1,
    height: 35,
    width: "100%",
    margin: 8,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 15,
    height: 30,
    width: 30,
    borderRadius: 20,
  },
});
