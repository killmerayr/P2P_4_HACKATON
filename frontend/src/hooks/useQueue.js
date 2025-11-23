// src/hooks/useQueue.js
import { useState, useEffect } from "react";
import { queueAPI } from "../services/api";

export const useQueue = (queueId) => {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQueue = async () => {
    if (!queueId) return;
    
    try {
      setLoading(true);
      const res = await queueAPI.getQueue(queueId);
      setQueue(res.data);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки очереди:", err);
      setError(err.message || "Ошибка загрузки очереди");
    } finally {
      setLoading(false);
    }
  };

  const joinQueue = async (data) => {
    try {
      const res = await queueAPI.joinQueue(queueId, data);
      await fetchQueue(); // Refresh queue data
      return res.data;
    } catch (err) {
      console.error("Ошибка присоединения к очереди:", err);
      throw err;
    }
  };

  const getStatus = async () => {
    try {
      const res = await queueAPI.getQueueStatus(queueId);
      return res.data;
    } catch (err) {
      console.error("Ошибка получения статуса очереди:", err);
      throw err;
    }
  };

  const leaveQueue = async (participantId) => {
    try {
      const res = await queueAPI.leaveQueue(queueId, participantId);
      await fetchQueue(); // Refresh queue data
      return res.data;
    } catch (err) {
      console.error("Ошибка выхода из очереди:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (queueId) {
      fetchQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueId]);

  return { 
    queue, 
    loading, 
    error, 
    fetchQueue, 
    joinQueue, 
    getStatus, 
    leaveQueue 
  };
};
