"use strict";

module.exports = function (req, res) {
  var response = {};

  var query =
    "SELECT *FROM posts " +
    "WHERE users_id = ? " +
    "ORDER BY posts_created_at DESC";

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