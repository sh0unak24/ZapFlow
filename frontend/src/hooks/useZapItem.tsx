import { ZapItem } from "@/components/Modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/app/config";

interface UseZapItemReturn {
  triggers: ZapItem[];
  actions: ZapItem[];
  error: string | null;
}

export const useZapItem = (): UseZapItemReturn => {
  const [triggers, setTriggers] = useState<ZapItem[]>([]);
  const [actions, setActions] = useState<ZapItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTriggersAndActions() {
      try {
        setError(null);

        const [triggerRes, actionRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/v1/trigger/available`, {
            withCredentials: true,
          }),
          axios.get(`${BACKEND_URL}/api/v1/action/available`, {
            withCredentials: true,
          }),
        ]);

        setTriggers(triggerRes.data.availableTriggers);
        setActions(actionRes.data.availableActions);

      } catch (err: any) {
        console.error(err);
        setError("Error fetching available triggers and actions");
      }
    }

    fetchTriggersAndActions();
  }, []);

  return { triggers, actions, error };
};