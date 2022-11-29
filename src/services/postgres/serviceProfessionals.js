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

const Professionals = sequelize.define(
  "professionals",
  {
    cnpj: { type: Sequelize.STRING },
    professional_record: { type: Sequelize.STRING },
    user_id: { type: Sequelize.INTEGER },
    clinic_id: { type: Sequelize.INTEGER },
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

app.get("/professionals", function (req, res) {
  Professionals.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/professionals/:id", function (req, res) {
  Professionals.findOne({ where: { id: req.params.id } }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.listen(3210, () => {
  console.log("Server rodando na porta 3210");
});
