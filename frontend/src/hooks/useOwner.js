import { useState } from "react";
import { ownerAPI } from "../api";

export const useOwner = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const { data } = await ownerAPI.getAllOwners();
      setOwners(data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerOwner = async (ownerData) => {
    try {
      const { data } = await ownerAPI.registerOwner(ownerData);
      setOwners(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  return { owners, loading, error, fetchOwners, registerOwner };
};
