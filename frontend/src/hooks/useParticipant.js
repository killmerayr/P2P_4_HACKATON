import { useState } from "react";
import { participantAPI } from "../api";

export const useParticipant = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyParticipants = async () => {
    setLoading(true);
    try {
      const { data } = await participantAPI.getMyParticipants();
      setParticipants(data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelParticipation = async (id) => {
    try {
      await participantAPI.cancelParticipation(id);
      await fetchMyParticipants(); // обновляем список участников
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  return { participants, loading, error, fetchMyParticipants, cancelParticipation };
};
