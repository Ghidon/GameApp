import React, { useState, useEffect } from "react";

export const GamePlayersList = ({
  playerDetails,
  creator,
  current_user,
  GameDetailsRemovePlayer,
}) => {
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (creator === current_user) {
      setIsCreator(true);
    }
  }, []);

  const removePlayerFromGame = () => {
    GameDetailsRemovePlayer(playerDetails.email);
  };

  return (
    <div className="d-flex flex-column playerWrapper">
      <div className="playerImage">
        {isCreator && (
          <div className="con-tooltip right">
            <span className="removePlayer" onClick={removePlayerFromGame}>
              X
            </span>
            <div className="tooltip">
              <span>Remove Player</span>
            </div>
          </div>
        )}
      </div>
      <div className="text-center">{playerDetails.first_name}</div>
    </div>
  );
};
