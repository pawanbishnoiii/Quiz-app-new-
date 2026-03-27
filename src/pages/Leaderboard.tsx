import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, collection, getDocs, query, orderBy, limit } from "../firebase";
import { User } from "../types";
import { Trophy, Medal, Star, TrendingUp, Search, ChevronRight } from "lucide-react";

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(50));
        const snapshot = await getDocs(q);
        setUsers(snapshot.docs.map(doc => ({ ...doc.data() } as User)));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 mb-4"
        >
          <Trophy className="h-10 w-10" />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          Global <span className="text-orange-500">Leaderboard</span>
        </h1>
        <p className="text-zinc-500 max-w-lg mx-auto">
          Compete with thousands of students and climb the ranks to become the ultimate Bnoy champion.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 md:gap-8 px-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center group"
          >
            <div className="relative mb-4">
              <div className="h-20 w-20 rounded-full border-4 border-zinc-400 overflow-hidden bg-zinc-800">
                {topThree[1].photoURL ? (
                  <img src={topThree[1].photoURL} alt={topThree[1].name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-zinc-500">
                    {topThree[1].name[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-zinc-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                2
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-white truncate max-w-[100px]">{topThree[1].name}</div>
              <div className="text-xs font-black text-orange-500 uppercase tracking-widest">{topThree[1].xp || 0} XP</div>
            </div>
            <div className="mt-4 h-24 w-24 bg-zinc-900 rounded-t-2xl border-x border-t border-zinc-800 flex items-center justify-center">
              <Medal className="h-8 w-8 text-zinc-400" />
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center group"
          >
            <div className="relative mb-4">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Trophy className="h-8 w-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              </div>
              <div className="h-28 w-28 rounded-full border-4 border-yellow-500 overflow-hidden bg-zinc-800 shadow-xl shadow-yellow-500/20">
                {topThree[0].photoURL ? (
                  <img src={topThree[0].photoURL} alt={topThree[0].name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-zinc-500">
                    {topThree[0].name[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-lg shadow-lg">
                1
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-white text-lg truncate max-w-[120px]">{topThree[0].name}</div>
              <div className="text-sm font-black text-orange-500 uppercase tracking-widest">{topThree[0].xp || 0} XP</div>
            </div>
            <div className="mt-4 h-32 w-32 bg-gradient-to-t from-orange-500/20 to-zinc-900 rounded-t-2xl border-x border-t border-orange-500/30 flex items-center justify-center">
              <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center group"
          >
            <div className="relative mb-4">
              <div className="h-16 w-16 rounded-full border-4 border-orange-700 overflow-hidden bg-zinc-800">
                {topThree[2].photoURL ? (
                  <img src={topThree[2].photoURL} alt={topThree[2].name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xl font-bold text-zinc-500">
                    {topThree[2].name[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-orange-700 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                3
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-white truncate max-w-[80px]">{topThree[2].name}</div>
              <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{topThree[2].xp || 0} XP</div>
            </div>
            <div className="mt-4 h-20 w-20 bg-zinc-900 rounded-t-2xl border-x border-t border-zinc-800 flex items-center justify-center">
              <Medal className="h-6 w-6 text-orange-700" />
            </div>
          </motion.div>
        )}
      </div>

      {/* List of Others */}
      <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Top Performers
          </h3>
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {users.length} Students Ranked
          </div>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                <div className="h-6 w-6 bg-zinc-800 rounded"></div>
                <div className="h-10 w-10 bg-zinc-800 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                  <div className="h-3 w-20 bg-zinc-800 rounded"></div>
                </div>
                <div className="h-6 w-16 bg-zinc-800 rounded"></div>
              </div>
            ))
          ) : others.map((user, index) => (
            <motion.div 
              key={user.uid}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 text-center font-black text-zinc-600 group-hover:text-orange-500 transition-colors">
                {index + 4}
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 group-hover:border-orange-500/50 transition-all">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-zinc-500">
                    {user.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white group-hover:text-orange-500 transition-colors">{user.name}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {user.language || 'Hindi'} • {user.streak || 0} Day Streak
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-white">{user.xp || 0}</div>
                <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">XP</div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-orange-500 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
