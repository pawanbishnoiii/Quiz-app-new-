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
  Zap,
  Trophy,
  Rocket,
  CheckCircle2,
  ArrowUpRight,
  Brain,
  BarChart3,
  Clock3,
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

  const trustBadges = [
    { label: "Live Tests", icon: Zap },
    { label: "Top Mentors", icon: Trophy },
    { label: "Daily Practice", icon: Rocket },
  ];

  const quickExamPills = ["RPSC", "REET", "SSC CGL", "Railway", "Patwari", "Police"];

  const heroFeatures = [
    { title: "Adaptive Practice", subtitle: "AI picks weak topics", icon: Brain },
    { title: "Score Analytics", subtitle: "Track rank trends", icon: BarChart3 },
    { title: "Daily Sprint", subtitle: "15 min revision mode", icon: Clock3 },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.22),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.20),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.16),transparent_35%)]" />

        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full border border-orange-300/20"
        />
        <motion.div
          aria-hidden
          animate={{ rotate: -360 }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -left-20 bottom-10 h-40 w-40 rounded-full border border-blue-300/20"
        />

        <div className="relative grid min-h-[640px] gap-10 p-6 md:grid-cols-2 md:items-center md:p-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300"
            >
              <Sparkles className="h-4 w-4" />
              India’s exam prep command center
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl text-4xl font-black uppercase italic leading-tight tracking-tighter text-white md:text-6xl"
            >
              Don’t just study.
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Dominate your exam.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl text-base text-zinc-300 md:text-lg"
            >
              Practice with smart tests, see your growth daily, and get exam-specific guidance built for serious aspirants.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-2"
            >
              {quickExamPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(pill)}`)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-all hover:border-orange-400/40 hover:bg-orange-500/15"
                >
                  #{pill}
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              {trustBadges.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 backdrop-blur"
                >
                  <Icon className="h-4 w-4 text-orange-400" />
                  {label}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/auth"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Start Free Trial <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/test-series"
                className="rounded-full border border-white/20 bg-white/10 px-8 py-3 text-base font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                Browse Top Series
              </Link>
            </motion.div>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl rounded-2xl border border-white/15 bg-zinc-900/70 p-2 backdrop-blur-xl"
            >
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search test series, topics, exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 w-full rounded-xl bg-transparent pl-12 pr-28 text-white outline-none placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-white transition-all hover:bg-orange-600"
              >
                Search
              </button>
            </motion.form>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-3 shadow-2xl">
              {banners.length > 0 ? (
                <img
                  src={banners[0].imageUrl}
                  alt="Bnoy Hero Banner"
                  className="h-[400px] w-full rounded-2xl object-cover opacity-85"
                />
              ) : (
                <div className="flex h-[400px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <p className="text-zinc-500">{loading ? "Loading banner..." : "No banner available"}</p>
                </div>
              )}

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-zinc-950 via-zinc-900/30 to-transparent" />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-5 top-5 rounded-2xl border border-white/20 bg-zinc-950/70 px-4 py-3 backdrop-blur"
              >
                <p className="text-xs text-zinc-400">Today Accuracy</p>
                <p className="text-xl font-black text-white">92.4%</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 right-5 rounded-2xl border border-orange-500/30 bg-orange-500/20 px-4 py-3 backdrop-blur"
              >
                <div className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle2 className="h-4 w-4 text-orange-300" />
                  1200+ students joined this week
                </div>
              </motion.div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {heroFeatures.map(({ title, subtitle, icon: Icon }, idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3 backdrop-blur"
                >
                  <div className="mb-2 inline-flex rounded-lg bg-orange-500/20 p-2 text-orange-300">
                    <Icon className="h-4 w-4" />
                  </div>
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
