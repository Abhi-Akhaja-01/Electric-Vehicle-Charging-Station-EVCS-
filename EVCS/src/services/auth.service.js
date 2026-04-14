const checkLogin = () => {
  const token = localStorage.getItem("admin-token");
  return !!token;
};

const checkIsAdmin = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin === "true";
};

const setAuthData = (token, isAdmin) => {
  localStorage.setItem("admin-token", token);
  localStorage.setItem("isAdmin", isAdmin);
};

const setRememberPassword = (email, Password) => {
  localStorage.setItem("admin-email", email);
  localStorage.setItem("admin-password", Password);
};

const removeAuthData = () => {
  localStorage.removeItem("admin-token");
};
const AuthService = {
  checkLogin: checkLogin,
  checkIsAdmin:checkIsAdmin,
  setAuthData: setAuthData,
  removeAuthData: removeAuthData,
  setRememberPassword: setRememberPassword,
};

export default AuthService;
