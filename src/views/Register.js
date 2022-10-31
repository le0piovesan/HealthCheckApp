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
// import usuario from "../services/sqlite/usuario";
import * as yup from "yup";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const registerSchema = yup.object({
  nome: yup.string().required(),
  usuario: yup.string().required(),
  cpf: yup.string().required(),
  celular: yup.string().required(),
  email: yup.string().required(),
  senha: yup.string().required(),
});

export default function Register({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

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
              initialValues={{
                nome: "",
                usuario: "",
                cpf: "",
                celular: "",
                email: "",
                senha: "",
              }}
              onSubmit={async ({
                nome,
                usuario,
                cpf,
                celular,
                email,
                senha,
              }) => {
                try {
                  const response = await axios.post("pessoa", {
                    nome,
                    usuario,
                    cpf,
                    celular,
                    email,
                    senha,
                    data_nascimento: date,
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
                    {touched.nome && errors.nome ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("nome")}
                    onBlur={handleBlur("nome")}
                    value={values.nome}
                  />

                  <Text style={styles.inputTitle}>
                    Usuário{" "}
                    {touched.usuario && errors.usuario ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("usuario")}
                    onBlur={handleBlur("usuario")}
                    value={values.usuario}
                  />

                  <Text style={styles.inputTitle}>
                    CPF
                    {touched.cpf && errors.cpf ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
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
                    Celular
                    {touched.celular && errors.celular ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("celular")}
                    onBlur={handleBlur("celular")}
                    value={values.celular}
                    keyboardType="numeric"
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
                    keyboardType={"email-address"}
                  />

                  <TouchableOpacity onPress={() => setShow(true)}>
                    <Text
                      style={{
                        color: "#1f9117",
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
                  )}

                  <Text style={styles.inputTitle}>
                    Senha{" "}
                    {touched.senha && errors.senha ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}
                  </Text>

                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("senha")}
                    onBlur={handleBlur("senha")}
                    value={values.senha}
                  />

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
