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
    posts_deleted_description: {
      type: "string",
      min: 1,
      optional: false,
    },
  };

  const check = _validator.compile(schema);

  if (
    check({
      posts_id: req.body.posts_id,
      posts_deleted_description: req.body.posts_deleted_description,
    }) !== true
  ) {
    let validaciones = check({
      posts_id: req.body.posts_id,
      posts_deleted_description: req.body.posts_deleted_description,
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
    var posts_deleted_description = req.body.posts_deleted_description;

    if (req.admin == false) {
      response = {
        message: "You are not prepare for be admin!",
        status: 401,
      };
      res.status(response.status);
      return res.json(response);
    }

    var query =
      "UPDATE posts SET posts_deleted = true, posts_deleted_description = ? WHERE posts_id = ?";

    connection.query(query, [posts_deleted_description, posts_id], function (
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
        response = {
          status: 200,
          message: "Post deleted!",
          data: result,
        };

        res.status(response.status);
        return res.json(response);
      }
    });
  }
};