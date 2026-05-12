const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const adminAuth = require("../middleware/auth");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  upload.array("images", 3),
  createProduct
);

router.put(
  "/:id",
  adminAuth,
  upload.array("images", 3),
  updateProduct
);

router.delete(
  "/:id",
  deleteProduct
);

module.exports = router;