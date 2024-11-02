// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token =
//       authHeader && authHeader.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : null;

//     console.log("TOKEN from Server:", token);
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized access lol" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ message: "Invalid token" });
//       }

//       req.user = decoded;
//       next();
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "An error occurred during authentication" });
//   }
// };

// module.exports = authMiddleware;
