const getUserToken = () => {
  if (localStorage.getItem("token")) {
    return localStorage.getItem("token");
  }
  return null;
};
const authService = {
  getUserToken,
};

export default authService;
