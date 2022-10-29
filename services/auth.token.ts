const jwt = require("jsonwebtoken");
import jwt_decode from "jwt-decode";
import { Session } from "../src/interfaces";

const userAuthToken = async (token: string) => {
  // If token not found, send error message
  if (!token) {
    console.log("Token Not Found!");
    return null;
  } else {
    // Authenticate token and return walletAddress
    try {
      const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      let decoded: Session = jwt_decode(token);
      return decoded.walletAddress;
    } catch (error) {
      console.log("Invalid Token!!");
      return null;
    }
  }
};


const authToken = {
  userAuthToken,
};

export default authToken;
