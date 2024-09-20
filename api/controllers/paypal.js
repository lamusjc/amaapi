"use strict";
const paypal = require("paypal-rest-sdk");

module.exports = function (req, res) {
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "https://amaapi-steph.herokuapp.com/success",
      cancel_url: "https://amaapi-steph.herokuapp.com/cancel",
    },
    transactions: [
      {
        // item_list: {
        //   items: [
        //     {
        //       name: "item",
        //       sku: "item",
        //       price: "5.00",
        //       currency: "USD",
        //       quantity: 1,
        //     },
        //   ],
        // },
        amount: {
          currency: "USD",
          total: req.query.price,
        },
        description: "This is the payment description.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      // console.log("Create Payment Response");
      // console.log(payment);
      res.redirect(payment.links[1].href);
    }
  });
};
