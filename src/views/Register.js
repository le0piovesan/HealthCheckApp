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
  ImageBackground,
} from "react-native";
import Button from "../components/Button";
import { Formik } from "formik";
// import usuario from "../services/sqlite/usuario";
import * as yup from "yup";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const registerSchema = yup.object({
  name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  phone: yup.string().required(),
});

export default function Register({ navigation }) {
  // const [date, setDate] = useState(new Date());
  // const [show, setShow] = useState(false);

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate;
  //   setShow(false);
  //   setDate(currentDate);
  // };

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
            <View>
              <Text style={styles.subtitle}>
                Criar uma conta é fácil e rápido!
              </Text>
            </View>

            <View style={styles.main}>
              <Formik
                validationSchema={registerSchema}
                initialValues={{
                  name: "",
                  last_name: "",
                  email: "",
                  password: "",
                  phone: "",
                }}
                onSubmit={async ({
                  name,
                  last_name,
                  email,
                  password,
                  phone,
                }) => {
                  try {
                    const response = await axios.post("users", {
                      name,
                      last_name,
                      email,
                      password,
                      phone,
                    });
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
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <Text style={styles.inputTitle}>
                      Nome{" "}
                      {touched.name && errors.name ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                    />

                    <Text style={styles.inputTitle}>
                      Sobrenome{" "}
                      {touched.last_name && errors.last_name ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("last_name")}
                      onBlur={handleBlur("last_name")}
                      value={values.last_name}
                    />

                    <Text style={styles.inputTitle}>
                      E-mail
                      {touched.email && errors.email ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType={"email-address"}
                    />

                    <Text style={styles.inputTitle}>
                      Celular
                      {touched.phone && errors.phone ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      value={values.phone}
                      keyboardType="numeric"
                    />

                    <Text style={styles.inputTitle}>
                      Senha{" "}
                      {touched.password && errors.password ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                    />

                    {/* <TouchableOpacity onPress={() => setShow(true)}>
                    <Text
                      style={{
                        color: "#19CEDB",
                        paddingVertical: 10,
                        fontSize: 18,
                      }}
                    >
                      📆 Data de Nascimento
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
                  )} */}

                    <Button title="Cadastrar" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ textAlign: "center" }}>Voltar</Text>
              </TouchableOpacity>
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
  errorText: {
    color: "crimson",
    textAlign: "right",
  },
});
