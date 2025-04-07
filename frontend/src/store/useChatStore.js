import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    unreadMessagesMap: {}, // userId -> true if unread
  
    getUsers: async () => {
      set({ isUsersLoading: true });
      try {
        const res = await axiosInstance.get("/message/users");
        set({ users: res.data });
      } catch (error) {
        toast.error(error.response?.data?.messages || "Failed to load users");
      } finally {
        set({ isUsersLoading: false });
      }
    },
  
    getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get(`/message/${userId}`);
        set({ messages: res.data });
  
        // Mark messages as read
        const unreadMap = { ...get().unreadMessagesMap };
        delete unreadMap[userId];
        set({ unreadMessagesMap: unreadMap });
  
      } catch (error) {
        toast.error(error.response?.data?.messages || "Failed to load messages");
      } finally {
        set({ isMessagesLoading: false });
      }
    },

    moveUserToTop: (userId) => {
        const users = [...get().users];
        const userIndex = users.findIndex(u => u._id === userId);
        if (userIndex !== -1) {
          const [user] = users.splice(userIndex, 1);
          users.unshift(user);
          set({ users });
        }
    },
      
  
    sendMessage: async (messageData) => {
        const { selectedUser, messages, moveUserToTop } = get();
        try {
          const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
          moveUserToTop(selectedUser._id); // 👈 Move to top on send
        } catch (error) {
          toast.error(error.response?.data?.message || "Message failed");
        }
    },
      
  
    subscribeToMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.on("newMessage", (newMessage) => {
        const { selectedUser, messages, unreadMessagesMap , moveUserToTop } = get();
        const isFromSelectedUser = newMessage.senderId === selectedUser?._id;
  
        if (isFromSelectedUser) {
          // User is viewing this chat, append directly
          set({ messages: [...messages, newMessage] });
        } else {
          // Mark as unread
          set({
            unreadMessagesMap: {
              ...unreadMessagesMap,
              [newMessage.senderId]: true,
            },
          });
        }

        moveUserToTop(newMessage.senderId); // 👈 Move sender to top

      });
    },
  
    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
    },
  
    setSelectedUser: (user) => {
      // Mark messages from this user as read
      const unreadMap = { ...get().unreadMessagesMap };
      delete unreadMap[user._id];
      set({ selectedUser: user, unreadMessagesMap: unreadMap });
    },
  }));
  