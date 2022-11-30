import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
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
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import axios from "axios";
import { format } from "date-fns";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerSchema = yup.object({
  appointment_date: yup.date().required(),
  isReturn: yup.boolean().required(),
  status: yup.string().required(),
  professional_id: yup.number().required(),
  clinic_id: yup.number().required(),
  client_id: yup.number().required(),
});

export default function ConsultaRegister({ route, navigation }) {
  const { currentClientId, currentUserId } = route.params;

  const [status, setStatus] = useState("Pendente");
  const [listSpecialties, setListSpecialties] = useState([]);
  const [specialtie, setSpecialtie] = useState(null);
  const [listProfessionals, setListProfessionals] = useState([]);
  const [professional, setProfessional] = useState(null);
  const [listClinics, setListClinics] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "HealthCheck - Consulta 📬💊",
        body: "Sua consulta começa daqui a pouco!",
        data: { data: "goes here" },
      },
      trigger: { seconds: 5 },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  useEffect(() => {
    getSpecialties();

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const getSpecialties = async () => {
    try {
      const response = await axios.get("specialties");

      setListSpecialties(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfessionalSpecialtie = async (specialty_id) => {
    try {
      const response = await axios.get(
        `professional_specialties/specialty/${specialty_id}`
      );
      setListProfessionals(response.data);
      await getClinicas();
    } catch (error) {
      console.log(error);
    }
  };

  const getClinicas = async () => {
    try {
      const response = await axios.get("clinics");
      setListClinics(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const ref = useRef(null);

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
            <View style={styles.main}>
              <Formik
                innerRef={ref}
                validationSchema={registerSchema}
                initialValues={{
                  appointment_date: date,
                  isReturn: false,
                  status: "Pendente",
                  professional_id: "",
                  clinic_id: "",
                  client_id: currentClientId,
                }}
                onSubmit={async ({ isReturn }) => {
                  if (specialtie != null && listProfessionals.length > 0) {
                    try {
                      const response = await axios.post("appointments", {
                        appointment_date: date,
                        return: isReturn,
                        status: status,
                        professional_id: professional,
                        clinic_id: clinic,
                        client_id: currentClientId,
                      });

                      await schedulePushNotification();

                      navigation.navigate("Home", {
                        currentUserId: currentUserId,
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      style={styles.containerInput}
                    >
                      <Text
                        style={{
                          color: "#19CEDB",
                          paddingVertical: 10,
                          fontSize: 18,
                        }}
                      >
                        📆 Escolher data da consulta
                      </Text>
                      <Text>
                        {format(new Date(date), "dd/MM/yyyy", {
                          timeZone: "America/Sao_Paulo",
                        })}
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

                    <View style={styles.containerInput}>
                      <View style={styles.section}>
                        <Text style={styles.inputTitle}>Retorno?</Text>

                        <Checkbox
                          color="#19CEDB"
                          style={styles.checkbox}
                          value={values.isReturn}
                          onValueChange={(nextValue) =>
                            setFieldValue("isReturn", nextValue)
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Status:</Text>
                      <Picker
                        style={{
                          height: 40,
                        }}
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) => {
                          setStatus(itemValue);
                          setFieldValue("status", itemValue);
                        }}
                      >
                        <Picker.Item label="Pendente" value="Pendente" />
                        <Picker.Item label="Concluída" value="Concluída" />
                        <Picker.Item label="Cancelada" value="Cancelada" />
                      </Picker>
                    </View>

                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Especialdade:</Text>
                      <Picker
                        style={{
                          height: 40,
                        }}
                        selectedValue={specialtie}
                        onValueChange={(itemValue, itemIndex) => {
                          setSpecialtie(itemValue);
                          getProfessionalSpecialtie(itemValue);
                        }}
                      >
                        <Picker.Item
                          key=""
                          label="-- Selecione --"
                          value={null}
                          enabled={false}
                        />
                        {listSpecialties.map((esp) => {
                          return (
                            <Picker.Item
                              key={esp.id}
                              label={esp.description}
                              value={esp.id}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    {specialtie != null && listProfessionals.length === 0 && (
                      <Text
                        style={{
                          textAlign: "center",
                          color: "crimson",
                        }}
                      >
                        Não foi encontrado nenhum profissional para a
                        especialidade selecionada
                      </Text>
                    )}

                    {listProfessionals.length > 0 && (
                      <>
                        <View style={styles.containerInput}>
                          <Text style={styles.inputTitle}>Clínica:</Text>
                          <Picker
                            style={{
                              height: 40,
                            }}
                            selectedValue={clinic}
                            onValueChange={(itemValue, itemIndex) => {
                              setClinic(itemValue);
                              setFieldValue("clinic_id", itemValue);
                            }}
                          >
                            <Picker.Item
                              key=""
                              label="-- Selecione --"
                              value={null}
                              enabled={false}
                            />
                            {listClinics.map((cli) => {
                              return (
                                <Picker.Item
                                  key={cli.id}
                                  label={cli.corporate_name}
                                  value={cli.id}
                                />
                              );
                            })}
                          </Picker>
                        </View>

                        <View style={styles.containerInput}>
                          <Text style={styles.inputTitle}>Profissional:</Text>
                          <Picker
                            style={{
                              height: 40,
                            }}
                            selectedValue={professional}
                            onValueChange={(itemValue, itemIndex) => {
                              setProfessional(itemValue);
                              setFieldValue("professional_id", itemValue);
                            }}
                          >
                            <Picker.Item
                              key=""
                              label="-- Selecione --"
                              value={null}
                              enabled={false}
                            />
                            {listProfessionals.map((pro) => {
                              return (
                                <Picker.Item
                                  key={pro.professional_id}
                                  label={`${pro.professional.user.name} ${pro.professional.user.last_name}`}
                                  value={pro.professional_id}
                                />
                              );
                            })}
                          </Picker>
                        </View>
                      </>
                    )}

                    <Button title="Cadastrar" onPress={handleSubmit} />
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
    backgroundColor: "#fff",
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
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 5,
    height: 30,
    width: 30,
    borderRadius: 20,
  },
  containerInput: {
    borderWidth: 1,
    padding: 10,
    margin: 3,
    width: "100%",
    borderRadius: 20,
    borderColor: "#19CEDB",
  },
});
