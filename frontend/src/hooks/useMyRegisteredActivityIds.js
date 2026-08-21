import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as registrationsApi from "../api/registrationsApi";

export function useMyRegisteredActivityIds() {
  const { token } = useAuth();
  const [registeredActivityIds, setRegisteredActivityIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadMyRegistrations() {
      setLoading(true);
      try {
        const myRegistrations = await registrationsApi.getMyRegistrations(token);
        if (!ignore) {
          const activeIds = myRegistrations
            .filter((r) => r.status === "REGISTERED")
            .map((r) => r.activityId);
          setRegisteredActivityIds(new Set(activeIds));
        }
      } catch {
        if (!ignore) {
          setRegisteredActivityIds(new Set());
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMyRegistrations();

    return () => {
      ignore = true;
    };
  }, [token]);

  function markAsRegistered(activityId) {
    setRegisteredActivityIds((prev) => new Set(prev).add(activityId));
  }

  return { registeredActivityIds, loading, markAsRegistered };
}