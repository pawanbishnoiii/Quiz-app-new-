import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, collection, getDocs, query, where, orderBy } from "../firebase";
import { Course } from "../types";
import { Search as SearchIcon, Filter, X, Star, Users, BookOpen, ChevronRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { TestSeriesCardSkeleton } from "../components/Skeleton";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [category, setCategory] = useState("All");
  const [priceType, setPriceType] = useState("All"); // All, Free, Paid
  const [difficulty, setDifficulty] = useState("All"); // All, Beginner, Intermediate, Advanced

  const categories = ["All", "RPSC", "REET", "SSC", "Railway", "Police", "Teaching"];
  const priceTypes = ["All", "Free", "Paid"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "testSeries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching test series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses;

    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter(c => c.category === category);
    }

    if (priceType !== "All") {
      if (priceType === "Free") {
        result = result.filter(c => c.price === 0);
      } else {
        result = result.filter(c => c.price > 0);
      }
    }

    if (difficulty !== "All") {
      result = result.filter(c => c.difficulty === difficulty);
    }

    setFilteredCourses(result);
  }, [searchTerm, category, priceType, difficulty, courses]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          Search <span className="text-orange-500">Test Series</span>
        </h1>
        <div className="relative flex-1 max-w-xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by title, category or exam..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-2xl bg-zinc-900 pl-12 pr-4 text-sm border border-zinc-800 focus:outline-none focus:border-orange-500 transition-all shadow-xl shadow-black/20"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-bold transition-all ${
            showFilters ? "bg-orange-500 text-white" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
          }`}
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        category === cat ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Price</label>
                <div className="flex gap-2">
                  {priceTypes.map(p => (
                    <button
                      key={p}
                      onClick={() => setPriceType(p)}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        priceType === p ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        difficulty === d ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => <TestSeriesCardSkeleton key={i} />)
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <motion.div 
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    course.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                    course.difficulty === 'Intermediate' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {course.difficulty || 'Beginner'}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-orange-500 transition-colors">{course.title}</h3>
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.studentsCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{course.rating || 4.5}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-black text-white">
                    {course.price === 0 ? "FREE" : `₹${course.price}`}
                  </span>
                  <Link 
                    to={`/test-series/${course.id}`}
                    className="rounded-full bg-zinc-800 px-6 py-2 text-sm font-bold text-white hover:bg-orange-500 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 mb-6">
              <SearchIcon className="h-10 w-10 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No test series found</h3>
            <p className="text-zinc-500 mt-2">Try adjusting your filters or search term</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setCategory("All");
                setPriceType("All");
                setDifficulty("All");
              }}
              className="mt-6 text-orange-500 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
