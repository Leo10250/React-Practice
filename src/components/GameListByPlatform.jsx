import { useState } from "react";

const games = [
    { id: 1, title: "Astro Bot", platform: "PS5", score: 94 },
    { id: 2, title: "Helldivers 2", platform: "PS5", score: 82 },
    { id: 3, title: "God of War", platform: "PS4", score: 94 },
    { id: 4, title: "The Last of Us", platform: "PS5", score: 93 },
];

const GameListByPlatform = () => {
    const [selectedPlatform, setSelectedPlatform] = useState("All");
    const [selectedGameId, setSelectedGameId] = useState(null);
    const platforms = ["All", ...new Set(games.map((game) => game.platform))];
    const filteredGames = games.filter(
        (game) =>
            game.platform.toLowerCase() === selectedPlatform.toLowerCase() ||
            selectedPlatform === "All",
    );
    const selectedGame = filteredGames.find(
        (game) => game.id === selectedGameId,
    );

    const handlePlatformSelect = (e) => {
        setSelectedPlatform(e.target.name);
    };

    return (
        <>
            {platforms.map((platform) => (
                <button
                    name={platform}
                    key={platform}
                    onClick={handlePlatformSelect}
                    style={{}}
                >
                    {platform}
                </button>
            ))}
            {filteredGames.length === 0 ? (
                <p>No games found</p>
            ) : (
                <ul style={{ listStyle: "none" }}>
                    {filteredGames.map((game) => (
                        <li
                            key={game.id}
                            onClick={() => setSelectedGameId(game.id)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                backgroundColor:
                                    selectedGameId === game.id
                                        ? "yellow"
                                        : undefined,
                                padding: "10px",
                                border: "1px solid black",
                            }}
                        >
                            <div>{game.title}</div>
                        </li>
                    ))}
                </ul>
            )}
            {selectedGame ? (
                <>
                    <div>Title: {selectedGame.title}</div>
                    <div>Platform: {selectedGame.platform}</div>
                    <div>Score: {selectedGame.score}</div>
                </>
            ) : (
                <p>No game selected</p>
            )}
        </>
    );
};

export default GameListByPlatform;
