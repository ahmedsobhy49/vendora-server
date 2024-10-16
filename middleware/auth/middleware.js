import jwt from "jsonwebtoken";
import response from "../../utils/rsponse.js";

export default async function authMiddleWare(req, res, next) {
  const { accessToken } = req.cookie;
  if (!accessToken) {
    response(res, 409, { message: "Please login first" });
  } else {
    try {
      const decodeToken = await jwt.verify(accessToken, process.env.SECRET);
      req.role = decodeToken.role;
      req.id = decodeToken.id;
      next();
    } catch (error) {
      response(res, 409, { message: "Please login first" });
    }
  }
}
