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
import User from "../services/sqlite/User";
import { Entypo } from "@expo/vector-icons";
import * as yup from "yup";

const registerSchema = yup.object({
  name: yup.string().required(),
  user: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
});

export default function Register({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.subtitle}>
              Criar uma conta é fácil e rápido!
            </Text>
          </View>

          <View style={styles.main}>
            <Formik
              validationSchema={registerSchema}
              initialValues={{ name: "", user: "", email: "", password: "" }}
              onSubmit={({ name, email, user, password }) => {
                User.create({ name, email, user, password })
                  .then((id) => {
                    console.log("User created with id: " + id);
                    navigation.navigate("Login");
                  })
                  .catch((err) => console.log(err));
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
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />

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
                    E-mail
                    {touched.email && errors.email ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
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
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      secureTextEntry={passwordVisible ? false : true}
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

                  <Button title="Cadastrar" onPress={handleSubmit} />
                </View>
              )}
            </Formik>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ textAlign: "center" }}>Voltar</Text>
            </TouchableOpacity>
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
    padding: 10,
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
    textAlign: "right",
  },
});
