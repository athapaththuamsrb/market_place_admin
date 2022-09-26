// import { parse } from "querystring";
// import { rows } from "../../../data/rows";

// export default function handler(req, res) {
//   if (req.method === "GET") {
//     res.status(200).json(rows);
//   } else if (req.method === "POST") {
//     // const updatedRow = rows.find((row)=>row.User_ID===req.body.userID)
//     const newRow= {
//       id: Date.now(),
//       User_ID: req.body.userID,
//       Name: req.body.name,
//       Date: "1234",
//       Total: 0,
//       Created: 0,
//       Volume: 0,
//       Status: "active",
//       Type: "Admin",
//     };
//     rows.push(newRow);
//     res.status(201).json(rows);
//   }
// }
