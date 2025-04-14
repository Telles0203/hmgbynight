const jwt = require("jsonwebtoken");



module.exports = (req, res, next) => {
  
  console.log("🔍 Middleware executado na rota:", req.originalUrl);

  const token = req.cookies.token;
  if (!token) {
    console.log("⛔ Sem token, redirecionando...");
    console.log("🔁 Redirecionando para:", "/login.html?auth=required");
    return res.redirect("/login.html?auth=required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log("✅ Token válido");
    next();
  } catch {
    console.log("❌ Token inválido → redirecionando para /login.html?auth=required");
    return res.redirect("/login.html?auth=required");    
  }
};
