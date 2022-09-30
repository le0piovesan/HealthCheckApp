import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import { Entypo } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Health Check</Text>
        <Text style={styles.subtitle}>
          Encontre o que sua saúde procura hoje!
        </Text>
      </View>

      <View style={styles.main}>
        <Text style={styles.inputTitle}>Usuário</Text>
        <TextInput style={styles.input} />

        <Text style={styles.inputTitle}>Senha</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.input}
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

        <Button title="Entrar" onPress={() => navigation.navigate("Home")} />
        <Text style={{ textAlign: "center" }}>Não possui uma conta?</Text>
        <Button
          title="Cadastre-se"
          outline={true}
          onPress={() => navigation.navigate("Register")}
        />
      </View>
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
    justifyContent: "center",
    padding: 10,
  },
  inputTitle: { fontSize: 16 },
  input: {
    height: 35,
    width: 200,
    margin: 12,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
});
