"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};

  const schema = {
    username: {
      type: "string",
      pattern: new RegExp(
        "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$"
      ),
      optional: false,
      max: 100,
    },
    users_code: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      username: req.body.username.toLowerCase().trim(),
      users_code: Number(req.body.users_code),
    }) !== true
  ) {
    let validaciones = check({
      username: req.body.username.toLowerCase().trim(),
      users_code: Number(req.body.users_code),
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
    var username = req.body.username.toLowerCase().trim();
    var users_code = req.body.users_code;

    var query =
      "UPDATE users SET users_registered = true WHERE users_username = ?";

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
        //Si existe validamos el codigo
        if (result.length > 0) {
          if (result[0].users_code == users_code) {
            connection.query(query, [username], function (
              error,
              result,
              fields
            ) {
              if (error) {
                response = {
                  status: 500,
                  message: "Error Interno del Servidor",
                };
                res.status(response.status);
                return res.json(response);
              } else {
                response = {
                  status: 200,
                  message: "Verified code!",
                };
                res.status(response.status);
                return res.json(response);
              }
            });
          } else {
            response = {
              status: 404,
              message: "Wrong code!",
            };
            res.status(response.status);
            return res.json(response);
          }

          //Si no es que no existe
        } else {
          response = {
            status: 404,
            message: "Users doesn't exists",
          };
          res.status(response.status);
          return res.json(response);
        }
      }
    });
  }
};
