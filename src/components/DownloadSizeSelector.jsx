import { useState } from "react";
import "./styles.css";

const games = [
  { id: 1, title: "Astro Bot", sizeGB: 18 },
  { id: 2, title: "Helldivers 2", sizeGB: 70 },
  { id: 3, title: "God of War Ragnarök", sizeGB: 84 },
  { id: 4, title: "Ratchet & Clank", sizeGB: 42 },
];

export default function DownloadSizeSelector() {
  const [selectedGameIds, setSelectedGameIds] = useState([]);

  const selectedGames = selectedGameIds
    .map((id) => games.find((game) => game.id === id))
    .filter(Boolean);

  const totalSize = selectedGames.reduce((total, game) => {
    return total + game.sizeGB;
  }, 0);

  const exceedsMaxSize = totalSize > 120;

  const handleChange = (currId) => {
    setSelectedGameIds((prev) => {
      if (prev.includes(currId)) {
        return prev.filter((id) => id !== currId);
      }
      return [...prev, currId];
    });
  };

  const handleInstall = () => {
    console.log(selectedGameIds);
  };

  return (
    <>
      <ul>
        {games.map((game) => {
          const isSelected = selectedGameIds.includes(game.id);

          return (
            <li key={game.id}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleChange(game.id)}
              />
              <p>Title: {game.title}</p>
              <p>Size: {game.sizeGB} GB</p>
            </li>
          );
        })}
      </ul>

      {exceedsMaxSize && <p>Exceeded max install size</p>}

      <button
        disabled={selectedGameIds.length === 0}
        onClick={handleInstall}
      >
        Install
      </button>

      <button onClick={() => setSelectedGameIds([])}>
        Clear Selection
      </button>

      <p>Selected games: {selectedGameIds.length}</p>
      <p>Total size: {totalSize} GB</p>
    </>
  );
}