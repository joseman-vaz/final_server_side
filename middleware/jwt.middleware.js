import { verify } from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const token = getTokenFromHeaders(req);
  if (!token) {
    return res.redirect("/login");
  }

  verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/login");
      // res.status(401).json({ message: "Unauthorized" });
    }

    req.payload = decoded;
    next();
  });
};

function getTokenFromHeaders(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

export default isAuthenticated;

// middleware / jwt.middleware.js;

// const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
// const isAuthenticated = jwt({
//   secret: process.env.TOKEN_SECRET,
//   algorithms: ["HS256"],
//   requestProperty: "payload",
//   getToken: getTokenFromHeaders,
// });

// // Function used to extracts the JWT token from the request's 'Authorization' Headers
// function getTokenFromHeaders(req) {
//   // Check if the token is available on the request Headers
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.split(" ")[0] === "Bearer"
//   ) {
//     // Get the encoded token string and return it
//     const token = req.headers.authorization.split(" ")[1];
//     return token;
//   }

//   return null;
// }

// // Export the middleware so that we can use it to create a protected routes
// export default isAuthenticated;
