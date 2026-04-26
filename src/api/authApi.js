import api from "./interceptor";

export function loginApi(payload) {
  return api
    .post("/login/", payload)
    .then((res) => {
      const response = res.data;
      if (response) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user_data));
        
        // Handle theme from backend (1 for light, 2 for dark)
        const themeValue = response.user_data?.theme === 2 ? "dark" : "light";
        localStorage.setItem("selectedTheme", themeValue);
        document.documentElement.setAttribute("data-theme", themeValue);
        localStorage.setItem("pageSize", "12");
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
      localStorage.removeItem("pageSize");
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

export function updateThemeApi(themeValue) {
  return api
    .post("/update-theme/", { theme: themeValue === "dark" ? 2 : 1 })
    .then((res) => {
      return Promise.resolve(res?.data?.message);
    })
    .catch((error) => {
      return Promise.reject(error?.response?.data?.error);
    });
}
