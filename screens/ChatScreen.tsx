// File: screens/ChatScreen.tsx
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { 
  auth, 
  messagesCollection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  signOut 
} from "../firebase";

type MessageType = {
  id: string;
  text: string;
  email: string;
  createdAt: any;
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ navigation, route }: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  
  // GUNAKAN REF PENGGANTI 'this'
  const flatListRef = useRef<FlatList>(null);
  
  const currentUserEmail = auth.currentUser?.email;

  // Logout Button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => signOut(auth).catch(console.error)}>
          <Text style={{ color: "red", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Listener Real-time
  useEffect(() => {
    const q = query(messagesCollection, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: MessageType[] = [];
      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...(doc.data() as Omit<MessageType, "id">),
        });
      });
      setMessages(list);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(messagesCollection, {
        text: message,
        email: currentUserEmail,
        createdAt: serverTimestamp(),
      });
      setMessage(""); 
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
    }
  };

  const renderItem = ({ item }: { item: MessageType }) => {
    const isMyMessage = item.email === currentUserEmail;
    return (
      <View style={[
        styles.msgBox, 
        isMyMessage ? styles.myMsg : styles.otherMsg
      ]}>
        <Text style={styles.sender}>
          {isMyMessage ? "Saya" : item.email?.split('@')[0]}
        </Text>
        <Text style={styles.msgText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        // PERBAIKAN DI SINI: Menggunakan flatListRef
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
        // Auto-scroll saat size konten berubah (ada chat baru)
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        // Auto-scroll saat layout berubah (keyboard muncul)
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>KIRIM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  msgBox: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#d1f0ff", 
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  otherMsg: {
    backgroundColor: "#f0f0f0", 
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  sender: {
    fontSize: 10,
    color: "#888",
    marginBottom: 2,
    alignSelf: "flex-start"
  },
  msgText: { fontSize: 16, color: "#000" },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center"
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#f9f9f9"
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  }
});