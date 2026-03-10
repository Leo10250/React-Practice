import { useState } from "react";

const TrophySearch = ({ data = [] }) => {
    const [searchValue, setSearchValue] = useState("");
    const [earnedOnlyEnabled, setEarnedOnlyEnabled] = useState(false);
    const [selectedSortType, setSelectedSortType] = useState("title");

    const sortTypes = ["title", "points"];
    const filteredTrophies = data
        .filter((trophy) => {
            const matchSearchTerm = trophy.title
                .toLowerCase()
                .includes(searchValue.toLowerCase());
            const isEarned = earnedOnlyEnabled ? trophy.earned : true;
            return matchSearchTerm && isEarned;
        })
        .sort((a, b) => {
            if (selectedSortType === "title") {
                return a[selectedSortType].localeCompare(b[selectedSortType]);
            } else if (selectedSortType === "points") {
                return a[selectedSortType] - b[selectedSortType];
            }
            return 0;
        });

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleCheckboxChange = () => {
        setEarnedOnlyEnabled((prev) => !prev);
    };

    const handleSelectSortType = (e) => {
        setSelectedSortType(e.target.value);
    };
    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px"}}>
                <label style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    Trophy Name
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="Enter trophy name"
                />
                </label>
                <label style={{display: "flex", flexDirection: "column"}}>
                    Earned Only
                <input
                    type="checkbox"
                    checked={earnedOnlyEnabled}
                    onChange={handleCheckboxChange}
                />
                </label>
                <label style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                Sort By
                <select
                    value={selectedSortType}
                    onChange={handleSelectSortType}
                >
                    {sortTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                </label>
            </div>
            {filteredTrophies.length === 0 && <p>No trophies found.</p>}
            <ul
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 0,
                    listStyle: "none",
                }}
            >
                {filteredTrophies.map((trophy) => (
                    <li
                        key={trophy.id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "10px",
                            border: "1px solid black",
                            borderRadius: "5px",
                            wordWrap: "normal",
                            minWidth: "150px",
                            maxWidth: "400px",
                        }}
                    >
                        <div>{`Title: ${trophy.title}`}</div>
                        <div>{`Points: ${trophy.points}`}</div>
                        <div>{`Earned: ${trophy.earned ? "Yes" : "No"}`}</div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default TrophySearch;
