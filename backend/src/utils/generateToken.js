import jwt from "jsonwebtoken";

// ENV SAFETY CHECK
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

// ACCESS TOKEN (7 days)
export const generateToken = (id) => {
  return jwt.sign(
    { id },
    JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "picnichub",
    }
  );
};


// REFRESH TOKEN (30 days)
export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
      issuer: "picnichub",
    }
  );
};


// VERIFY TOKENS
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
};
