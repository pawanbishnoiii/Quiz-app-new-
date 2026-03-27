import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, doc, getDoc, collection, getDocs, query, where, addDoc } from "../firebase";
import { Test, Question, Result } from "../types";
import { useAppStore } from "../store";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Send,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TestPlayer() {
  const { id } = useParams();
  const { user } = useAppStore();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const testSnap = await getDoc(doc(db, "tests", id));
      if (testSnap.exists()) {
        const testData = { id: testSnap.id, ...testSnap.data() } as Test;
        setTest(testData);
        setTimeLeft(testData.duration * 60);
      }

      const questionsSnap = await getDocs(query(collection(db, "questions"), where("testId", "==", id)));
      setQuestions(questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question)));
      
      setLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !submitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, submitting]);

  const handleAnswer = (optionIdx: number) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: optionIdx });
  };

  const handleSubmit = async () => {
    if (!test || !user || submitting) return;
    setSubmitting(true);
    
    let score = 0;
    let attempted = 0;
    let correct = 0;

    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        attempted++;
        if (answers[q.id] === q.correctAnswer) {
          score += 1;
          correct++;
        } else {
          score -= (test.negativeMarking || 0);
        }
      }
    });

    const resultData: Omit<Result, 'id'> = {
      userId: user.uid,
      testId: test.id,
      score: Number(score.toFixed(2)),
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      timeTaken: (test.duration * 60) - timeLeft,
      attempted,
      unattempted: questions.length - attempted,
      timestamp: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "results"), resultData);
      navigate(`/result/${docRef.id}`);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading || !test) return <div className="p-20 text-center animate-pulse">Preparing your test...</div>;

  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white truncate max-w-xs">{test.title}</h1>
          <span className="hidden sm:inline-block rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {test.type} Test
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
            <Clock className="h-5 w-5" /> {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setShowConfirm(true)}
            className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            Submit Test
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Area */}
        <main className="flex-1 flex flex-col overflow-y-auto p-6 md:p-12">
          <div className="mx-auto w-full max-w-3xl space-y-10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
              <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-orange-500 transition-colors">
                <Flag className="h-4 w-4" /> Report
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-white leading-snug">{currentQ?.text}</h2>
                
                <div className="grid gap-4">
                  {currentQ?.options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                        answers[currentQ.id] === i 
                          ? "border-orange-500 bg-orange-500/5 text-white" 
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-bold ${
                        answers[currentQ.id] === i ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-700 bg-zinc-800"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-lg">{opt}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Question Palette (Desktop) */}
        <aside className="hidden lg:block w-80 border-l border-zinc-800 bg-zinc-900/50 p-6 overflow-y-auto">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Question Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, i) => (
              <button 
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  currentIdx === i ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-950" : ""
                } ${
                  answers[q.id] !== undefined ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-10 space-y-4 pt-10 border-t border-zinc-800">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span>Attempted ({Object.keys(answers).length})</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <div className="h-3 w-3 rounded-full bg-zinc-800"></div>
              <span>Not Attempted ({questions.length - Object.keys(answers).length})</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer Navigation */}
      <footer className="h-20 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 px-6 py-3 font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" /> Previous
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAnswers({ ...answers, [currentQ.id]: undefined as any })}
            className="text-sm font-bold text-zinc-500 hover:text-white transition-colors"
          >
            Clear Response
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:underline">
            <HelpCircle className="h-4 w-4" /> Review Later
          </button>
        </div>

        <button 
          onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentIdx === questions.length - 1}
          className="flex items-center gap-2 rounded-xl bg-zinc-800 px-8 py-3 font-bold text-white hover:bg-zinc-700 disabled:opacity-30"
        >
          Next <ChevronRight className="h-5 w-5" />
        </button>
      </footer>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Submit Test?</h2>
            <p className="mt-2 text-zinc-500">You have attempted {Object.keys(answers).length} out of {questions.length} questions.</p>
            
            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-2xl border border-zinc-800 py-4 font-bold text-zinc-500 hover:bg-zinc-800 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-2xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20"
              >
                {submitting ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
