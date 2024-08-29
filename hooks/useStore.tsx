import type { Mesh, Vector3 } from "three";
import { create } from "zustand";

type Entity = {
  id: string;
  name?: string;
  color?: string;
  type: "localPlayer" | "remotePlayer";
  mesh?: Mesh;
};

type Bullet = {
  id: string;
  position: Vector3;
  direction: Vector3;
  mesh?: Mesh;
};

export type Store = {
  localId: string;
  entities: Record<string, Entity>;
  bullets: Bullet[];
  actions: {
    addLocalEntity: (entity: Entity) => void;
    addEntity: (entity: Entity) => void;
    addBullet: (bullet: Bullet) => void;
    addMeshToEntity: (id: string, mesh: Mesh) => void;
    removeEntity: (id: string) => void;
    removeBullet: (id: string) => void;
  };
  selectors: {
    getEntities: () => Entity[];
    getEntityById: (id: string) => Entity | undefined;
    getLocalEntity: () => Entity | undefined;
    getBullets: () => Bullet[];
  };
};

export const useStore = create<Store>((set, get) => ({
  localId: "",
  animation: "idle",
  entities: {},
  bullets: [],
  actions: {
    addLocalEntity: (entity: Entity) => {
      set((state) => ({
        localId: entity.id,
        entities: {
          ...state.entities,
          [entity.id]: entity,
        },
      }));
    },
    addEntity: (entity: Entity) => {
      set((state) => ({
        entities: {
          ...state.entities,
          [entity.id]: entity,
        },
      }));
    },
    addMeshToEntity: (id: string, mesh: Mesh) => {
      set((state) => {
        const entity = state.entities[id];
        if (!entity || entity.mesh) return state;
        return {
          entities: {
            ...state.entities,
            [id]: {
              ...entity,
              mesh,
            },
          },
        };
      });
    },
    addBullet: (bullet: Bullet) => {
      set((state) => ({
        bullets: [...state.bullets, bullet],
      }));
    },
    removeBullet: (id: string) => {
      set((state) => ({
        bullets: state.bullets.filter((bullet) => bullet.id !== id),
      }));
    },
    removeEntity: (id: string) => {
      set((state) => {
        const { [id]: _, ...rest } = state.entities;
        return { entities: rest };
      });
    },
  },
  selectors: {
    getLocalEntity: () => get().entities[get().localId],
    getEntityById: (id: string) => get().entities[id],
    getEntities: () => Object.values(get().entities),
    getBullets: () => get().bullets,
  },
}));
