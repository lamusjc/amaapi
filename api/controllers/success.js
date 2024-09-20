"use strict";
const paypal = require("paypal-rest-sdk");

module.exports = function (req, res) {
  // res.send("Success");
  var PayerID = req.query.PayerID;
  var paymentId = req.query.paymentId;

  var execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "1.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      throw error;
    } else {
      // console.log("Get Payment Response");
      // console.log(JSON.stringify(payment));
      res.render("success");
    }
  });
};
