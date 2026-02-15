import api from "./interceptor";

export function loginApi(payload) {
  return api
    .post("/login/", payload)
    .then((res) => {
      const response = res.data;
      if (response) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user_data));
      }
      return Promise.resolve({
        token: response.token,
        userData: response.user_data,
      });
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        // if incorrect credential then return password error
        return Promise.reject("Invalid email or password");
      }
      return Promise.reject(error);
    });
}

export function signUpApi(payload) {
  return api
    .post("/signup/", payload)
    .then((res) => {
      return Promise.resolve(res?.data?.message);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}

export function logoutApi() {
  return api
    .post("/logout/")
    .then((res) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("selectedTheme");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.removeItem("todoFilters");
      localStorage.removeItem("todoViewMode");
      return Promise.resolve(res?.data?.message);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}

export function resetPasswordApi(resetPasswordPayload) {
  return api
    .post("/reset-password/", resetPasswordPayload)
    .then((res) => {
      return Promise.resolve(res?.data?.message);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}
