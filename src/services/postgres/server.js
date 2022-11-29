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
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

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
    client_id: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

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

const Specialties = sequelize.define(
  "specialties",
  {
    description: { type: Sequelize.STRING },
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

const ProfessionalSpecialties = sequelize.define(
  "professional_specialties",
  {
    professional_id: { type: Sequelize.INTEGER },
    specialty_id: { type: Sequelize.INTEGER },
    created_at: { type: Sequelize.DATE },
    updated_at: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
    modelName: "singularName",
    freezeTableName: true,
  }
);

const Clients = sequelize.define(
  "clients",
  {
    cpf: { type: Sequelize.STRING },
    rg: { type: Sequelize.STRING },
    birth_date: { type: Sequelize.DATE },
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

Appointments.belongsTo(Professionals, {
  foreignKey: "professional_id",
  allowNull: false,
});
Appointments.belongsTo(Clinics, {
  foreignKey: "clinic_id",
  allowNull: false,
});
Appointments.belongsTo(Clients, {
  foreignKey: "client_id",
  allowNull: false,
});

Clinics.belongsTo(Users, {
  foreignKey: "user_id",
  allowNull: false,
});

Professionals.belongsTo(Users, {
  foreignKey: "user_id",
  allowNull: false,
});
Professionals.belongsTo(Clinics, {
  foreignKey: "clinic_id",
  allowNull: false,
});

ProfessionalSpecialties.belongsTo(Professionals, {
  foreignKey: "professional_id",
  allowNull: false,
});
ProfessionalSpecialties.belongsTo(Specialties, {
  foreignKey: "specialty_id",
  allowNull: false,
});

Clients.belongsTo(Users, {
  foreignKey: "user_id",
  allowNull: false,
});

// ======================================================== USUARIOS ========================================================

app.get("/users", function (req, res) {
  Users.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/users/email/:email", function (req, res) {
  Users.findOne({ where: { email: req.params.email } }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.get("/users/:id", function (req, res) {
  Users.findOne({ where: { id: req.params.id } }).then((data) => {
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
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  });
});

// ======================================================== CONSULTAS ========================================================

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

app.get("/appointments/clients/:id", function (req, res) {
  Appointments.findAll({
    where: { client_id: req.params.id },
    include: [
      {
        model: Clinics,
        required: true,
        attributes: ["corporate_name", "health_insurance"],
      },
      {
        model: Professionals,
        required: true,
        attributes: ["user_id"],
        include: [
          {
            model: Users,
            required: true,
            attributes: ["name", "last_name"],
          },
        ],
      },
    ],
  }).then((data) => {
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
    client_id: req.body.client_id,
    created_at: Date.now(),
    updated_at: Date.now(),
  }).then((data) => {
    res.send({
      appointment_date: req.body.appointment_date,
      return: req.body.return,
      status: req.body.status,
      professional_id: req.body.professional_id,
      clinic_id: req.body.clinic_id,
      client_id: req.body.client_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  });
});

app.patch("/appointments/:id", function (req, res) {
  Appointments.update(
    {
      status: req.body.status,
    },
    { where: { id: req.params.id } }
  ).then((data) => {
    res.send({
      status: req.body.status,
    });
  });
});

// ======================================================== CLINICAS ========================================================

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

// ======================================================== PROFISSIONAIS ========================================================

app.get("/professionals", function (req, res) {
  Professionals.findAll({
    include: [
      {
        model: Users,
        required: true,
        attributes: ["name", "last_name"],
      },
    ],
  }).then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/professionals/:id", function (req, res) {
  Professionals.findAll({
    where: { id: req.params.id },
    include: [
      {
        model: Users,
        required: true,
        attributes: ["name", "last_name"],
      },
    ],
  }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

// ======================================================== CLIENTES ========================================================

app.get("/clients", function (req, res) {
  Clients.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/clients/user/:id", function (req, res) {
  Clients.findOne({
    where: { user_id: req.params.id },
    include: [
      {
        model: Users,
        required: true,
        attributes: ["name", "last_name"],
      },
    ],
  }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.post("/clients", function (req, res) {
  Clients.create({
    cpf: req.body.cpf,
    rg: req.body.rg,
    birth_date: req.body.birth_date,
    user_id: req.body.user_id,
    created_at: Date.now(),
    updated_at: Date.now(),
  }).then((data) => {
    res.send({
      cpf: req.body.cpf,
      rg: req.body.rg,
      birth_date: req.body.birth_date,
      user_id: req.body.user_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  });
});

// ======================================================== ESPECIALIDADES ========================================================

app.get("/professional_specialties", function (req, res) {
  ProfessionalSpecialties.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/professional_specialties/:id", function (req, res) {
  ProfessionalSpecialties.findOne({ where: { id: req.params.id } }).then(
    (data) => {
      console.log(data);
      if (data === null) res.sendStatus(404);
      else res.send(data);
    }
  );
});

app.get("/professional_specialties/specialty/:id", function (req, res) {
  ProfessionalSpecialties.findAll({
    where: { specialty_id: req.params.id },
    include: [
      {
        model: Professionals,
        required: true,
        attributes: ["user_id"],
        include: [
          {
            model: Users,
            required: true,
            attributes: ["name", "last_name"],
          },
        ],
      },
    ],
  }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.get("/specialties", function (req, res) {
  Specialties.findAll().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/specialties/:id", function (req, res) {
  Specialties.findOne({ where: { id: req.params.id } }).then((data) => {
    console.log(data);
    if (data === null) res.sendStatus(404);
    else res.send(data);
  });
});

app.listen(3210, () => {
  console.log("Server rodando na porta 3210");
});
