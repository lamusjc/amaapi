//Importamos las librerias
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var cors = require("cors");
var PORT = process.env.PORT || 3000;
//Configuramos el express
var app = express();
var http = require("http");
var server = http.Server(app);
const engines = require("consolidate");
const paypal = require("paypal-rest-sdk");
const nodemailer = require("nodemailer");
const path = require('path');

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1800000,
    },
  })
);

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'uploads')));

app.use("/", require("./api/controllers"));
app.get("/pay", (req, res) => {
  res.render("index");
});

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "Aaozhi0_-_VseN9ns9GayeJOG7QBXSZesTAzSqyrB5v9fVUoLS5P5d70Ol8dKN9YibxBYMzql_AjxUIH",
  client_secret:
    "EPPVGBttevb7I4fmu2OgnUaB6wBTb3YnzDjxyGAy52-NrpZxLTjDCLlpmb6AEfUWxebTxeRyAc5oRxqJ",
});

function handleDisconnect() {
  connection = mysql.createConnection(
    "mysql://b23814ab4fbd47:79a8fc1b@us-cdbr-east-02.cleardb.com/heroku_ae2f639e2e62137?reconnect=true"
  ); // Recreate the connection, since
  // connection = mysql.createConnection({
  //   host: "localhost",
  //   port: 3306,
  //   database: "amadb",
  //   user: "root",
  //   password: "",
  // });
  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }

    console.log(
      "\nConectado a la base de datos con éxito con id: " + connection.threadId
    );
  });

  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

//Iniciar el servidor
server.listen(PORT, function () {
  console.log("\nServidor local iniciado con éxito en el puerto: " + PORT);
});
