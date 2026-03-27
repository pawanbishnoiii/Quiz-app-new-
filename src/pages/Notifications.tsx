import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, collection, getDocs, query, where, orderBy, updateDoc, doc } from "../firebase";
import { useAppStore } from "../store";
import { Notification } from "../types";
import { Bell, Check, Trash2, Clock, BellOff } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const userQ = query(
          collection(db, "notifications"), 
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const globalQ = query(
          collection(db, "notifications"),
          where("userId", "==", "global"),
          orderBy("timestamp", "desc")
        );
        
        const [userSnap, globalSnap] = await Promise.all([
          getDocs(userQ),
          getDocs(globalQ)
        ]);

        const allNotifications = [
          ...userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)),
          ...globalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setNotifications(allNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.userId !== "global") {
      await updateDoc(doc(db, "notifications", id), { read: true });
    }
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    const unreadPersonal = unread.filter(n => n.userId !== "global");
    await Promise.all(unreadPersonal.map(n => updateDoc(doc(db, "notifications", n.id), { read: true })));
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Your <span className="text-orange-500">Notifications</span>
          </h1>
          <p className="text-zinc-500">Stay updated with the latest news and alerts.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:underline"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 w-full rounded-3xl bg-zinc-900/50 animate-pulse"></div>
          ))
        ) : notifications.length > 0 ? (
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative overflow-hidden rounded-3xl border p-6 transition-all ${
                  n.read 
                    ? "border-zinc-800 bg-zinc-900/20" 
                    : "border-orange-500/30 bg-orange-500/5 shadow-lg shadow-orange-500/5"
                }`}
              >
                {!n.read && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-orange-500"></div>
                )}
                <div className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    n.read ? "bg-zinc-800 text-zinc-500" : "bg-orange-500 text-white"
                  }`}>
                    <Bell className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold ${n.read ? "text-zinc-300" : "text-white"}`}>{n.title}</h3>
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {new Date(n.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{n.message}</p>
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="mt-3 text-xs font-bold text-orange-500 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 mb-6">
              <BellOff className="h-10 w-10 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No notifications yet</h3>
            <p className="text-zinc-500 mt-2">We'll notify you when something important happens.</p>
          </div>
        )}
      </div>
    </div>
  );
}
