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

const Appointments = sequelize.define(
  "appointments",
  {
    appointment_date: { type: Sequelize.DATE },
    return: { type: Sequelize.BOOLEAN },
    status: { type: Sequelize.STRING },
    professional_id: { type: Sequelize.INTEGER },
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

app.get("/appointments", function (req, res) {
  Appointments.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/appointments/:id", function (req, res) {
  Appointments.findOne({ where: { id: req.params.id } }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.post("/appointments", function (req, res) {
  Appointments.create({
    appointment_date: req.body.appointment_date,
    return: req.body.return,
    status: req.body.status,
    professional_id: req.body.professional_id,
    clinic_id: req.body.clinic_id,
    created_at: Date.now(),
    updated_at: Date.now(),
  }).then((data) => {
    res.send({
      appointment_date: req.body.appointment_date,
      return: req.body.return,
      status: req.body.status,
      professional_id: req.body.professional_id,
      clinic_id: req.body.clinic_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  });
});

app.listen(3210, () => {
  console.log("Server rodando na porta 3210");
});
