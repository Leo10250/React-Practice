import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
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
    autoDismissMs = 2000,
}) => {
    const [queue, setQueue] = useState([]);
    const active = queue.slice(0, maxVisible);

    const addAchievement = useCallback((achievement) => {
        setQueue((curr) => [...curr, achievement]);
    }, []);

    const dismiss = useCallback((id) => {
        setQueue((curr) => curr.filter((item) => item.id !== id));
    }, []);

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
                {active.map((i) => (
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
    const timerRef = useRef(null);
    const startTime = useRef(0);
    const remainingTime = useRef(autoDismissMs);

    const [isHover, setIsHover] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const clearTimer = () => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    };

    const pauseTime = useCallback(() => {
        if (!timerRef.current) {
            return;
        }
        const timeUsed = Date.now() - startTime.current;
        remainingTime.current = Math.max(0, remainingTime.current - timeUsed);
        clearTimer();
    }, []);

    const resumeTime = useCallback(() => {
        if (timerRef.current) {
            return;
        }

        if (remainingTime.current <= 0) {
            onClose(achievement.id);
            return;
        }
        startTime.current = Date.now();
        timerRef.current = setTimeout(
            () => onClose(achievement.id),
            remainingTime.current,
        );
    }, [onClose, achievement.id]);

    useEffect(() => {
        remainingTime.current = autoDismissMs;
        startTime.current = Date.now();
        timerRef.current = setTimeout(
            () => onClose(achievement.id),
            autoDismissMs,
        );

        return clearTimer;
    }, [onClose, achievement.id, autoDismissMs]);

    useEffect(() => {
        const shouldPause = isHover || isFocus;

        if (shouldPause) {
            pauseTime();
        } else {
            resumeTime();
        }
    }, [isHover, isFocus, pauseTime, resumeTime]);

    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
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
