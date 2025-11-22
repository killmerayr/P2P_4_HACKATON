import { useState } from "react";
import { authAPI } from "../api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem("token", data.access);
      setUser(await authAPI.getProfile().then(res => res.data));
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await authAPI.register(userData);
      await login({ username: userData.username, password: userData.password });
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.getProfile();
      setUser(data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, register, getProfile };
};
