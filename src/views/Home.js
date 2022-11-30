import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
} from "react-native";
import Button from "../components/Button";

import { parseISO, format } from "date-fns";

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import axios from "axios";

export default function Home({ route, navigation }) {
  const { currentUserId } = route.params;

  const [listAppointments, setListAppointments] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const responseClient = await axios.get(`clients/user/${currentUserId}`);
      setClientData(responseClient.data);
      if (responseClient.data.id) {
        try {
          const responseAppointments = await axios.get(
            `appointments/clients/${responseClient.data.id}`
          );

          const predefinedData = responseAppointments.data;

          predefinedData.sort(
            (a, b) => a.appointment_date < b.appointment_date
          );

          setListAppointments(predefinedData);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.log(err);
      setClientData("NOT_CLIENT");
    }
  };

  const confirmarConsulta = (id) => {
    Alert.alert(
      "Health Check",
      "Tem certeza que deseja confirmar a consulta?",
      [
        {
          text: "Sim",
          onPress: async () => {
            try {
              const response = await axios.patch(`appointments/${id}`, {
                status: "Concluída",
              });
              console.log(response.data);
              setModalVisible(null);
              await fetchData();
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          text: "Voltar",
        },
      ],
      { cancelable: false }
    );
  };

  const cancelarConsulta = (id) => {
    Alert.alert(
      "Health Check",
      "Tem certeza que deseja cancelar a consulta?",
      [
        {
          text: "Sim",
          onPress: async () => {
            try {
              const response = await axios.patch(`appointments/${id}`, {
                status: "Cancelada",
              });
              console.log(response.data);
              setModalVisible(null);
              await fetchData();
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          text: "Voltar",
        },
      ],
      { cancelable: false }
    );
  };

  return (
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
        {clientData === "NOT_CLIENT" ? (
          <View>
            <Text style={styles.title}>Bem vindo</Text>
            <Text style={styles.subtitle}>
              Para começar a agendar consultas é necessário finalizar seu
              cadastro, precisamos de mais alguns dados
            </Text>
            <Button
              title="Finalizar cadastro de cliente"
              onPress={() =>
                navigation.navigate("ClienteRegister", {
                  currentUserId: currentUserId,
                })
              }
            />
          </View>
        ) : (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/client.png")}
                resizeMode={"contain"}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text style={styles.title}>
                {" "}
                {clientData &&
                  clientData.user.name[0].toUpperCase() +
                    clientData.user.name.substring(1)}
              </Text>
            </View>
            <Text style={styles.subtitle}>
              {"\n"}Clique no botão abaixo para agendar uma consulta
            </Text>
            <TouchableOpacity
              style={styles.addConsulta}
              onPress={() =>
                navigation.navigate("ConsultaRegister", {
                  currentClientId: clientData.id,
                  currentUserId: currentUserId,
                })
              }
            >
              <FontAwesome5 name="clipboard-list" size={24} color="#f7f7f7" />
              <Text style={{ color: "#f7f7f7", fontSize: 18 }}> Agendar +</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView>
          <View style={styles.containerCards}>
            {listAppointments && listAppointments.length > 0 ? (
              listAppointments.map((e, idx) => {
                return (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      width: "100%",
                      borderWidth: 1,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                      margin: 10,
                      padding: 10,
                      borderColor: "#19CEDB",
                      opacity: e.status !== "Pendente" ? 0.5 : 1,
                      backgroundColor:
                        e.status === "Concluída"
                          ? "#2bd115"
                          : e.status === "Cancelada"
                          ? "#9c2432"
                          : "transparent",
                    }}
                    key={e.id}
                    onPress={() => setModalVisible(e)}
                  >
                    <Image
                      source={require("../../assets/professional.png")}
                      resizeMode={"contain"}
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 3,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {e.professional.user.name}{" "}
                        {e.professional.user.last_name}
                      </Text>

                      <Text>
                        Data da consulta:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {format(parseISO(e.appointment_date), "dd/MM/yyyy", {
                            timeZone: "America/Sao_Paulo",
                          })}
                        </Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 8,
                        alignItems: "center",
                        opacity: e.status !== "Pendente" ? 0.8 : 1,
                      }}
                      disabled={e.status !== "Pendente"}
                    >
                      {e.status === "Pendente" ? (
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

                      <Text style={{ textAlign: "center" }}>
                        Consulta{"\n"}
                        {e.status}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
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

        {modalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible ? true : false}
            onRequestClose={() => setModalVisible(null)}
          >
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setModalVisible(null)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                style={{ alignSelf: "center" }}
              >
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={25}
                  color="#000"
                />
              </TouchableOpacity>

              <Text style={{ textAlign: "center" }}>Detalhes da consulta:</Text>
              <Image
                source={require("../../assets/clinic.png")}
                resizeMode={"contain"}
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 3,
                }}
              />
              <Text style={styles.textDetails}>
                Nome da clínica:{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {modalVisible.clinic.corporate_name}
                </Text>
              </Text>
              <Text style={styles.textDetails}>
                Data da consulta:{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {format(
                    parseISO(modalVisible.appointment_date),
                    "dd/MM/yyyy",
                    {
                      timeZone: "America/Sao_Paulo",
                    }
                  )}
                </Text>
              </Text>
              <Text style={styles.textDetails}>
                Profissional que irá realizar a consulta:{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {modalVisible.professional.user.name}{" "}
                  {modalVisible.professional.user.last_name}
                </Text>
              </Text>

              <Text style={styles.textDetails}>
                Convênio:{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {modalVisible.clinic.health_insurance
                    ? modalVisible.clinic.health_insurance
                    : "Particular"}
                </Text>
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 8,
                    alignItems: "center",
                    opacity: modalVisible.status !== "Pendente" ? 0.2 : 1,
                  }}
                  disabled={modalVisible.status !== "Pendente"}
                  onPress={() => confirmarConsulta(modalVisible.id)}
                >
                  <MaterialCommunityIcons
                    name="book"
                    size={30}
                    color="#2bd115"
                  />
                  <Text style={{ textAlign: "center" }}>
                    Já fui a{"\n"}Consulta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 8,
                    alignItems: "center",
                    opacity: modalVisible.status !== "Pendente" ? 0.2 : 1,
                  }}
                  disabled={modalVisible.status !== "Pendente"}
                  onPress={() => cancelarConsulta(modalVisible.id)}
                >
                  <MaterialCommunityIcons
                    name="book-cancel"
                    size={30}
                    color="#9c2432"
                  />
                  <Text style={{ textAlign: "center" }}>
                    Não Posso{"\n"}Comparecer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  addConsulta: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#178791",
    backgroundColor: "#178791",
    padding: 10,
    margin: 20,
    alignSelf: "center",
  },
  containerCards: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  modalView: {
    flex: 1,
    elevation: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 2,
    borderColor: "#178791",
    padding: 16,
    backgroundColor: "#f0f0f0",
    marginTop: "70%",
  },
  textDetails: {
    fontSize: 18,
    paddingVertical: 5,
  },
});
