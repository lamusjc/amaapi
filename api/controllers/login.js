"use strict";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
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
    email: {
      type: "string",
      pattern: new RegExp(
        "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$"
      ),
      optional: false,
      max: 100,
    },
    password: { type: "string", min: 1, max: 60, optional: false },
  };

  const check = _validator.compile(schema);

  if (
    check({
      email: req.body.username.toLowerCase().trim(),
      password: req.body.password,
    }) !== true
  ) {
    let validaciones = check({
      email: req.body.username.toLowerCase().trim(),
      password: req.body.password,
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
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var users_code = "";
    var mailOptions = {
      from: "Remitente",
      to: username,
      subject: "Codigo para Registro en Ama Movil",
      text: "Tu codigo para registrar es: " + users_code,
    };

    var query = "SELECT *FROM users WHERE users_username = ?;";

    connection.query(query, [username, password], function (
      error,
      result,
      fields
    ) {
      if (error) {
        response = {
          status: 500,
          message: "Internal Server Error",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        if (result.length > 0) {
          if (result[0].users_registered) {
            if (bcrypt.compareSync(password, result[0].users_password)) {
              const token = jwt.sign(
                {
                  users_id: result[0].users_id,
                  username: req.body.username,
                  admin: result[0].users_admin,
                },
                config.secret,
                {
                  algorithm: "HS256",
                  expiresIn: 60 * 60 * 24,
                }
              );
              req.session.users_id = result[0].users_id;
              req.session.save();

              response = {
                status: 200,
                message: "Success",
                data: { token },
              };

              res.status(response.status);
              return res.json(response);
            } else {
              response = {
                status: 404,
                message: "Wrong password!",
              };
              res.status(response.status);
              return res.json(response);
            }
          } else {
            users_code = result[0].users_code;
            mailOptions.text = "Tu codigo para registrar es: " + users_code;
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
                  status: 405,
                  message: "Please verify your e-mail using code sent!",
                };
                res.status(response.status);
                return res.json(response);
              }
            });
          }
        } else {
          response = {
            status: 403,
            message: "User doesn't exists!",
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    });

    console.log("Metodo POST-LOGIN realizado.");
  }
};
