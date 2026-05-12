const db = require("../config/db");

const path = require("path");

const fs = require("fs");

/* ================= GET HERO IMAGES ================= */

const getHeroImages = (req, res) => {

  db.query(
    "SELECT * FROM hero_images",
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};

/* ================= ADD HERO IMAGE ================= */

const addHeroImage = (req, res) => {

  const image =
    req.file.filename;

  db.query(
    `
    INSERT INTO hero_images
    (image_url)
    VALUES (?)
    `,
    [image],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message:
          "Hero image berhasil ditambah",
      });

    }
  );

};

/* ================= DELETE HERO IMAGE ================= */

const deleteHeroImage = (req, res) => {

  const { id } = req.params;

  db.query(
    `
    SELECT * FROM hero_images
    WHERE id = ?
    `,
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      const image = result[0];

      const filePath =
        path.join(
          __dirname,
          "..",
          "uploads",
          image.image_url
        );

      if (
        fs.existsSync(filePath)
      ) {
        fs.unlinkSync(filePath);
      }

      db.query(
        `
        DELETE FROM hero_images
        WHERE id = ?
        `,
        [id],
        (err) => {

          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            message:
              "Hero image dihapus",
          });

        }
      );

    }
  );

};

/* ================= GET HERO CONTENT ================= */

const getHeroContent = (req, res) => {

  db.query(
    `
    SELECT *
    FROM hero_content
    LIMIT 1
    `,
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);

    }
  );

};

/* ================= UPDATE HERO CONTENT ================= */

const updateHeroContent = (
  req,
  res
) => {

  const {
    subtitle,
    title,
    description,
    button_text,
  } = req.body;

  const query = `
    UPDATE hero_content
    SET
      subtitle = ?,
      title = ?,
      description = ?,
      button_text = ?
    WHERE id = 1
  `;

  db.query(
    query,
    [
      subtitle,
      title,
      description,
      button_text,
    ],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message:
          "Hero content berhasil diupdate",
      });

    }
  );

};

module.exports = {
  getHeroImages,
  addHeroImage,
  deleteHeroImage,
  getHeroContent,
  updateHeroContent,
};
