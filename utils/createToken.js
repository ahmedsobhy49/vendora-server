import jwt from "jsonwebtoken";

export default async function createToken(data) {
  const token = await jwt.sign(data, process.env.SECRET, {
    expiresIn: "7d",
  });
  return token;
}
