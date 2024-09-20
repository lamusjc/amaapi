"use strict";

module.exports = function (req, res) {
  var response = {};

  var query =
    "SELECT posts.posts_id, posts.users_id, posts.category_id, posts.posts_title, posts.posts_description, posts.posts_price, posts.posts_quantity, posts.posts_image, posts.posts_created_at FROM posts " +
    "LEFT JOIN cart ON posts.posts_id = cart.posts_id " +
    "WHERE (cart.cart_status IS NULL OR cart.cart_status = 0) AND posts.posts_deleted = 0  " +
    "ORDER BY posts_created_at DESC";

  connection.query(query, function (error, result, fields) {
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
