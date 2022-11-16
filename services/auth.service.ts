const getUserToken = () => {
  if (localStorage.getItem("token")) {
    return localStorage.getItem("token");
  }
  return null;
};

const logout = () => {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
    return true;
  }
  return false;
};

const authService = {
  getUserToken,
  logout
};

export default authService;
