import React, { useEffect, useState } from "react";
import "./App.css";

const initialPlayers = [
    { id: 1, name: "Amy", isReady: true },
    { id: 2, name: "Kinsley", isReady: false },
    { id: 3, name: "Bochen", isReady: false },
    { id: 4, name: "Jeremy", isReady: true },
];

function PlayStationPartyReadyCheck() {
    const [players, setPlayers] = useState(initialPlayers);
    const numReadyPlayers = players.filter((player) => player.isReady).length;
    const canLauch = numReadyPlayers === players.length;
    const [countDown, setCountDown] = useState(5);
    const countDownCompleted = countDown === 0;
    const toggleReady = (playerId) => {
        setPlayers((prev) =>
            prev.map((player) => {
                if (player.id === playerId) {
                    return { ...player, isReady: !player.isReady };
                }
                return player;
            }),
        );
        setCountDown(5);
    };

    useEffect(() => {
        if (!canLauch || countDown <= 0) {
            return;
        }
        const timerId = setTimeout(
            () => setCountDown((prev) => prev - 1),
            1000,
        );
        return () => clearTimeout(timerId);
    }, [canLauch, countDown]);
    return (
        <div>
            <p>Total Number of Players: {players.length}</p>
            <p>Number of Ready Players: {numReadyPlayers}</p>
            <p>{canLauch ? "Can launch" : "Waiting for players"}</p>
            {canLauch && !countDownCompleted && (
                <p>Launching in {countDown}...</p>
            )}
            {countDownCompleted && <p>Match launched!</p>}
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        <p>Name: {player.name}</p>
                        <p>
                            Status: {player.isReady ? "Is Ready" : "Not Ready"}
                        </p>
                        <button
                            onClick={() => toggleReady(player.id)}
                            disabled={countDownCompleted}
                        >
                            {player.isReady ? "Unready" : "Mark Ready"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlayStationPartyReadyCheck;
