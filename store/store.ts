import { BlogPost } from "@/lib/types";
import { create } from "zustand";

type GlobalState = {
  blogs: BlogPost[];
  setBlogs: (blogs: BlogPost[]) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  blogs: [],
  setBlogs: (blogs) => set({ blogs }),
}));
