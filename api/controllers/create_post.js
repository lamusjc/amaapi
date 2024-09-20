"use strict";
const fs = require("fs");
const Validator = require("fastest-validator");
const _validator = new Validator();
module.exports = function (req, res) {
  var response = {};

  const schema = {
    selectedValue: {
      type: "number",
      optional: false,
    },
    title: {
      type: "string",
      min: 1,
      max: 100,
      optional: false,
    },
    description: {
      type: "string",
      min: 1,
      max: 500,
      optional: false,
    },
    price: {
      type: "number",
      min: 1,
      optional: false,
    },
    quantity: {
      type: "number",
      min: 1,
      optional: false,
    },
    b64: {
      type: "string",
      optional: true,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      selectedValue: req.body.selectedValue,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      b64: req.body.b64,
    }) !== true
  ) {
    let validaciones = check({
      selectedValue: req.body.selectedValue,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      b64: req.body.b64,
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
    var category_id = req.body.selectedValue;
    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var b64 = req.body.b64;
    var url = null;
    if (!b64) {
      createPost();
    } else {
      var base64Image = b64.split(";base64,").pop();
      var date = Date.now();
      var url_register = "uploads/images/" + date + ".png";
      fs.writeFile(url_register, base64Image, { encoding: "base64" }, function (
        err,
        data
      ) {
        url = "images/" + date + ".png";
        createPost();
      });
    }

    function createPost() {
      var query =
        "INSERT INTO posts(users_id, category_id, posts_title, posts_description, posts_price, posts_created_at, posts_quantity, posts_image, posts_deleted) VALUES (?,?,?,?,?,?,?,?, false)";
      var query2 = "SELECT now()";

      connection.query(query2, function (error2, result2, field2) {
        if (error2) {
          response = {
            status: 500,
            message: "Internal Server Error2",
          };

          res.status(response.status);
          return res.json(response);
        } else {
          connection.query(
            query,
            [
              req.userId,
              category_id,
              title,
              description,
              price,
              result2[0]["now()"],
              quantity,
              url,
            ],
            function (error, result, fields) {
              if (error) {
                response = {
                  status: 500,
                  message: "Unknown Error1",
                };
                res.status(response.status);
                return res.json(response);
              } else {
                response = {
                  status: 200,
                  message: "Post created!",
                };
                res.status(response.status);
                return res.json(response);
              }
            }
          );
        }
      });
    }
  }
};
