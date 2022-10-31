const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:admin@localhost:5432/HealthCheck"
);

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

const Pessoa = sequelize.define(
  "pessoa",
  {
    nome: { type: Sequelize.STRING },
    usuario: { type: Sequelize.STRING },
    cpf: { type: Sequelize.STRING },
    celular: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    senha: { type: Sequelize.STRING },
    data_nascimento: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

app.get("/pessoa", function (req, res) {
  Pessoa.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/pessoa/:usuario", function (req, res) {
  Pessoa.findOne({ where: { usuario: req.params.usuario } }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.post("/pessoa", function (req, res) {
  Pessoa.create({
    nome: req.body.nome,
    usuario: req.body.usuario,
    cpf: req.body.cpf,
    celular: req.body.celular,
    email: req.body.email,
    senha: req.body.senha,
    data_nascimento: req.body.data_nascimento,
  }).then((data) => {
    res.send({
      nome: req.body.nome,
      usuario: req.body.usuario,
      cpf: req.body.cpf,
      celular: req.body.celular,
      email: req.body.email,
      senha: req.body.senha,
      data_nascimento: req.body.data_nascimento,
    });
  });
});

app.listen(3210, () => {
  console.log("Server rodando na porta 3210");
});
