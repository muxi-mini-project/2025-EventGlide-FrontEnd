import { create } from 'zustand';

interface DoorStoreState {
  doorStatus: 'loading' | 'pass' | 'block';
  setDoorStatus: (status: 'loading' | 'pass' | 'block') => void;
}

const useDoorStore = create<DoorStoreState>((set) => ({
  doorStatus: 'loading',
  setDoorStatus: (status: 'loading' | 'pass' | 'block') => set({ doorStatus: status }),
}));

export default useDoorStore;
