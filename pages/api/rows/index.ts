import { rows } from "../../../data/rows";

export default function handler(req, res) {
  res.status(200).json(rows);
}
