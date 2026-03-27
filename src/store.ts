import { create } from "zustand";
import { User, Course, Test, Banner } from "./types";

interface AppState {
  user: User | null;
  courses: Course[];
  tests: Test[];
  banners: Banner[];
  loading: boolean;
  setUser: (user: User | null) => void;
  setCourses: (courses: Course[]) => void;
  setTests: (tests: Test[]) => void;
  setBanners: (banners: Banner[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  courses: [],
  tests: [],
  banners: [],
  loading: true,
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
  setTests: (tests) => set({ tests }),
  setBanners: (banners) => set({ banners }),
  setLoading: (loading) => set({ loading }),
}));
