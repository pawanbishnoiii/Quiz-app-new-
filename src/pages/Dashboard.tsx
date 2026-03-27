import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store";
import { db, collection, getDocs, query, where, limit, orderBy } from "../firebase";
import { Course, Test, Result } from "../types";
import { Trophy, Flame, Zap, Clock, ChevronRight, PlayCircle, FileText, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAppStore();
  const [recommendedTestSeries, setRecommendedTestSeries] = useState<Course[]>([]);
  const [recentTests, setRecentTests] = useState<Test[]>([]);
  const [latestResults, setLatestResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Recommended test series based on exam prep
        const coursesSnap = await getDocs(
          query(collection(db, "testSeries"), where("category", "==", user.examPrep || "SSC"), limit(3))
        );
        setRecommendedTestSeries(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      } catch (e) {
        console.error("Error fetching testSeries:", e);
      }

      try {
        // Recent tests
        const testsSnap = await getDocs(query(collection(db, "tests"), limit(4)));
        setRecentTests(testsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test)));
      } catch (e) {
        console.error("Error fetching tests:", e);
      }

      try {
        // Latest results for this user
        const resultsSnap = await getDocs(
          query(collection(db, "results"), where("userId", "==", user.uid), orderBy("timestamp", "desc"), limit(3))
        );
        setLatestResults(resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result)));
      } catch (e) {
        console.error("Error fetching results:", e);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Header */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            Welcome back, <span className="text-orange-500">{user.name.split(' ')[0]}</span>!
          </h1>
          <p className="mt-1 text-zinc-500">You're preparing for <span className="text-zinc-300 font-bold">{user.examPrep}</span>. Keep it up!</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-orange-500/50">
            <div className="rounded-xl bg-orange-500/10 p-2 text-orange-500">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{user.streak}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Day Streak</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-blue-500/50">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{user.xp}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total XP</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Column: Test Series & Tests */}
        <div className="lg:col-span-2 space-y-10">
          {/* Recommended Test Series */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">Recommended for You</h2>
              <Link to="/test-series" className="text-sm font-medium text-orange-500 hover:underline">View All</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {recommendedTestSeries.map((course) => (
                <Link 
                  key={course.id} 
                  to={`/test-series/${course.id}`}
                  className="group flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <h3 className="font-bold leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-orange-500">{course.category}</span>
                      <span>₹{course.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Tests */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">Practice Tests</h2>
              <Link to="/test-series" className="text-sm font-medium text-orange-500 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div 
                  key={test.id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl p-3 ${
                      test.type === 'Full' ? 'bg-orange-500/10 text-orange-500' : 
                      test.type === 'Topic' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{test.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>{test.questionsCount} Questions</span>
                        <span>•</span>
                        <span>{test.duration} Mins</span>
                        <span>•</span>
                        <span className="font-medium text-zinc-400">{test.type} Test</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={`/test/${test.id}`}
                    className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500 transition-all"
                  >
                    Start <PlayCircle className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Progress & Activity */}
        <div className="space-y-10">
          {/* Latest Results */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-bold tracking-tight mb-6">Recent Performance</h2>
            <div className="space-y-6">
              {latestResults.length > 0 ? latestResults.map((res) => (
                <div key={res.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                      {res.accuracy}%
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Score: {res.score}</div>
                      <div className="text-[10px] text-zinc-500">{new Date(res.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Link to={`/result/${res.id}`} className="text-xs font-bold text-orange-500 hover:underline">Details</Link>
                </div>
              )) : (
                <div className="text-center py-10">
                  <Trophy className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-sm text-zinc-500">No tests taken yet. Start your first test today!</p>
                </div>
              )}
            </div>
            {latestResults.length > 0 && (
              <button className="mt-8 w-full rounded-xl border border-zinc-800 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                View Full History
              </button>
            )}
          </section>

          {/* Daily Goal */}
          <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-xl shadow-orange-500/20">
            <h2 className="text-lg font-bold">Daily Goal</h2>
            <p className="mt-1 text-xs opacity-80">Complete 2 tests to maintain your streak.</p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Progress</span>
                <span>50%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-1/2 bg-white"></div>
              </div>
            </div>
            <button className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-bold text-orange-500 hover:bg-orange-50 transition-all">
              Continue Learning
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
