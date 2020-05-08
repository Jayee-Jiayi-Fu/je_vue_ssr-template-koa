import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/", // should be set based on env
});

const getUsers = () => instance.get("/blog/users");

export default {
  getUsers,
};
