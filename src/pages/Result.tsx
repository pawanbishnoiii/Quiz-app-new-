import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, doc, getDoc } from "../firebase";
import { Result, Test } from "../types";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Share2, 
  RotateCcw,
  BarChart3,
  Zap
} from "lucide-react";

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<Result | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const resSnap = await getDoc(doc(db, "results", id));
      if (resSnap.exists()) {
        const resData = { id: resSnap.id, ...resSnap.data() } as Result;
        setResult(resData);
        
        const testSnap = await getDoc(doc(db, "tests", resData.testId));
        if (testSnap.exists()) {
          setTest({ id: testSnap.id, ...testSnap.data() } as Test);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading || !result || !test) return <div className="p-20 text-center animate-pulse">Calculating your results...</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 shadow-2xl shadow-orange-500/40"
        >
          <Trophy className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Test Completed!</h1>
        <p className="mt-2 text-zinc-500">Great job on finishing the <span className="text-zinc-300 font-bold">{test.title}</span>.</p>
      </header>

      {/* Score Overview */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <div className="text-4xl font-black text-white">{result.score}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Total Score</div>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <div className="text-4xl font-black text-orange-500">{result.accuracy}%</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Accuracy</div>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <div className="text-4xl font-black text-blue-500">#{result.rank || 'N/A'}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Rank</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h2 className="text-xl font-bold tracking-tight mb-8 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" /> Performance Analysis
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> Correct
              </div>
              <span className="font-bold text-white">{Math.floor(result.score)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-400">
                <XCircle className="h-5 w-5 text-red-500" /> Incorrect
              </div>
              <span className="font-bold text-white">{result.attempted - Math.floor(result.score)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-400">
                <Target className="h-5 w-5 text-blue-500" /> Attempted
              </div>
              <span className="font-bold text-white">{result.attempted} / {test.questionsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-400">
                <Clock className="h-5 w-5 text-purple-500" /> Time Taken
              </div>
              <span className="font-bold text-white">{formatTime(result.timeTaken)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col justify-center text-center">
          <div className="mb-6 inline-flex mx-auto rounded-2xl bg-orange-500/10 p-4 text-orange-500">
            <Zap className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-white">Next Steps</h3>
          <p className="mt-2 text-zinc-500">Review your solutions to understand your mistakes and improve your score.</p>
          
          <div className="mt-10 grid grid-cols-2 gap-4">
            <button className="rounded-2xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
              View Solutions
            </button>
            <button className="rounded-2xl border border-zinc-800 py-4 font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
              Leaderboard
            </button>
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
        <Link 
          to="/dashboard"
          className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-10 py-4 font-bold text-white hover:bg-zinc-800 transition-all"
        >
          Back to Dashboard
        </Link>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-10 py-4 font-bold text-black hover:bg-white transition-all">
          <Share2 className="h-5 w-5" /> Share Result
        </button>
        <Link 
          to={`/test/${test.id}`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/5 px-10 py-4 font-bold text-orange-500 hover:bg-orange-500/10 transition-all"
        >
          <RotateCcw className="h-5 w-5" /> Retake Test
        </Link>
      </div>
    </div>
  );
}
