import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

import {
  Ionicons,
  AntDesign,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import Consulta from "../services/sqlite/Consulta";
// import User from "../services/sqlite/User";

export default function Home({ route, navigation }) {
  const [listConsultas, setListConsultas] = useState([]);
  // const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetchData();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     fetchData();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  // const fetchData = async () => {
  //   try {
  //     const response = await Consulta.findConsultasByUserId(currentUserId);
  //     const responseUser = await User.find(currentUserId);
  //     setListConsultas(response);
  //     setUserData(responseUser);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleFavorite = async ({ id, name, date, insurance }) => {
    const response = await Consulta.update(id, {
      name,
      date,
      insurance: !insurance,
    });
    // fetchData();
  };

  const handleDelete = async (id) => {
    const response = await Consulta.remove(id);
    if (listConsultas.length == 1) setListConsultas([]);
    // fetchData();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Image source={require("../../assets/splash-hc.gif")} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.subtitle}>
          Clique no botão abaixo para agendar uma consulta
        </Text>
        <TouchableOpacity
          style={styles.addConsulta}
          onPress={() =>
            navigation.navigate("ConsultaRegister", {
              currentUserId: currentUserId,
            })
          }
        >
          <FontAwesome5 name="clipboard-list" size={24} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 18 }}> Agendar +</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.containerCards}>
          {listConsultas && listConsultas.length > 0 ? (
            listConsultas.map((e, idx) => {
              return (
                <View style={styles.card} key={e.id}>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 20,
                      }}
                    >
                      {e.name}
                    </Text>
                    <Text>Data: {e.date}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{ paddingHorizontal: 8 }}
                      onPress={() => handleFavorite(e)}
                    >
                      {e.insurance ? (
                        <Ionicons
                          name="notifications"
                          size={24}
                          color="black"
                        />
                      ) : (
                        <Ionicons
                          name="notifications-off"
                          size={24}
                          color="black"
                        />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ paddingHorizontal: 8 }}
                      onPress={() => handleDelete(e.id)}
                    >
                      <FontAwesome name="trash" size={28} color="#9c2442" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                Nenhuma consulta agendada.
              </Text>
            </View>
          )}
        </View>
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
    color: "#1f9117",
    fontSize: 18,
    textAlign: "center",
  },
  addConsulta: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    borderColor: "#178791",
    backgroundColor: "#178791",
    padding: 10,
    margin: 20,
    alignSelf: "center",
  },
  card: {
    flex: 1,
    width: "80%",
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 10,
    padding: 10,
    borderColor: "#1f9117",
  },
  containerCards: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
});
