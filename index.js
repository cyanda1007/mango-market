const express = require("express");
const { engine } = require("express-handlebars");
const pgp = require("pg-promise")();
require("dotenv").config();
const helperFunction = require("./mango-shopper");

const app = express();
const PORT = process.env.PORT || 3950;

const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgrsql://postgres:Cyanda@100%@localhost:5432/mango_market";

const db = pgp(connectionString);
//Set up an configuration on were we want to connect the database
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const mangoFunction = helperFunction(pool);

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static("public"));

// add more middleware to allow for templating support

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: `${__dirname}/views/layouts`,
  })
);

app.set("view engine", "handlebars");

//List my top five deals
app.get("/", async function (req, res) {
  res.render("index", { topDeal: await mangoFunction.topFiveDeals() });
});

//Add New mango Deals
app.get("/newDeal", async function (req, res) {
  const shops = await mangoFunction.listShops();
  res.render("addDeal", { shops });
});

app.post("/newDeal", async function (req, res) {
  await mangoFunction.createDeal(
    req.body.shops,
    req.body.dealQty,
    req.body.dealPrice
  );
  res.redirect("/");
});

//Mango Deals For a given shop
app.get("/show/:name/:shop", async function (req, res) {
  req.params.shop++;
  const mangoDeals = await mangoFunction.dealsForShop(req.params.shop);
  res.render("index", { mangoDeals, name: req.params.name });
});

//Add a new shop with first letter upercase
app.post("/shops", async function (req, res) {
  let input = req.body.addshopInfo;
  let shopName = input[0].toUpperCase() + input.slice(1).toLowerCase();
  await avoFunction.createShop(shopName);
  res.redirect("/shops");
});

//List all shops
app.get("/shops", async function (req, res) {
  const shopList = await mangoFunction.listShops();
  res.render("viewShops", { shopList });
});

app.get("/addShops", async function (req, res) {
  res.render("addShop");
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
  console.log(`MangoApp started on port ${PORT}`);
});

// const express = require("express");
// const exphbs = require("express-handlebars");
// const shop = require("./mango-shopper");
// const pg = require("pg");
// const Pool = pg.Pool;
// // require('dotenv').config()

// // should we use a SSL connection
// let useSSL = false;
// let local = process.env.LOCAL || false;
// if (process.env.DATABASE_URL && !local) {
//   useSSL = true;
// }
// // which db connection to use
// const connectionString =
//   process.env.DATABASE_URL ||
//   "postgrsql://postgres:Cyanda@100%@localhost:5432/mango_market";

// const pool = new Pool({
//   connectionString,
//   ssl: useSSL,
// });

// const shopping = shop(pool);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // enable the req.body object - to allow us to use HTML forms
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // enable the static folder...
// app.use(express.static("public"));

// // add more middleware to allow for templating support

// app.engine("handlebars", exphbs.engine());
// app.set("view engine", "handlebars");

// let counter = 0;

// app.get("/", function (req, res) {
//   res.render("index", {
//     counter,
//   });
// });

// app.get("/getbyID/:name/:id", async function (req, res) {
//   console.log(req.params.id);
//   res.render("price&qty", {
//     name: req.params.name,
//     shopFound: await shopping.dealsForShop(req.params.id),
//   });
// });

// app.get("/listshop", async function (req, res) {
//   res.render("listshop", {
//     allShops: await shopping.listShops(),
//   });
// });

// app.post("/action_Shop", async function (req, res) {
//   const { shop, price, qty } = req.body;
//   if (shop !== "" && price !== "" && qty !== "") {
//     var getshop = await shopping.createShop(shop);
//     await shopping.createDeal(getshop.id, qty, price);
//   }
//   res.render("index");
// });

// // start  the server and start listening for HTTP request on the PORT number specified...
// app.listen(PORT, function () {
//   console.log(`mangoApp started on port ${PORT}`);
// });
