"use strict";

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "testingmovilamazon@gmail.com",
      pass: "testing*123",
    },
  });

  const schema = {
    name: {
      type: "string",
      optional: false,
      max: 20,
    },
    lastname: {
      type: "string",
      optional: false,
      max: 20,
    },
    email: {
      type: "string",
      pattern: new RegExp(
        "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$"
      ),
      optional: false,
      max: 100,
    },
    password: { type: "string", min: 1, max: 60, optional: false },
    admin: { type: "boolean", optional: false },
  };

  const check = _validator.compile(schema);

  if (
    check({
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.username.toLowerCase().trim(),
      password: req.body.password,
      admin: req.body.admin,
    }) !== true
  ) {
    let validaciones = check({
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.username.toLowerCase().trim(),
      password: req.body.password,
      admin: req.body.admin,
    });
    let message = "";
    validaciones.map((value, i) => {
      if (i == validaciones.length - 1) {
        message = message + value.field;
      } else {
        message = message + value.field + ", ";
      }
    });
    response = {
      data: validaciones,
      message: `Error validators fields: ${message}. Verify!`,
      status: 400,
    };
    res.status(response.status);
    return res.json(response);
  } else {
    var name = req.body.name;
    var lastname = req.body.lastname;
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var admin = req.body.admin;
    var users_code = generateCode();

    var mailOptions = {
      from: "Remitente",
      to: username,
      subject: "Codigo para Registro en Ama Movil",
      text: "Tu codigo para registrar es: " + users_code,
    };

    var query =
      "INSERT INTO users(users_name, users_lastname, users_username, users_password, users_admin, users_registered, users_code) VALUES (?,?,?,?,?,?,?)";

    var query2 = "SELECT *FROM USERS where users_username = ?";

    //Verificamos si el usuario existe o no
    connection.query(query2, [username], function (error, result, fields) {
      if (error) {
        response = {
          status: 500,
          message: "Unknown Error",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        //Preguntamos si esta vacio, si lo esta lo registra
        if (result.length == 0) {
          connection.query(
            query,
            [
              name,
              lastname,
              username,
              bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
              admin,
              false,
              users_code,
            ],
            function (error, result, fields) {
              if (error) {
                response = {
                  status: 500,
                  message: "Error Interno del Servidor",
                };
                res.status(response.status);
                return res.json(response);
              } else {
                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) {
                    response = {
                      status: 500,
                      message: err.message,
                    };
                    res.status(response.status);
                    return res.json(response);
                  } else {
                    response = {
                      status: 200,
                      message: "Check your email for verify using code!",
                    };
                    res.status(response.status);
                    return res.json(response);
                  }
                });
              }
            }
          );
          //Si es mayor a 0, quiere decir que hay datos guardados
        } else {
          response = {
            status: 409,
            message: "Users exists",
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    });
  }
};

function generateCode() {
  let code = "";

  do {
    code += crypto.randomBytes(3).readUIntBE(0, 3);
    // code += Number.parseInt(randomBytes(3).toString("hex"), 16);
  } while (code.length < 6);

  return code.slice(0, 6);
}
