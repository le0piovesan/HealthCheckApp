import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("healthcheck.db");

export default db;
