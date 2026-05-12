require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes =
  require("./routes/productRoutes");

const heroRoutes =
  require("./routes/heroRoutes");

const errorHandler =
  require("./middleware/errorHandler");

require("./config/db");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ================= STATIC ================= */

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* ================= HOME ================= */

app.get("/", (req, res) => {

  res.send(
    "API Toko Emas Jalan 🚀"
  );

});

/* ================= ROUTES ================= */

app.use(
  "/products",
  productRoutes
);

app.use(
  "/hero",
  heroRoutes
);

/* ================= ERROR ================= */

app.use(errorHandler);

/* ================= SERVER ================= */

app.listen(3000, "0.0.0.0", () => {

  console.log(
    "Server jalan di network 🚀"
  );

});