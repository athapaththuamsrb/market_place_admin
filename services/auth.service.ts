import jwt_decode from "jwt-decode";
import { Session } from "../src/interfaces";

const getCurrentUser = () => {
  if (localStorage.getItem("user")) {
    return true;
  } else {
    return false;
  }
};

const getWalletAddress = () => {
  if (localStorage.getItem("user")) {
    let decoded: Session = jwt_decode(localStorage.user);
    return decoded.walletAddress;
  }
  return null;
};

const getUserType = () => {
  if (localStorage.getItem("user")) {
    let decoded: Session = jwt_decode(localStorage.user);
    return decoded.type;
  }
  return null;
};

const getUserToken = () => {
  if (localStorage.getItem("user")) {
    return localStorage.getItem("user");
  }
  return null;
};
const authService = {
  getCurrentUser,
  getWalletAddress,
  getUserType,
  getUserToken,
};

export default authService;
