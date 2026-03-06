import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ToastCtx = createContext(null);

export const useAchievementToaster = () => {
  const ctx = useContext(ToastCtx);

  if (!ctx) {
    throw new Error("Wrap component with AchievementToasterProvider!");
  }

  return ctx;
};

export const AchievementToasterProvider = ({
  children,
  maxVisible = 3,
  autoDismissMs = 4000,
}) => {
  const [state, setState] = useState({ active: [], pending: [] });

  const addAchievement = useCallback(
    (achievement) => {
      setState((curr) => {
        const activeQueueIsFull = curr.active.length >= maxVisible;
        const newActive = [...curr.active];
        const newPending = [...curr.pending];
        if (activeQueueIsFull) {
          newPending.push(achievement);
        } else {
          newActive.push(achievement);
        }
        return { active: newActive, pending: newPending };
      });
    },
    [maxVisible],
  );

  const dismiss = useCallback(
    (id) => {
      setState((curr) => {
        const newActive = curr.active.filter((item) => item.id !== id);
        const newPending = [...curr.pending];
        const activeHasSpace = newActive.length < maxVisible;
        const pendingIsNotEmpty = newPending.length > 0;
        if (activeHasSpace && pendingIsNotEmpty) {
          newActive.push(newPending.shift());
        }
        return { active: newActive, pending: newPending };
      });
    },
    [maxVisible],
  );

  const api = useMemo(() => {
    return {
      addAchievement,
    };
  }, [addAchievement]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {/* viewport */}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 9999,
        }}
      >
        {state.active.map((i) => (
          <ToastCard
            key={i.id}
            achievement={i}
            autoDismissMs={autoDismissMs}
            onClose={dismiss}
          />
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

export const ToastCard = ({ achievement, autoDismissMs, onClose }) => {
  useEffect(() => {
    const timerID = setTimeout(() => onClose(achievement.id), autoDismissMs);
    return () => clearTimeout(timerID);
  }, [onClose, autoDismissMs, achievement.id]);

  return (
    <div
      style={{
        border: "1px solid black",
        boxShadow: "5px 5px 5px grey",
      }}
      role="status"
    >
      <div style={{ fontSize: 22, width: 28, textAlign: "center" }}>
        {achievement.icon ?? "🏆"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, wordBreak: "break-word" }}>
          {achievement.title}
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 700 }}>
          {(achievement.rarity ?? "common").toUpperCase()}
        </div>
        <button onClick={() => onClose(achievement.id)}>X</button>
      </div>
    </div>
  );
};
