import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db, googleProvider, signInWithPopup, doc, setDoc, getDoc } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import { User } from "../types";
import { Chrome, Mail, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";

export default function Auth() {
  const [step, setStep] = useState(0); // 0: Login, 1: Step 1 (Name/Exam), 2: Step 2 (Language)
  const [formData, setFormData] = useState({
    name: "",
    examPrep: "",
    language: "English" as "Hindi" | "English",
  });
  const [tempUser, setTempUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
        navigate("/dashboard");
      } else {
        setTempUser(result.user);
        setFormData(prev => ({ ...prev, name: result.user.displayName || "" }));
        setStep(1);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!tempUser) return;
    setLoading(true);
    try {
      const isAdmin = tempUser.email === "bnoy.studios@gmail.com" || tempUser.email === "pk8345357@gmail.com";
      const userData: User = {
        uid: tempUser.uid,
        name: formData.name,
        email: tempUser.email,
        photoURL: tempUser.photoURL,
        examPrep: formData.examPrep,
        language: formData.language,
        xp: 0,
        streak: 0,
        role: isAdmin ? "admin" : "user",
        lastLogin: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", tempUser.uid), userData);
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exams = ["RPSC", "REET", "SSC", "Railway", "Police", "UPSC", "Other"];

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8 text-center"
            >
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Welcome to Bnoy</h2>
              <p className="mt-2 text-zinc-500">Sign in to start your preparation journey.</p>
              
              <div className="mt-10 space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-lg font-bold text-black hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                  <Chrome className="h-6 w-6" />
                  Continue with Google
                </button>
                <button 
                  disabled
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 px-6 py-4 text-lg font-bold text-zinc-500 transition-all"
                >
                  <Mail className="h-6 w-6" />
                  Continue with Email
                </button>
              </div>
              <p className="mt-8 text-xs text-zinc-600">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              <div className="flex items-center gap-2 text-orange-500 mb-6">
                <div className="h-2 w-12 rounded-full bg-orange-500"></div>
                <div className="h-2 w-12 rounded-full bg-zinc-800"></div>
              </div>
              <h2 className="text-2xl font-bold text-white">Tell us about yourself</h2>
              <p className="mt-1 text-zinc-500">Help us personalize your experience.</p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label className="text-sm font-medium text-zinc-400">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-400">Target Exam</label>
                  <select 
                    value={formData.examPrep}
                    onChange={(e) => setFormData({...formData, examPrep: e.target.value})}
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select Exam</option>
                    {exams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.examPrep}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-50 py-4 text-lg font-bold text-orange-500 hover:bg-orange-100 transition-all disabled:opacity-50"
                >
                  Next Step <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              <div className="flex items-center gap-2 text-orange-500 mb-6">
                <div className="h-2 w-12 rounded-full bg-orange-500"></div>
                <div className="h-2 w-12 rounded-full bg-orange-500"></div>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-zinc-500 hover:text-white mb-4"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h2 className="text-2xl font-bold text-white">Preferred Language</h2>
              <p className="mt-1 text-zinc-500">You can change this later in settings.</p>
              
              <div className="mt-8 space-y-4">
                {["English", "Hindi"].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => setFormData({...formData, language: lang as any})}
                    className={`flex w-full items-center justify-between rounded-2xl border p-5 transition-all ${
                      formData.language === lang 
                        ? "border-orange-500 bg-orange-500/5 text-white" 
                        : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-lg font-bold">{lang}</span>
                    {formData.language === lang && <CheckCircle2 className="h-6 w-6 text-orange-500" />}
                  </button>
                ))}
                
                <button 
                  onClick={handleCompleteOnboarding}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
                >
                  {loading ? "Setting up..." : "Complete Setup"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
