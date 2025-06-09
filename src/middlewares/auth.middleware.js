import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Success: token valid hai
      req.user = {
        id: decoded.id, // assuming tum token me id bhejte ho
        // agar aur fields hain to wo bhi add kar sakte ho
      };

      next(); // ab agla middleware ya route handle hoga
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};
