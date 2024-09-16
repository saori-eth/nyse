import { RapierRigidBody } from "@react-three/rapier";
import type { Group, Mesh } from "three";
import { create } from "zustand";

type Entity = {
  id: string;
  name?: string;
  color?: string;
  type: "localPlayer" | "remotePlayer";
  mesh?: Mesh;
  rigidBody?: RapierRigidBody;
  head?: Group;
  headCam?: Group;
};

export type Bullet = {
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
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
    addRigidBodyToEntity: (id: string, rigidBody: RapierRigidBody) => void;
    addHeadToEntity: (id: string, head: Group) => void;
    addHeadCamToEntity: (id: string, headCam: Group) => void;
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
    addHeadToEntity: (id: string, head: Group) => {
      set((state) => {
        const entity = state.entities[id];
        if (!entity || entity.head) return state;
        return {
          entities: {
            ...state.entities,
            [id]: {
              ...entity,
              head,
            },
          },
        };
      });
    },
    addHeadCamToEntity: (id: string, headCam: Group) => {
      set((state) => {
        const entity = state.entities[id];
        if (!entity || entity.headCam) return state;
        return {
          entities: {
            ...state.entities,
            [id]: {
              ...entity,
              headCam,
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
    addRigidBodyToEntity: (id: string, rigidBody: RapierRigidBody) => {
      set((state) => {
        const entity = state.entities[id];
        if (!entity || entity.rigidBody) return state;
        return {
          entities: {
            ...state.entities,
            [id]: {
              ...entity,
              rigidBody,
            },
          },
        };
      });
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
