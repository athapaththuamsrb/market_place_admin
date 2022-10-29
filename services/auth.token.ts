const jwt = require("jsonwebtoken");
require('dotenv').config();

const userAuthToken = async (props: { token: String; }) => {
    // If token not found, send error message
    if (!props.token) {
      console.log("Token Not Found!");
      return false;
    } else {
      // Authenticate token
      try {
        const user = await jwt.verify(props.token, process.env.ACCESS_TOKEN_SECRET);
        if (user.type !== "User") {
          return false;
        }
      } catch (error) {
        return false;
      }
      return true;
    }
  };

  const adminAuthToken = async (props: { token: String; }) => {
    // If token not found, send error message
    if (!props.token) {
      console.log("Token Not Found!");
      return false;
    } else {
      // Authenticate token
      try {
        const user = await jwt.verify(props.token, process.env.ACCESS_TOKEN_SECRET);
        if (user.type !== "Admin") {
          return false;
        }
      } catch (error) {
        return false;
      }
      return true;
    }
  };

  const authToken = {
    userAuthToken,
    adminAuthToken
  };

  export default authToken;