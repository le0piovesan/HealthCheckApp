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

const Clinics = sequelize.define(
  "clinics",
  {
    corporate_name: { type: Sequelize.STRING },
    cnpj: { type: Sequelize.STRING },
    health_insurance: { type: Sequelize.STRING },
    user_id: { type: Sequelize.INTEGER },
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

app.get("/clinics", function (req, res) {
  Clinics.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/clinics/:id", function (req, res) {
  Clinics.findOne({ where: { id: req.params.id } }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.listen(3210, () => {
  console.log("Server rodando na porta 3210");
});
