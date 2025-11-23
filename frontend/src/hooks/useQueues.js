// src/hooks/useQueues.js
import { useState, useEffect } from "react";
import { queueAPI } from "../services/api";

export const useQueues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const res = await queueAPI.getAllQueues();
      setQueues(res.data);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки очередей:", err);
      setError(err.message || "Ошибка загрузки очередей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  return { queues, loading, error, fetchQueues };
};
