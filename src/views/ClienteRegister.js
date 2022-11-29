import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  TextInput,
} from "react-native";
import Button from "../components/Button";
import { Formik } from "formik";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { format } from "date-fns";

const registerSchema = yup.object({
  cpf: yup.string().required(),
  rg: yup.string().required(),
  birth_date: yup.date().required(),
  user_id: yup.number().required(),
});

export default function ClienteRegister({ route, navigation }) {
  const { currentUserId } = route.params;

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f7f7f7",
        }}
      >
        <Image source={require("../../assets/splash-hc.gif")} />
      </View>
    );
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../../assets/background-app.png")}
          style={{
            flex: 1,
            width: "100%",
            padding: 20,
          }}
          resizeMode="cover"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.main}>
              <Formik
                validationSchema={registerSchema}
                initialValues={{
                  cpf: "",
                  rg: "",
                  birth_date: date,
                  user_id: currentUserId,
                }}
                onSubmit={({ cpf, rg }) => {
                  try {
                    const response = axios.post("clients", {
                      cpf,
                      rg,
                      birth_date: date,
                      user_id: currentUserId,
                    });
                    console.log(response.data);
                    navigation.navigate("Login");
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <Text style={styles.inputTitle}>
                      CPF
                      {touched.cpf && errors.cpf ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("cpf")}
                      onBlur={handleBlur("cpf")}
                      value={values.cpf}
                      keyboardType="numeric"
                    />

                    <Text style={styles.inputTitle}>
                      RG
                      {touched.rg && errors.rg ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("rg")}
                      onBlur={handleBlur("rg")}
                      value={values.rg}
                      keyboardType="numeric"
                    />

                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      style={styles.containerInput}
                    >
                      <Text
                        style={{
                          color: "#19CEDB",
                          paddingVertical: 10,
                          fontSize: 18,
                        }}
                      >
                        📆 Data de nascimento
                      </Text>
                      <Text>
                        {format(new Date(date), "dd/MM/yyyy", {
                          timeZone: "America/Sao_Paulo",
                        })}
                      </Text>
                    </TouchableOpacity>

                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChange}
                      />
                    )}
                    {touched.birth_date && errors.birth_date ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}

                    <Button title="Cadastrar" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    color: "#19CEDB",
    fontSize: 18,
    textAlign: "center",
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
  containerInput: {
    borderWidth: 1,
    padding: 10,
    margin: 3,
    width: "100%",
    borderRadius: 20,
    borderColor: "#19CEDB",
  },
  errorText: {
    color: "crimson",
    textAlign: "right",
  },
});
