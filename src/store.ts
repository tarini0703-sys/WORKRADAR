import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type ActivityEntry,
  type SnoozeDuration,
  type Store,
  freshStore,
  loadStore,
  resetStore,
  saveStore,
  uid,
} from '@/data';

const SNOOZE_LABELS: Record<SnoozeDuration, string> = {
  '2h': '2 hours',
  '4h': '4 hours',
  tomorrow: 'Until tomorrow',
};

export function useStore() {
  const [store, setStore] = useState<Store>(() => loadStore());

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const items = useMemo(() => Object.values(store.items), [store.items]);

  const logActivity = useCallback(
    (itemId: string, actor: string, action: string, detail: string) => {
      setStore((prev) => {
        const entry: ActivityEntry = {
          id: uid('a'),
          itemId,
          actor,
          action,
          detail,
          time: 'Just now',
        };
        return { ...prev, activity: [entry, ...prev.activity].slice(0, 40) };
      });
    },
    []
  );

  const assign = useCallback(
    (itemId: string, newOwner: string) => {
      setStore((prev) => {
        const item = prev.items[itemId];
        if (!item) return prev;
        return {
          ...prev,
          items: { ...prev.items, [itemId]: { ...item, owner: newOwner } },
        };
      });
      logActivity(itemId, 'Priya (You)', 'assigned', `to ${newOwner}`);
    },
    [logActivity]
  );

  const markDone = useCallback(
    (itemId: string) => {
      setStore((prev) => {
        const item = prev.items[itemId];
        if (!item) return prev;
        return {
          ...prev,
          items: {
            ...prev.items,
            [itemId]: { ...item, done: true, snoozed: false, status: 'done', statusLabel: 'Done' },
          },
        };
      });
      logActivity(itemId, 'Priya (You)', 'marked done', itemId);
    },
    [logActivity]
  );

  const undoDone = useCallback(
    (itemId: string) => {
      setStore((prev) => {
        const item = prev.items[itemId];
        if (!item) return prev;
        const status = item.blocked ? 'blocked' : item.urgency >= 80 ? 'at-risk' : 'on-track';
        const label = item.blocked ? item.id : item.urgency >= 80 ? 'At Risk' : 'On Track';
        return {
          ...prev,
          items: {
            ...prev.items,
            [itemId]: {
              ...item,
              done: false,
              status,
              statusLabel: item.blocked ? `Blocked ${item.statusLabel.replace('Blocked ', '')}` : label,
            },
          },
        };
      });
      logActivity(itemId, 'Priya (You)', 'reopened', itemId);
    },
    [logActivity]
  );

  const snooze = useCallback(
    (itemId: string, duration: SnoozeDuration) => {
      setStore((prev) => {
        const item = prev.items[itemId];
        if (!item) return prev;
        return {
          ...prev,
          items: { ...prev.items, [itemId]: { ...item, snoozed: true, snoozedUntil: SNOOZE_LABELS[duration] } },
        };
      });
      logActivity(itemId, 'Priya (You)', 'snoozed', `for ${SNOOZE_LABELS[duration]}`);
    },
    [logActivity]
  );

  const unsnooze = useCallback(
    (itemId: string) => {
      setStore((prev) => {
        const item = prev.items[itemId];
        if (!item) return prev;
        return {
          ...prev,
          items: { ...prev.items, [itemId]: { ...item, snoozed: false, snoozedUntil: undefined } },
        };
      });
      logActivity(itemId, 'Priya (You)', 'unsnoozed', itemId);
    },
    [logActivity]
  );

  const sendNudge = useCallback(
    (itemId: string, message: string) => {
      const item = store.items[itemId];
      logActivity(itemId, 'Priya (You)', 'sent nudge', `to ${item?.unblocker ?? 'team'}: "${message.slice(0, 60)}${message.length > 60 ? '…' : ''}"`);
    },
    [logActivity, store.items]
  );

  const reset = useCallback(() => {
    setStore(resetStore());
  }, []);

  // Seed fresh demo data (used when toggling to live mode after empty/error)
  const seedFresh = useCallback(() => {
    setStore(() => freshStore());
  }, []);

  return {
    store,
    items,
    itemById: (id: string) => store.items[id],
    activity: store.activity,
    assign,
    markDone,
    undoDone,
    snooze,
    unsnooze,
    sendNudge,
    reset,
    seedFresh,
  };
}

export type StoreApi = ReturnType<typeof useStore>;
