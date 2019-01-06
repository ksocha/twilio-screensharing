import axios from "axios";

export const getToken = async user =>
  axios.get("/token", {
    params: {
      user
    }
  });
