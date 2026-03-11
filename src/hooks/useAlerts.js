import { useState, useEffect } from 'react';
import { daysUntil } from '../utils/dates.js';
import { urgColorHex } from '../utils/colors.js';

export function useAlerts(hackathons, learnings, events, user) {
  const [alerts, setAlerts]       = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    if (!user) return;

    const a = [];

    hackathons.forEach((h) => {
      const d = daysUntil(h.deadline);
      if (d !== null && d >= 0 && d <= 3 && h.status !== 'submitted') {
        a.push({ id: `h-${h.id}`, type: 'hackathon', name: h.name, days: d, color: urgColorHex(d) });
      }
    });

    learnings.forEach((l) => {
      const d = daysUntil(l.date);
      if (d !== null && d >= 0 && d <= 1 && l.status !== 'done') {
        a.push({ id: `l-${l.id}`, type: 'learning', name: l.topic, days: d, color: d === 0 ? '#ef4444' : '#f59e0b' });
      }
    });

    events.forEach((e) => {
      const d = daysUntil(e.date);
      if (d !== null && d >= 0 && d <= 3 && !e.registered) {
        a.push({ id: `e-${e.id}`, type: 'event', name: e.name, days: d, color: urgColorHex(d) });
      }
    });

    setAlerts(a.filter((x) => !dismissed.includes(x.id)));
  }, [hackathons, learnings, events, user, dismissed]);

  const dismiss = (id) => setDismissed((p) => [...p, id]);

  return { alerts, dismiss };
}
