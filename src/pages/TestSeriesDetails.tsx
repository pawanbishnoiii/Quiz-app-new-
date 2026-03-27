import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, doc, getDoc, collection, getDocs, query, where } from "../firebase";
import { Course, Test } from "../types";
import { useAppStore } from "../store";
import { 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import axios from "axios";

export default function TestSeriesDetails() {
  const { id } = useParams();
  const { user } = useAppStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const courseSnap = await getDoc(doc(db, "testSeries", id));
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
      }

      const testsSnap = await getDocs(query(collection(db, "tests"), where("courseId", "==", id)));
      setTests(testsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test)));

      if (user) {
        const purchaseSnap = await getDocs(
          query(collection(db, "purchases"), where("userId", "==", user.uid), where("courseId", "==", id))
        );
        setIsPurchased(!purchaseSnap.empty);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  const handleBuy = async () => {
    if (!user) return alert("Please login to buy this test series");
    if (!course) return;

    try {
      const { data: order } = await axios.post("/api/payments/order", {
        amount: course.price,
        receipt: `course_${course.id}`,
      });

      const options = {
        key: "rzp_test_placeholder", // Replace with real key
        amount: order.amount,
        currency: order.currency,
        name: "Bnoy Platform",
        description: `Purchase ${course.title}`,
        order_id: order.id,
        handler: async (response: any) => {
          await axios.post("/api/payments/verify", response);
          setIsPurchased(true);
          alert("Test Series unlocked successfully!");
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment");
    }
  };

  if (loading || !course) return <div className="p-10 text-center animate-pulse">Loading test series details...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Hero Header */}
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-widest">
            <BookOpen className="h-4 w-4" /> {course.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
            {course.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            {course.description}
          </p>
          
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold">4.9</span>
              <span className="text-zinc-500 text-sm">(2.4k reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm">Lifetime Access</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-2">
            <img src={course.thumbnail} alt="" className="aspect-video w-full rounded-2xl object-cover" />
            <div className="p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">₹{course.price}</span>
                <span className="text-zinc-500 line-through">₹{course.price * 2}</span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">Includes all topic tests and full-length test series.</p>
              
              {isPurchased ? (
                <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-green-500/10 py-4 font-bold text-green-500 border border-green-500/20">
                  <CheckCircle2 className="h-5 w-5" /> Test Series Unlocked
                </div>
              ) : (
                <button 
                  onClick={handleBuy}
                  className="mt-8 w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Get & Learn */}
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">What You'll Get</h2>
          <ul className="space-y-4">
            {[
              "Full-length mock tests with real exam interface",
              "Detailed solutions and performance analytics",
              "Topic-wise practice questions",
              "All India Rank prediction",
              "Doubt solving support"
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-300">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-orange-500" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">What You'll Learn</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-zinc-300">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              <span>Master all core concepts required for the exam.</span>
            </li>
            <li className="flex items-start gap-3 text-zinc-300">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              <span>Develop effective time management strategies.</span>
            </li>
            <li className="flex items-start gap-3 text-zinc-300">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              <span>Identify and improve weak areas through analytics.</span>
            </li>
            <li className="flex items-start gap-3 text-zinc-300">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              <span>Gain confidence with exam-level difficulty questions.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Test Series Content */}
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold tracking-tight border-b border-zinc-800 pb-4">Test Series Content</h2>
          <div className="space-y-4">
            {tests.length > 0 ? tests.map((test, i) => (
              <div 
                key={test.id}
                className={`flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all ${
                  isPurchased || course.isFree ? 'hover:border-orange-500/50' : 'opacity-70'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-sm font-bold text-zinc-500">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{test.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {test.duration}m</span>
                      <span>•</span>
                      <span>{test.questionsCount} Questions</span>
                    </div>
                  </div>
                </div>
                
                {isPurchased || course.isFree ? (
                  <Link 
                    to={`/test/${test.id}`}
                    className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  >
                    Start Test <PlayCircle className="h-4 w-4" />
                  </Link>
                ) : (
                  <Lock className="h-5 w-5 text-zinc-600" />
                )}
              </div>
            )) : (
              <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
                <FileText className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500">No tests added to this test series yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight border-b border-zinc-800 pb-4">What you'll get</h2>
          <ul className="space-y-4">
            {[
              "Expert curated test series",
              "Detailed solutions & explanations",
              "Real-time ranking & leaderboard",
              "Performance analytics",
              "Mobile-friendly interface",
              "PDF support for offline study"
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
