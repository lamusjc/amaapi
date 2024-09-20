"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  const schema = {
    posts_id: {
      type: "number",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      posts_id: req.body.posts_id,
    }) !== true
  ) {
    let validaciones = check({
      posts_id: req.body.posts_id,
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
    var posts_id = req.body.posts_id;

    var query =
      "INSERT INTO cart(posts_id, users_id, cart_status) VALUES(?, ?, false)";
    var query2 = "SELECT *FROM cart WHERE posts_id = ? AND users_id = ?";
    connection.query(query2, [posts_id, req.userId], function (
      error2,
      result2,
      fields2
    ) {
      if (error2) {
        response = {
          status: 500,
          message: "Unknown Error 2",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        if (result2.length > 0) {
          response = {
            status: 403,
            message: "Article exists in your cart",
          };

          res.status(response.status);
          return res.json(response);
        } else {
          connection.query(query, [posts_id, req.userId], function (
            error,
            result,
            fields
          ) {
            if (error) {
              response = {
                status: 500,
                message: "Unknown Error 1",
              };
              res.status(response.status);
              return res.json(response);
            } else {
              response = {
                status: 200,
                message: "Added to cart!",
              };
              res.status(response.status);
              return res.json(response);
            }
          });
        }
      }
    });
  }
};
