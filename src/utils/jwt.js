// services/tokenService.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // env me rakho

export const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
