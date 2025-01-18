import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      folders: [
        { id: 'default', name: 'All Chats', isDefault: true },
        { id: 'important', name: 'Important' },
        { id: 'archived', name: 'Archived' },
      ],

      // Conversation Management
      addConversation: () => {
        const newConversation = {
          id: Date.now().toString(),
          title: '',
          messages: [],
          folderId: 'default',
          timestamp: new Date(),
          isImportant: false,
          isArchived: false,
        };

        set(state => ({
          conversations: [...state.conversations, newConversation],
          activeConversationId: newConversation.id,
        }));

        return newConversation.id;
      },

      deleteConversation: (id) => {
        set(state => ({
          conversations: state.conversations.filter(c => c.id !== id),
          activeConversationId: state.activeConversationId === id 
            ? null 
            : state.activeConversationId,
        }));
      },

      updateConversation: (id, updates) => {
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find(c => c.id === state.activeConversationId);
      },

      // Message Management
      addMessage: (message) => {
        const state = get();
        const conversation = state.conversations.find(
          c => c.id === state.activeConversationId
        );

        if (conversation) {
          const updatedConversation = {
            ...conversation,
            messages: [...conversation.messages, message],
            timestamp: new Date(),
          };

          // Update conversation title if it's the first message
          if (!conversation.title && message.sender === 'user') {
            updatedConversation.title = message.text.slice(0, 30);
          }

          set(state => ({
            conversations: state.conversations.map(c =>
              c.id === state.activeConversationId ? updatedConversation : c
            ),
          }));
        }
      },

      deleteMessage: (conversationId, messageId) => {
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.filter(m => m.id !== messageId),
                }
              : c
          ),
        }));
      },

      updateMessage: (conversationId, messageId, updates) => {
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                }
              : c
          ),
        }));
      },

      // Folder Management
      addFolder: (name) => {
        const newFolder = {
          id: Date.now().toString(),
          name,
          isDefault: false,
        };

        set(state => ({
          folders: [...state.folders, newFolder],
        }));

        return newFolder.id;
      },

      deleteFolder: (id) => {
        set(state => ({
          folders: state.folders.filter(f => f.id !== id),
          // Move conversations to default folder
          conversations: state.conversations.map(c =>
            c.folderId === id ? { ...c, folderId: 'default' } : c
          ),
        }));
      },

      updateFolder: (id, updates) => {
        set(state => ({
          folders: state.folders.map(f =>
            f.id === id ? { ...f, ...updates } : f
          ),
        }));
      },

      // Search and Filter
      getAllMessages: () => {
        const state = get();
        return state.conversations.flatMap(c =>
          c.messages.map(m => ({
            ...m,
            conversationId: c.id,
            conversationTitle: c.title,
          }))
        );
      },

      searchMessages: (query, filters = {}) => {
        const state = get();
        const allMessages = state.getAllMessages();
        
        return allMessages.filter(message => {
          // Text search
          const matchesQuery = message.text.toLowerCase().includes(query.toLowerCase());
          if (!matchesQuery) return false;

          // Type filters
          if (filters.type && message.type !== filters.type) return false;

          // Date filters
          if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            if (new Date(message.timestamp) < startDate) return false;
          }
          if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            if (new Date(message.timestamp) > endDate) return false;
          }

          return true;
        });
      },

      // Conversation Actions
      markAsImportant: (id) => {
        const state = get();
        state.updateConversation(id, {
          isImportant: true,
          folderId: 'important',
        });
      },

      unmarkAsImportant: (id) => {
        const state = get();
        state.updateConversation(id, {
          isImportant: false,
          folderId: 'default',
        });
      },

      archiveConversation: (id) => {
        const state = get();
        state.updateConversation(id, {
          isArchived: true,
          folderId: 'archived',
        });
      },

      unarchiveConversation: (id) => {
        const state = get();
        state.updateConversation(id, {
          isArchived: false,
          folderId: 'default',
        });
      },
    }),
    {
      name: 'chat-store',
      version: 1,
    }
  )
);

export default useChatStore;
