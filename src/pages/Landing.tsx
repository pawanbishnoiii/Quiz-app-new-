import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db, collection, getDocs, query, where, limit } from "../firebase";
import { Course, Banner } from "../types";
import { Search, ChevronRight, Star, Users, BookOpen, PlayCircle, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const coursesSnap = await getDocs(query(collection(db, "testSeries"), limit(6)));
      setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));

      const bannersSnap = await getDocs(query(collection(db, "banners"), where("active", "==", true)));
      setBanners(bannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner)));
      
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

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-zinc-900">
        {banners.length > 0 ? (
          <div className="h-full w-full">
            <img 
              src={banners[0].imageUrl} 
              alt="Banner" 
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl text-5xl font-black tracking-tighter text-white md:text-7xl uppercase italic leading-none"
              >
                Master Your Exams with <span className="text-orange-500">Bnoy</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 max-w-lg text-lg text-zinc-300"
              >
                The ultimate platform for competitive exam preparation. Courses, Test Series, and Real-time analytics.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 flex gap-4"
              >
                <Link to="/auth" className="rounded-full bg-orange-500 px-8 py-4 text-lg font-bold text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
                  Get Started Free
                </Link>
                <Link to="/test-series" className="rounded-full bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md hover:bg-white/20 transition-all">
                  Browse Test Series
                </Link>
              </motion.div>

              <motion.form 
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 relative max-w-xl group"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search for test series, exams, or subjects..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-16 w-full rounded-2xl bg-zinc-950/50 pl-14 pr-32 text-white border border-white/10 backdrop-blur-xl focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-500"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 transition-all"
                >
                  Search
                </button>
              </motion.form>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
            <div className="text-center">
              <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">Bnoy Platform</h1>
              <p className="mt-4 text-zinc-500">Loading your success story...</p>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
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
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <span className="font-bold text-zinc-300 group-hover:text-white">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Test Series */}
      <section>
        <div className="flex items-center justify-between mb-8">
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
                <div className="absolute top-4 right-4 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-bold text-orange-500 backdrop-blur-md">
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold leading-tight group-hover:text-orange-500 transition-colors">{course.title}</h3>
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>1.2k+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-black text-white">₹{course.price}</span>
                  <Link 
                    to={`/test-series/${course.id}`}
                    className="rounded-full bg-zinc-800 px-6 py-2 text-sm font-bold text-white hover:bg-orange-500 transition-all"
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
