import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import Button from "../components/Button";
import { Entypo } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const bcrypt = require("bcryptjs");

const loginSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
});

export default function Login({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorUser, setErrorUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
        <Image source={require("../../assets/healthcheck-loading1.gif")} />
      </View>
    );
  }

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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../assets/health-check-logo.png")}
                  resizeMode="contain"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                  }}
                />
              </View>
              <Text style={styles.title}>Health Check</Text>
              <Text style={styles.subtitle}>Conferindo sua saúde diária!</Text>
            </View>

            <View style={styles.main}>
              <Formik
                validationSchema={loginSchema}
                initialValues={{ email: "", password: "" }}
                onSubmit={async ({ email, password }) => {
                  try {
                    setLoading(true);
                    const response = await axios.get(`users/email/${email}`);

                    const { password_hash, id } = response.data;

                    if (await bcrypt.compareSync(password, password_hash)) {
                      navigation.navigate("Home", { currentUserId: id });
                      setErrorUser(null);
                      setLoading(false);
                    } else {
                      setErrorUser("Senha incorreta");
                      setLoading(false);
                    }
                  } catch (err) {
                    console.log(err);
                    setErrorUser("Usuário não existe");
                    setLoading(false);
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
                      E-mail{" "}
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
                    />
                    <Text style={styles.inputTitle}>
                      Senha{" "}
                      {touched.password && errors.password ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        secureTextEntry={passwordVisible ? false : true}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                      />
                      <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <Entypo name="eye" size={32} color="#19CEDB" />
                        ) : (
                          <Entypo
                            name="eye-with-line"
                            size={32}
                            color="#19CEDB"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    {errorUser && (
                      <Text
                        style={{
                          fontSize: 20,
                          color: "red",
                          textAlign: "center",
                        }}
                      >
                        {errorUser}
                      </Text>
                    )}
                    <Button title="Entrar" onPress={handleSubmit} />

                    <Text style={{ textAlign: "center" }}>
                      Não possui uma conta?
                    </Text>
                    <Button
                      title="Cadastre-se"
                      outline={true}
                      onPress={() => navigation.navigate("Register")}
                    />
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
  errorText: {
    color: "crimson",
  },
});
