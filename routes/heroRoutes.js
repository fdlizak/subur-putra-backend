const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const adminAuth = require("../middleware/auth");

const {
  getHeroImages,
  addHeroImage,
  deleteHeroImage,
  getHeroContent,
  updateHeroContent,
} = require("../controllers/heroController");

router.get(
  "/images",
  getHeroImages
);

router.post(
  "/images",
  adminAuth,
  upload.single("image"),
  addHeroImage
);

router.delete(
  "/images/:id",
  adminAuth,
  deleteHeroImage
);

router.get(
  "/content",
  getHeroContent
);

router.put(
  "/content",
  adminAuth,
  updateHeroContent
);

module.exports = router;