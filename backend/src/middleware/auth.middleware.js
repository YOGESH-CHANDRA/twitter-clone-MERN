const jwt = require("jsonwebtoken");

const isUserAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json("Invalid token is there");
  }

  const token = authHeader.split(" ")[1];
console.log("token", token)
console.log("body", req.body)
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(data)
    req.user = { userId: data.id };
    console.log("auth" , req.user)
    next();
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { isUserAuthenticated };
