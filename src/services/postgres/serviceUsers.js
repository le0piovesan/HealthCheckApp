const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:admin@localhost:5432/HealthCheck"
);

const bcrypt = require("bcryptjs");
const saltRounds = 10;

app.use(bodyParser.json());
app.use(cors());

sequelize
  .authenticate()
  .then(() => {
    console.log("Autenticado PostgreSQL");
  })
  .catch((err) => {
    console.error("Erro de autenticação PostgreSQL:", err);
  });

const Users = sequelize.define(
  "users",
  {
    name: { type: Sequelize.STRING },
    last_name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password_hash: { type: Sequelize.STRING },
    password_salt: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    client: { type: Sequelize.BOOLEAN },
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

app.get("/users", function (req, res) {
  Users.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/users/:email", function (req, res) {
  Users.findOne({ where: { email: req.params.email } }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.post("/users", function (req, res) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  Users.create({
    name: req.body.name,
    last_name: req.body.last_name,
    email: req.body.email,
    password_hash: hash,
    password_salt: salt,
    phone: req.body.phone,
    client: req.body.client,
    created_at: Date.now(),
    updated_at: Date.now(),
  }).then((data) => {
    res.send({
      name: req.body.name,
      last_name: req.body.last_name,
      email: req.body.email,
      password_hash: hash,
      password_salt: salt,
      phone: req.body.phone,
      client: req.body.client,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  });
});

app.listen(3210, () => {
  console.log("Server rodando na porta 3210");
});
