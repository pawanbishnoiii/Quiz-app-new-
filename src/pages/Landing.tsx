import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db, collection, getDocs, query, where, limit } from "../firebase";
import { Course, Banner } from "../types";
import {
  Search,
  ChevronRight,
  Star,
  Users,
  Sparkles,
  Brain,
  BarChart3,
  Clock3,
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  TrainFront,
  BriefcaseBusiness,
  Landmark,
  BookOpenCheck,
  CirclePlay,
  Layers,
  WandSparkles,
} from "lucide-react";

export default function Landing() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const coursesSnap = await getDocs(query(collection(db, "testSeries"), limit(6)));
      setCourses(coursesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Course)));

      const bannersSnap = await getDocs(query(collection(db, "banners"), where("active", "==", true)));
      setBanners(bannersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Banner)));

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const categories = [
    { name: "RPSC", icon: Landmark, accent: "from-orange-500/30 via-orange-400/10 to-transparent" },
    { name: "REET", icon: GraduationCap, accent: "from-cyan-500/30 via-cyan-400/10 to-transparent" },
    { name: "SSC", icon: BriefcaseBusiness, accent: "from-violet-500/30 via-violet-400/10 to-transparent" },
    { name: "Railway", icon: TrainFront, accent: "from-emerald-500/30 via-emerald-400/10 to-transparent" },
    { name: "Police", icon: ShieldCheck, accent: "from-red-500/30 via-red-400/10 to-transparent" },
    { name: "Teaching", icon: BookOpenCheck, accent: "from-fuchsia-500/30 via-fuchsia-400/10 to-transparent" },
  ];

  const quickExamPills = ["RPSC", "REET", "SSC CGL", "Railway", "Patwari", "Police"];

  const heroFeatures = [
    { title: "Adaptive Practice", subtitle: "Weak topics auto detect", icon: Brain },
    { title: "Rank Analytics", subtitle: "Daily progress heatmap", icon: BarChart3 },
    { title: "15-min Sprint", subtitle: "Fast revision missions", icon: Clock3 },
  ];

  const heroHighlights = [
    { label: "Live Quizzes", icon: CirclePlay },
    { label: "Smart Revision", icon: Layers },
    { label: "AI Strategy", icon: WandSparkles },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-[linear-gradient(130deg,#07070a_0%,#111827_50%,#1f2937_100%)] p-4 sm:p-6 md:p-8">
        <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-14 top-4 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="pointer-events-none absolute -right-14 -top-16 hidden h-56 w-56 rounded-full border border-white/10 md:block"
        />

        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
          <div className="space-y-4 sm:space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-orange-300 sm:px-4 sm:py-2"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Next-Gen Exam Prep Experience
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black leading-[1.02] tracking-tight text-white sm:text-4xl md:text-6xl"
            >
              Don’t Just Study.
              <span className="block bg-gradient-to-r from-orange-300 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                Build Your Rank.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl text-sm text-zinc-300 sm:text-base"
            >
              Mobile pe bhi crystal clear UI, exam-wise smart roadmap, aur beautiful learning flows — sab ek hi dashboard mein.
            </motion.p>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickExamPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(pill)}`)}
                  className="shrink-0 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-orange-500/20"
                >
                  #{pill}
                </button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-3 gap-2.5 sm:gap-3"
            >
              {[
                { val: "50k+", label: "Learners" },
                { val: "1M+", label: "Tests" },
                { val: "94%", label: "Success" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center backdrop-blur sm:rounded-2xl sm:px-3">
                  <p className="text-base font-black text-white sm:text-lg">{item.val}</p>
                  <p className="text-[10px] text-zinc-400 sm:text-[11px]">{item.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3"
            >
              <Link
                to="/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Join Free Now <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/test-series"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/20"
              >
                Explore Test Series
              </Link>
            </motion.div>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-2"
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search exams, tests, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-500 sm:pr-28"
              />
              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600 sm:absolute sm:right-2 sm:top-1/2 sm:mt-0 sm:w-auto sm:-translate-y-1/2"
              >
                Search
              </button>
            </motion.form>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-2">
              {banners.length > 0 ? (
                <img
                  src={banners[0].imageUrl}
                  alt="Bnoy Preview"
                  className="h-48 w-full rounded-2xl object-cover sm:h-56"
                />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500 sm:h-56">
                  {loading ? "Loading preview..." : "No banner available"}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {heroHighlights.map(({ label, icon: Icon }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.08 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <Icon className="mx-auto mb-1 h-4 w-4 text-orange-300" />
                  <p className="text-[11px] font-semibold text-zinc-200">{label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {heroFeatures.map(({ title, subtitle, icon: Icon }, idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.8, delay: idx * 0.2 }}
                    className="mb-2 inline-flex rounded-lg bg-orange-500/20 p-2 text-orange-300"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-zinc-400">{subtitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Top Categories</h2>
          <Link to="/categories" className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center transition-all duration-300 hover:border-orange-500/50"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} />
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [0, -2, 2, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: idx * 0.15 }}
                className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-zinc-900/70"
              >
                <cat.icon className="h-7 w-7 text-white" />
              </motion.div>
              <span className="relative text-sm font-bold text-zinc-100">{cat.name}</span>
              <p className="relative mt-1 text-[11px] text-zinc-300">Animated prep track</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Test Series */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Test Series</h2>
          <Link to="/test-series" className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:underline">
            Explore More <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 transition-all hover:border-zinc-700"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail || `https://picsum.photos/seed/${course.id}/600/400`}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute right-4 top-4 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-bold text-orange-500 backdrop-blur-md">
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold leading-tight transition-colors group-hover:text-orange-500">{course.title}</h3>
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>1.2k+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-black text-white">₹{course.price}</span>
                  <Link
                    to={`/test-series/${course.id}`}
                    className="rounded-full bg-zinc-800 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-orange-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-8 rounded-3xl bg-orange-500 p-12 md:grid-cols-4">
        {[
          { label: "Active Users", val: "50k+" },
          { label: "Test Series", val: "200+" },
          { label: "Tests Taken", val: "1M+" },
          { label: "Success Rate", val: "94%" },
        ].map((stat) => (
          <div key={stat.label} className="text-center text-white">
            <div className="text-4xl font-black tracking-tighter">{stat.val}</div>
            <div className="text-sm font-medium opacity-80">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
