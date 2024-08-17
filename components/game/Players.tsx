import { myPlayer, PlayerState, usePlayersList } from "playroomkit";
import { LocalPlayer } from "./LocalPlayer";
import { RemotePlayer } from "./RemotePlayer";
import { Suspense } from "react";

interface PlayersProps {
  user: {
    name: string;
    color: string;
  };
}

export const Players = (props: PlayersProps) => {
  const players: PlayerState[] = usePlayersList(true);
  return (
    <group name="players">
      {players.map((player) =>
        player.id === myPlayer().id ? (
          <LocalPlayer key={player.id} player={player} user={props.user} />
        ) : (
          <Suspense key={player.id} fallback={null}>
            <RemotePlayer
              key={player.id}
              id={player.id}
              position={player.getState("position")}
              rotation={player.getState("rotation")}
              name={player.getState("name")}
              color={player.getState("color")}
            />
          </Suspense>
        )
      )}
    </group>
  );
};
