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
  Trophy,
  Rocket,
  Brain,
  BarChart3,
  Clock3,
  ArrowUpRight,
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
    { name: "RPSC", icon: "🏛️" },
    { name: "REET", icon: "📚" },
    { name: "SSC", icon: "💼" },
    { name: "Railway", icon: "🚂" },
    { name: "Police", icon: "👮" },
    { name: "Teaching", icon: "👩‍🏫" },
  ];

  const quickExamPills = ["RPSC", "REET", "SSC CGL", "Railway", "Patwari", "Police"];

  const heroFeatures = [
    { title: "Adaptive Practice", subtitle: "Weak topic pe focus", icon: Brain },
    { title: "Rank Analytics", subtitle: "Daily progress track", icon: BarChart3 },
    { title: "15-min Sprint", subtitle: "Fast revision mode", icon: Clock3 },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-[linear-gradient(160deg,#09090b_0%,#111827_55%,#1f2937_100%)] p-5 md:p-8">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-300"
            >
              <Sparkles className="h-4 w-4" />
              New Hero Experience
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl"
            >
              BNOY 2.0
              <span className="block bg-gradient-to-r from-orange-300 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                Smart Prep Engine
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl text-sm text-zinc-300 md:text-base"
            >
              Bas padhai nahi — strategy ke saath prep karo. AI insights, instant analysis aur exam-specific test series ek hi jagah.
            </motion.p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickExamPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(pill)}`)}
                  className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition-all hover:border-orange-400/50 hover:bg-orange-500/20"
                >
                  #{pill}
                </button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { val: "50k+", label: "Learners" },
                { val: "1M+", label: "Tests" },
                { val: "94%", label: "Success" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur">
                  <p className="text-lg font-black text-white">{item.val}</p>
                  <p className="text-[11px] text-zinc-400">{item.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/auth"
                className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Start Free <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/test-series"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                Explore Tests
              </Link>
            </motion.div>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-2"
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search exams, tests, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-xl bg-transparent pl-10 pr-24 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600"
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
                  className="h-56 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
                  {loading ? "Loading preview..." : "No banner available"}
                </div>
              )}
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
                  <div className="mb-2 inline-flex rounded-lg bg-orange-500/20 p-2 text-orange-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-zinc-400">{subtitle}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Mentors", icon: Trophy },
                { label: "Live Quiz", icon: Rocket },
                { label: "Top Picks", icon: Sparkles },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <Icon className="mx-auto mb-1 h-4 w-4 text-orange-400" />
                  <p className="text-[11px] font-semibold text-zinc-200">{label}</p>
                </div>
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -5 }}
              className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center transition-all hover:border-orange-500/50 hover:bg-orange-500/5"
            >
              <span className="mb-3 block text-4xl">{cat.icon}</span>
              <span className="font-bold text-zinc-300 group-hover:text-white">{cat.name}</span>
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
