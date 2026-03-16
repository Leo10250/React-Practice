import React, { useState } from "react";
import "./App.css";

const initialQueue = [
    { id: 1, title: "Astro Bot", category: "game" },
    { id: 2, title: "Helldivers 2 Patch 1.03", category: "update" },
    { id: 3, title: "Elden Ring: Shadow of the Erdtree", category: "dlc" },
    { id: 4, title: "God of War Ragnarök", category: "game" },
];

function App() {
    const [queue, setQueue] = useState(initialQueue);

    const totalItems = queue.length;
    const nextDownloadTitle = queue.length > 0 ? queue[0].title : "None";

    const handleMoveUp = (index) => {
        if (index <= 0) return;

        const nextQueue = [...queue];
        [nextQueue[index - 1], nextQueue[index]] = [
            nextQueue[index],
            nextQueue[index - 1],
        ];
        setQueue(nextQueue);
    };

    const handleMoveDown = (index) => {
        if (index === -1 || index >= queue.length - 1) return;

        const nextQueue = [...queue];
        [nextQueue[index], nextQueue[index + 1]] = [
            nextQueue[index + 1],
            nextQueue[index],
        ];
        setQueue(nextQueue);
    };

    const handleRemove = (itemId) => {
        setQueue((prev) => prev.filter((item) => item.id !== itemId));
    };

    return (
        <div>
            <p>Total items: {totalItems}</p>
            <p>Next download: {nextDownloadTitle}</p>

            {queue.length === 0 ? (
                <p>No downloads queued</p>
            ) : (
                <ul>
                    {queue.map((item, index) => (
                        <li key={item.id}>
                            <p>Title: {item.title}</p>
                            <p>Category: {item.category}</p>
                            <p>Position: {index + 1}</p>

                            <button
                                disabled={index === 0}
                                onClick={() => handleMoveUp(index)}
                            >
                                Move Up
                            </button>

                            <button
                                disabled={index === queue.length - 1}
                                onClick={() => handleMoveDown(index)}
                            >
                                Move Down
                            </button>

                            <button onClick={() => handleRemove(item.id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
