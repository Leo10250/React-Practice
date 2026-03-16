import { useState } from "react";
import "./styles.css";

const friends = [
    { id: 1, name: "Alex", online: true },
    { id: 2, name: "Sam", online: false },
    { id: 3, name: "Jordan", online: true },
    { id: 4, name: "Taylor", online: true },
    { id: 5, name: "Morgan", online: false },
];

export default function InviteManager() {
    const [searchValue, setSearchValue] = useState("");
    const [invitedPlayerIds, setInvitedPlayerIds] = useState([]);

    const inviteQueueIsFull = invitedPlayerIds.length >= 3;

    const filteredPlayers = friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const visiblePlayerNum = filteredPlayers.length;

    const handleReset = () => {
        setSearchValue("");
        setInvitedPlayerIds([]);
    };

    const handleCreateParty = () => {
        console.log(invitedPlayerIds);
    };

    const handleInvite = (id) => {
        setInvitedPlayerIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((currId) => currId !== id);
            }

            if (prev.length >= 3) {
                return prev;
            }

            return [...prev, id];
        });
    };

    return (
        <>
            <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search friends"
            />

            <ul>
                {filteredPlayers.map((player) => {
                    const isInvited = invitedPlayerIds.includes(player.id);
                    const cannotBeInvited =
                        !player.online || (inviteQueueIsFull && !isInvited);

                    return (
                        <li key={player.id}>
                            <p>Name: {player.name}</p>
                            <p>
                                Status: {player.online ? "Online" : "Offline"}
                            </p>

                            <label>
                                Invite
                                <input
                                    type="checkbox"
                                    checked={isInvited}
                                    onChange={() => handleInvite(player.id)}
                                    disabled={cannotBeInvited}
                                />
                            </label>
                        </li>
                    );
                })}
            </ul>

            <button onClick={handleReset}>Reset</button>
            <button onClick={handleCreateParty}>Create Party</button>

            <p>{`Invited: ${invitedPlayerIds.length} / 3`}</p>
            <p>{`Visible friends: ${visiblePlayerNum}`}</p>
        </>
    );
}
