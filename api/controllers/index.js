"use strict";

const express = require("express");
const router = express.Router();
const verifyToken = require("../../middlewares/verify_token");

//Endpoints de usuario
router.post("/register", require("./register.js"));
router.put("/register", require("./update_register.js"));
router.post("/login", require("./login.js"));
router.get("/info", require("./info.js"));
router.get("/logout", require("./logout.js"));

//Endpoints de posts
router.post("/post", verifyToken, require("./create_post.js"));
router.get("/post", require("./get_post.js"));
router.get("/post_user", verifyToken, require("./get_post_user.js"));
router.put("/post", verifyToken, require("./update_post.js"));

// Endpoints de category
router.get("/category", verifyToken, require("./get_category.js"));

// Endpoints de cart
router.get("/cart", verifyToken, require("./get_cart.js"));
router.post("/cart", verifyToken, require("./add_cart.js"));

//Endpoints de paypal
router.get("/paypal", require("./paypal.js"));
router.get("/success", require("./success.js"));
router.get("/cancel", require("./cancel.js"));

//Endpoints de paymnent
router.post("/payment", verifyToken, require("./add_payment.js"));
router.get("/payment", verifyToken, require("./get_payment.js"));
router.put("/payment", verifyToken, require("./update_payment.js"));

module.exports = router;
