// services/firebaseChatService.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Chat, ChatMessage } from '../type';

// Get real-time messages for a specific chat
export const getRealtimeMessages = (
  chatId: string, 
  callback: (messages: ChatMessage[]) => void
) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc')
  );

  // Set up real-time listener
  return onSnapshot(q, (querySnapshot) => {
    const messages: ChatMessage[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        chatId: data.chatId,
        content: data.content,
        senderId: data.senderId,
        type: data.type,
        timestamp: data.timestamp?.toDate?.() || new Date(),
        read: data.read || false
      });
    });
    callback(messages);
  }, (error) => {
    console.error("Error getting real-time messages:", error);
  });
};

// Send a new message using Firebase
export const sendFirebaseMessage = async (messageData: {
  chatId: string;
  content: string;
  senderId: string;
  type: string;
}): Promise<ChatMessage> => {
  try {
    const messageWithTimestamp = {
      ...messageData,
      timestamp: serverTimestamp(),
      read: false
    };

    const docRef = await addDoc(collection(db, 'messages'), messageWithTimestamp);
    
    // Update the chat's lastMessage field
    const chatRef = doc(db, 'chats', messageData.chatId);
    await updateDoc(chatRef, {
      lastMessage: messageData.content,
      lastMessageTimestamp: serverTimestamp(),
      lastMessageSenderId: messageData.senderId
    });

    // Return the newly created message
    return {
      id: docRef.id,
      ...messageData,
      timestamp: new Date(),
      read: false
    };
  } catch (error) {
    console.error("Error sending message to Firebase:", error);
    throw error;
  }
};

// Get all chats for a user with real-time updates
export const getRealtimeChats = (
  userId: string,
  callback: (chats: Chat[]) => void
) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTimestamp', 'desc')
  );

  // Set up real-time listener
  return onSnapshot(q, async (querySnapshot) => {
    const chats: Chat[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const chatData = docSnapshot.data();
      
      // Get participant details
      const participantDetails = await Promise.all(
        chatData.participants
          .filter((id: string) => id !== userId)
          .map(async (participantId: string) => {
            const userDoc = await getDoc(doc(db, 'users', participantId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              return {
                id: participantId,
                name: userData.displayName || 'Unknown User',
                avatarSrc: userData.photoURL || 'https://res.cloudinary.com/dhatjk5lm/image/upload/v1744169461/profile-placeholder.jpg'
              };
            }
            return {
              id: participantId,
              name: 'Unknown User',
              avatarSrc: 'https://res.cloudinary.com/dhatjk5lm/image/upload/v1744169461/profile-placeholder.jpg'
            };
          })
      );
      
      chats.push({
        id: docSnapshot.id,
        name: chatData.name || participantDetails[0]?.name || 'Chat',
        type: chatData.type || 'private',
        participants: chatData.participants,
        participantDetails: participantDetails,
        lastMessage: chatData.lastMessage || '',
        lastMessageTimestamp: chatData.lastMessageTimestamp?.toDate?.() || new Date(),
        unreadCount: 0 // This would need to be calculated separately
      });
    }
    
    callback(chats);
  }, (error) => {
    console.error("Error getting real-time chats:", error);
  });
};

// Mark messages as read in Firebase
export const markFirebaseMessagesAsRead = async (chatId: string, userId: string): Promise<void> => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      where('senderId', '!=', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const messageRef = doc(db, 'messages', docSnapshot.id);
      return updateDoc(messageRef, { read: true });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking messages as read in Firebase:", error);
    throw error;
  }
};
