"use strict";

module.exports = function (req, res) {
  var response = {};

  if (req.admin) {
    var query = "select *from payment";
  } else {
    var query =
      "SELECT * FROM payment " +
      "inner join payment_cart on payment.payment_id = payment_cart.payment_id " +
      "inner join cart on payment_cart.cart_id = cart.cart_id " +
      "where cart.users_id = ? " +
      "group by payment.payment_id";
  }

  connection.query(query, [req.userId], function (error, result, fields) {
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
};
