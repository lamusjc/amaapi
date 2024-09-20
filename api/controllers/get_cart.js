"use strict";

module.exports = function (req, res) {
  var response = {};
  var query =
    "SELECT cart.posts_id, cart.cart_id, posts.category_id, posts.posts_title, posts.posts_description, posts.posts_price, posts.posts_created_at, posts.posts_quantity, posts.posts_image, cart.users_id FROM cart " +
    "INNER JOIN posts ON cart.posts_id = posts.posts_id " +
    "WHERE cart.users_id = ? AND cart.cart_status = 0 AND posts.posts_deleted = 0";

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