import React, { useEffect, useState } from "react";
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
import User from "../services/sqlite/User";

const especialidades = [
  { nome: "Otorrinolaringologista" },
  { nome: "Dermatologista" },
  { nome: "Dentista" },
  { nome: "Endócrinologista" },
  { nome: "Cardiologista" },
  { nome: "Outros" },
];

export default function Home({ navigation }) {
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    User.all().then((users) => users.forEach((u) => printUser(u)));
  }, []);

  const printUser = (user) => {
    console.log(
      `id:${user.id}, name:${user.name}, user:${user.user}, email:${user.email}, password:${user.password}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Health Check</Text>
        <Text style={styles.subtitle}>Qual especialidade está procurando?</Text>
      </View>

      <View style={styles.containerCards}>
        {especialidades.map((e, idx) => {
          return (
            <TouchableOpacity style={styles.card} key={idx}>
              <Text>{e.nome}</Text>
            </TouchableOpacity>
          );
        })}
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
  card: {
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderColor: "#0b661f",
  },
  containerCards: {
    flex: 1,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
