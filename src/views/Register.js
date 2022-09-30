import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import { Formik } from "formik";
import User from "../services/sqlite/User";
import { Entypo } from "@expo/vector-icons";

export default function Register({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Health Check</Text>
        <Text style={styles.subtitle}>Crie uma conta rapidamente</Text>
      </View>

      <ScrollView style={styles.main}>
        <Formik
          initialValues={{ name: "", user: "", email: "", password: "" }}
          onSubmit={({ name, email, user, password }) => {
            User.create({ name, email, user, password })
              .then((id) => console.log("User created with id: " + id))
              .catch((err) => console.log(err));
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <Text style={styles.inputTitle}>Nome</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />

              <Text style={styles.inputTitle}>Usuário</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("user")}
                onBlur={handleBlur("user")}
                value={values.user}
              />

              <Text style={styles.inputTitle}>E-mail</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />

              <Text style={styles.inputTitle}>Senha</Text>

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
                    <Entypo name="eye" size={32} color="green" />
                  ) : (
                    <Entypo name="eye-with-line" size={32} color="green" />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    color: "#0b661f",
    fontSize: 18,
  },
  main: {
    flex: 1,
    padding: 10,
    // justifyContent: "center",
  },
  inputTitle: { fontSize: 16 },
  input: {
    height: 35,
    width: 260,
    margin: 12,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
});
