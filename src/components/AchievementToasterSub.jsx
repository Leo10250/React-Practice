import React, { useCallback, useEffect, useState } from "react";

/**
 * ============================
 * Given: achievement stream API
 * ============================
 *
 * subscribeToAchievements(cb) calls cb(achievement) repeatedly over time.
 * It returns an unsubscribe function.
 *
 * In the real interview, this would be provided. Here it's simulated.
 */

function subscribeToAchievements(onAchievement) {
    console.log("start");
    let cancelled = false;

    const rarities = ["Bronze", "Silver", "Gold", "Platinum"];
    const games = ["Astro Bot", "God of War", "Horizon", "Spider-Man", "GT7"];

    let counter = 0;

    function emitOne() {
        if (cancelled) return;

        counter += 1;
        const achievement = {
            // Stream provides a unique id (assume unique)
            id: `ach-${Date.now()}-${counter}`,
            title: `Trophy Unlocked #${counter}`,
            game: games[counter % games.length],
            rarity: rarities[counter % rarities.length],
            // epoch ms
            unlockedAt: Date.now(),
        };

        onAchievement(achievement);
    }

    // Emit at a steady pace
    const steadyIntervalId = setInterval(() => {
        emitOne();
    }, 1200);

    // Emit bursts occasionally (stress test)
    const burstIntervalId = setInterval(() => {
        if (cancelled) return;
        const burstSize = 6; // could be larger in follow-up discussion
        for (let i = 0; i < burstSize; i++) emitOne();
    }, 7000);

    // Unsubscribe
    return () => {
        cancelled = true;
        clearInterval(steadyIntervalId);
        clearInterval(burstIntervalId);
    };
}

/**
 * ============================
 * Your task: AchievementToaster
 * ============================
 *
 * Requirements:
 * - Subscribe on mount, unsubscribe on unmount
 * - When an achievement arrives, show a toast
 * - Max 3 visible toasts; rest queued FIFO
 * - Auto-dismiss each toast 4s after it becomes visible
 * - Manual dismiss button closes immediately
 * - Clean up timeouts on dismiss/unmount (no leaks)
 */

const MAX_VISIBLE = 3;
const AUTO_DISMISS_MS = 4000;

function ToastCard({ toast, onClose, dismissMs }) {
    useEffect(() => {
        const timerId = setTimeout(() => onClose(toast.id), dismissMs);
        return () => clearTimeout(timerId);
    }, [onClose, dismissMs, toast.id]);

    return (
        <div
            role="status"
            style={{
                position: "relative",
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: 12,
                marginBottom: 8,
            }}
        >
            <div>{toast.title}</div>
            <div>{toast.game}</div>
            <div>{toast.rarity}</div>
            <button
                onClick={() => onClose(toast.id)}
                style={{ position: "absolute", top: 5, right: 5 }}
            >
                x
            </button>
        </div>
    );
}

export function AchievementToasterSub() {
    const [queue, setQueue] = useState([]);
    const visible = queue.slice(0, MAX_VISIBLE);

    useEffect(() => {
        const unsubscribe = subscribeToAchievements((achievement) => {
            setQueue((curr) => [...curr, achievement]);
        });
        return () => unsubscribe();
    }, []);

    const dismiss = useCallback((id) => {
        setQueue((curr) => curr.filter((item) => item.id !== id));
    }, []);

    return (
        <div style={{ position: "fixed", top: 16, right: 16 }}>
            {visible.map((item) => (
                <ToastCard
                    key={item.id}
                    toast={item}
                    onClose={dismiss}
                    dismissMs={AUTO_DISMISS_MS}
                />
            ))}
        </div>
    );
}
