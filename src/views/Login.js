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
} from "react-native";
import Button from "../components/Button";
import { Entypo } from "@expo/vector-icons";
import User from "../services/sqlite/User";
import { Formik } from "formik";
import * as yup from "yup";

const loginSchema = yup.object({
  user: yup.string().required(),
  password: yup.string().required(),
});

export default function Login({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorUser, setErrorUser] = useState(null);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
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
                source={require("../../assets/logo-hc.png")}
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
              initialValues={{ user: "", password: "" }}
              onSubmit={async ({ user, password }) => {
                try {
                  const response = await User.findByUserName(user);
                  const currentUser = response.find((u) => u.user === user);
                  if (
                    currentUser.user === user &&
                    currentUser.password === password
                  ) {
                    navigation.navigate("Home", {
                      currentUserName: currentUser.name,
                      currentUserId: currentUser.id,
                    });
                    setErrorUser(null);
                  } else setErrorUser("Senha incorreta");
                } catch (err) {
                  setErrorUser("Usuário não existe");
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
                    Usuário{" "}
                    {touched.user && errors.user ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("user")}
                    onBlur={handleBlur("user")}
                    value={values.user}
                  />
                  <Text style={styles.inputTitle}>
                    Senha{" "}
                    {touched.password && errors.password ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
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
                        <Entypo name="eye" size={32} color="#1f9117" />
                      ) : (
                        <Entypo
                          name="eye-with-line"
                          size={32}
                          color="#1f9117"
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
