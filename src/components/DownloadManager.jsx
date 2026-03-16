import React, { useState } from "react";

const games = [
    { id: 1, title: "Astro Bot", sizeGB: 18 },
    { id: 2, title: "Helldivers 2", sizeGB: 70 },
    { id: 3, title: "God of War Ragnarök", sizeGB: 84 },
    { id: 4, title: "Horizon Forbidden West", sizeGB: 96 },
];

export default function DownloadManager() {
    const [queueIds, setQueueIds] = useState([]);
    const queuedIdSet = new Set(queueIds);
    const queuedGames = queueIds.map((id) => games.find((game) => game.id === id)).filter(Boolean);

    const addToQueue = (gameId) => {
        if (queuedIdSet.has(gameId)) {
            return;
        }
        setQueueIds((prev) => [...prev, gameId]);
    };

    const handleMoveUp = (gameId) => {
        const index = queueIds.findIndex((id) => id === gameId);
        if (index <= 0) return;
        const newQueue = [...queueIds];
        const prev = newQueue[index];
        newQueue[index] = newQueue[index - 1];
        newQueue[index - 1] = prev;
        setQueueIds(newQueue);
    };

    const removeFromQueue = (gameId) => {
        setQueueIds((prev) => prev.filter((id) => id !== gameId));
    };
    return (
        <div>
            <h1>Download Manager</h1>
            <h2>Available Games section</h2>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        <div>Title: {game.title}</div>
                        <div>size: {game.sizeGB}GB</div>
                        <button
                            disabled={queuedIdSet.has(game.id)}
                            onClick={() => addToQueue(game.id)}
                        >
                            {queuedIdSet.has(game.id)
                                ? "Queued"
                                : "Add to Queue"}
                        </button>
                    </li>
                ))}
            </ul>
            <h2>Download Queue section</h2>
            <ul>
                {queuedGames.map((game, index) => (
                    <li key={game.id}>
                        <div>Title: {game.title}</div>
                        {index === 0 && <p>Now Downloading</p>}
                        <button
                            disabled={index === 0}
                            onClick={() => handleMoveUp(game.id)}
                        >
                            Move Up
                        </button>
                        <button onClick={() => removeFromQueue(game.id)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
