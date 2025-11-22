// src/hooks/useQueues.js
import { useState, useEffect } from "react";
// import { queueAPI } from "../services/api";

export const useQueues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueues = async () => {
    try {
      const res = await queueAPI.getQueues();
      setQueues(res.data);
    } catch (err) {
      console.error("Ошибка загрузки очередей:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  return { queues, loading, fetchQueues };
};
