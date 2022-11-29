import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";

axios.defaults.baseURL = "http://192.168.1.7:3210";

// axios.defaults.baseURL = "http://192.168.116.17:3210";

// axios.defaults.baseURL = "http://192.168.10.146:3210";

process.env.LANG = "pt-BR.utf8";

// Páginas
import Login from "./src/views/Login";
import Register from "./src/views/Register";
import Home from "./src/views/Home";
import ConsultaRegister from "./src/views/ConsultaRegister";
import ClienteRegister from "./src/views/ClienteRegister";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: "Login",
              headerStyle: {
                backgroundColor: "#19CEDB",
              },
              headerTintColor: "#f7f7f7",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: "Se Registrar",
              headerStyle: {
                backgroundColor: "#19CEDB",
              },
              headerTintColor: "#f7f7f7",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "Minha Agenda",
              headerStyle: {
                backgroundColor: "#19CEDB",
              },
              headerTintColor: "#f7f7f7",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="ConsultaRegister"
            component={ConsultaRegister}
            options={{
              title: "Nova Consulta",
              headerStyle: {
                backgroundColor: "#19CEDB",
              },
              headerTintColor: "#f7f7f7",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="ClienteRegister"
            component={ClienteRegister}
            options={{
              title: "Finalizar Cadastro",
              headerStyle: {
                backgroundColor: "#19CEDB",
              },
              headerTintColor: "#f7f7f7",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <StatusBar style="auto" />
    </>
  );
}
