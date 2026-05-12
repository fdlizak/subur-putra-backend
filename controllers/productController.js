const db = require("../config/db");
const path = require("path");
const fs = require("fs");

/* ================= GET PRODUCTS ================= */

const getProducts = (req, res) => {

  const query = `
    SELECT p.*, 
    (
      SELECT image_url
      FROM product_images
      WHERE product_id = p.id
      LIMIT 1
    ) AS image
    FROM products p
  `;

  db.query(query, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

};

/* ================= GET PRODUCT BY ID ================= */

const getProductById = (req, res) => {

  const { id } = req.params;

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, productResult) => {

      if (err) {
        return res.status(500).json(err);
      }

      db.query(
        "SELECT image_url FROM product_images WHERE product_id = ?",
        [id],
        (err, imageResult) => {

          if (err) {
            return res.status(500).json(err);
          }

          const product = productResult[0];

          res.json({
            ...product,
            images: imageResult.map(
              (img) => img.image_url
            ),
          });

        }
      );

    }
  );

};

/* ================= CREATE PRODUCT ================= */

const createProduct = (req, res) => {

  const {
    nama,
    kode,
    harga,
    berat,
    kategori,
    kadar,
    warna,
  } = req.body;

  const productQuery = `
    INSERT INTO products
    (
      nama,
      kode,
      harga,
      berat,
      kategori,
      kadar,
      warna
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    productQuery,
    [
      nama,
      kode,
      harga,
      berat,
      kategori,
      kadar,
      warna,
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      const productId =
        result.insertId;

      // ================= IMAGE =================

      if (
        req.files &&
        req.files.length > 0
      ) {

        const imageValues =
          req.files.map((file) => [
            productId,
            file.filename,
          ]);

        Promise.all(

          imageValues.map((img) => {

            return new Promise(
              (resolve, reject) => {

                db.query(
                  `
                  INSERT INTO product_images
                  (
                    product_id,
                    image_url
                  )
                  VALUES (?, ?)
                  `,
                  img,
                  (err) => {

                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }

                  }
                );

              }
            );

          })

        )
          .then(() => {

            res.json({
              message:
                "Product berhasil ditambahkan",
            });

          })
          .catch((err) => {

            res.status(500).json(err);

          });

      } else {

        res.json({
          message:
            "Product tanpa image berhasil ditambahkan",
        });

      }

    }
  );

};

/* ================= UPDATE PRODUCT ================= */

const updateProduct = (req, res) => {

  const { id } = req.params;

  const {
    nama,
    kode,
    harga,
    berat,
    kategori,
    kadar,
    warna,
  } = req.body;

  const query = `
    UPDATE products
    SET
      nama = ?,
      kode = ?,
      harga = ?,
      berat = ?,
      kategori = ?,
      kadar = ?,
      warna = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      nama,
      kode,
      harga,
      berat,
      kategori,
      kadar,
      warna,
      id,
    ],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      // ================= UPDATE IMAGE =================

      if (
        req.files &&
        req.files.length > 0
      ) {

        db.query(
          `
          SELECT image_url
          FROM product_images
          WHERE product_id = ?
          `,
          [id],
          async (err, images) => {

            if (err) {
              return res.status(500).json(err);
            }

            // hapus file lama
            images.forEach((img) => {

              const filePath =
                path.join(
                  __dirname,
                  "..",
                  "uploads",
                  img.image_url
                );

              if (
                fs.existsSync(filePath)
              ) {
                fs.unlinkSync(filePath);
              }

            });

            // hapus db image lama
            db.query(
              `
              DELETE FROM product_images
              WHERE product_id = ?
              `,
              [id],
              async (err) => {

                if (err) {
                  return res.status(500).json(err);
                }

                try {

                  const imageValues =
                    req.files.map(
                      (file) => [
                        Number(id),
                        file.filename,
                      ]
                    );

                  await Promise.all(

                    imageValues.map((img) => {

                      return new Promise(
                        (
                          resolve,
                          reject
                        ) => {

                          db.query(
                            `
                            INSERT INTO product_images
                            (
                              product_id,
                              image_url
                            )
                            VALUES (?, ?)
                            `,
                            img,
                            (err) => {

                              if (err) {
                                reject(err);
                              } else {
                                resolve();
                              }

                            }
                          );

                        }
                      );

                    })

                  );

                  return res.json({
                    message:
                      "Product + image berhasil diupdate",
                  });

                } catch (err) {

                  return res.status(500).json(err);

                }

              }
            );

          }
        );

      } else {

        return res.json({
          message:
            "Product berhasil diupdate",
        });

      }

    }
  );

};

/* ================= DELETE PRODUCT ================= */

const deleteProduct = (req, res) => {

  const { id } = req.params;

  // ambil image dulu
  db.query(
    `
    SELECT image_url
    FROM product_images
    WHERE product_id = ?
    `,
    [id],
    (err, images) => {

      if (err) {
        return res.status(500).json(err);
      }

      // hapus file local
      images.forEach((img) => {

        const filePath =
          path.join(
            __dirname,
            "..",
            "uploads",
            img.image_url
          );

        if (
          fs.existsSync(filePath)
        ) {
          fs.unlinkSync(filePath);
        }

      });

      // hapus db image
      db.query(
        `
        DELETE FROM product_images
        WHERE product_id = ?
        `,
        [id],
        (err) => {

          if (err) {
            return res.status(500).json(err);
          }

          // hapus product
          db.query(
            `
            DELETE FROM products
            WHERE id = ?
            `,
            [id],
            (err) => {

              if (err) {
                return res.status(500).json(err);
              }

              res.json({
                message:
                  "Product berhasil dihapus",
              });

            }
          );

        }
      );

    }
  );

};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};