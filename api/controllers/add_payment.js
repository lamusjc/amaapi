"use strict";
const Validator = require("fastest-validator");
const _validator = new Validator();
module.exports = function (req, res) {
  var response = {};
  const schema = {
    cart: {
      type: "array",
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      cart: req.body.cart,
    }) !== true
  ) {
    let validaciones = check({
      cart: req.body.cart,
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
    var cart = req.body.cart;

    var query = "INSERT INTO payment(payment_status) VALUES('Pending')";
    var query2 = "SELECT * FROM payment ORDER BY payment_id DESC";
    var query3 = "INSERT INTO payment_cart(cart_id, payment_id) VALUES(?, ?)";
    var query4 = "UPDATE cart SET cart_status = 1 WHERE cart_id = ?";
    connection.query(query, function (error, result, fields) {
      if (error) {
        response = {
          status: 500,
          message: "Unknown Error 1",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        connection.query(query2, function (error2, result2, fields2) {
          if (error2) {
            response = {
              status: 500,
              message: "Unknown Error 2",
            };
            res.status(response.status);
            return res.json(response);
          } else {
            cart.map((value, i) => {
              connection.query(
                query3,
                [value.cart_id, result2[0].payment_id],
                function (error3, result3, fields3) {
                  if (error3) {
                    response = {
                      status: 500,
                      message: "Unknown Error 3",
                    };
                    res.status(response.status);
                    return res.json(response);
                  } else {
                    if (cart.length - 1 == i) {
                      cart.map((value, i) => {
                        connection.query(query4, [value.cart_id], function (
                          error4,
                          result4,
                          fields4
                        ) {
                          if (error4) {
                            response = {
                              status: 500,
                              message: "Unknown Error 3",
                            };
                            res.status(response.status);
                            return res.json(response);
                          } else {
                            if (cart.length - 1 == i) {
                              response = {
                                status: 200,
                                message: "Payment created!",
                              };
                              res.status(response.status);
                              return res.json(response);
                            }
                          }
                        });
                      });
                    }
                  }
                }
              );
            });
          }
        });
      }
    });
  }
};
