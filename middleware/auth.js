const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const adminAuth = (req, res, next) => {
  const token = req.headers.admin_token;

  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({
      message: "Akses ditolak",
    });
  }

  next();
};

module.exports = adminAuth;
