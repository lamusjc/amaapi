"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  const schema = {
    payment_id: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      payment_id: req.body.payment_id,
    }) !== true
  ) {
    let validaciones = check({
      payment_id: req.body.payment_id,
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
    var payment_id = req.body.payment_id;

    if (req.admin == false) {
      response = {
        message: "You are not prepare for be admin!",
        status: 401,
      };
      res.status(response.status);
      return res.json(response);
    }

    var query =
      "UPDATE payment SET payment_status = 'Complete' WHERE payment_id = ?";

    connection.query(query, [payment_id], function (error, result, fields) {
      if (error) {
        response = {
          status: 500,
          message: "Internal Server Error",
        };

        res.status(response.status);
        return res.json(response);
      } else {
        response = {
          status: 200,
          message: "Success",
          data: result,
        };

        res.status(response.status);
        return res.json(response);
      }
    });
  }
};
