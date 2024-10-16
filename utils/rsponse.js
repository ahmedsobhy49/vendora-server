export default function response(res, code, data) {
  return res.status(code).json(data);
}
