import React, { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "../firebase";
import { User, Course, Test, Banner, Question } from "../types";
import { seedDatabase } from "../seed";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight,
  LayoutDashboard,
  CreditCard,
  Settings,
  Eye,
  CheckCircle2,
  XCircle,
  Bell
} from "lucide-react";

export default function Admin() {
  return (
    <div className="space-y-10 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Admin Dashboard</h1>
          <p className="text-zinc-500">Manage your platform content and users.</p>
        </div>
      </header>

      <nav className="flex gap-4 border-b border-zinc-800 pb-4 overflow-x-auto">
        {[
          { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
          { to: "/admin/users", icon: Users, label: "Users" },
          { to: "/admin/testSeries", icon: BookOpen, label: "Test Series" },
          { to: "/admin/tests", icon: FileText, label: "Tests" },
          { to: "/admin/banners", icon: ImageIcon, label: "Banners" },
          { to: "/admin/payments", icon: CreditCard, label: "Payments" },
          { to: "/admin/notifications", icon: Bell, label: "Notifications" },
          { to: "/admin/settings", icon: Settings, label: "Settings" },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="testSeries" element={<AdminTestSeries />} />
        <Route path="tests" element={<AdminTests />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, courses: 0, tests: 0, revenue: 0 });

  const chartData = [
    { name: "Jan", revenue: 4000, users: 2400 },
    { name: "Feb", revenue: 3000, users: 1398 },
    { name: "Mar", revenue: 2000, users: 9800 },
    { name: "Apr", revenue: 2780, users: 3908 },
    { name: "May", revenue: 1890, users: 4800 },
    { name: "Jun", revenue: 2390, users: 3800 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const coursesSnap = await getDocs(collection(db, "testSeries"));
      const testsSnap = await getDocs(collection(db, "tests"));
      setStats({
        users: usersSnap.size,
        courses: coursesSnap.size,
        tests: testsSnap.size,
        revenue: 125000, // Simulated
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", val: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Test Series", val: stats.courses, icon: BookOpen, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Total Tests", val: stats.tests, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Total Revenue", val: `₹${stats.revenue}`, icon: CreditCard, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className={`mb-4 inline-flex rounded-2xl ${stat.bg} p-3 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-black text-white">{stat.val}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h3 className="mb-6 text-xl font-black text-white italic uppercase tracking-tighter">Revenue Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }}
                  itemStyle={{ color: "#f97316" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h3 className="mb-6 text-xl font-black text-white italic uppercase tracking-tighter">User Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }}
                  cursor={{ fill: "#27272a" }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(query(collection(db, "users"), orderBy("lastLogin", "desc")));
      setUsers(snap.docs.map(doc => doc.data() as User));
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">User</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Role</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Exam Prep</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Last Login</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {users.map((u) => (
            <tr key={u.uid} className="hover:bg-zinc-800/20 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden">
                    <img src={u.photoURL} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-xs text-zinc-500">{u.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                  u.role === 'admin' ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-300">{u.examPrep}</td>
              <td className="px-6 py-4 text-sm text-zinc-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'N/A'}</td>
              <td className="px-6 py-4">
                <button className="text-zinc-500 hover:text-white transition-colors"><Edit className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminTestSeries() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ 
    title: "", 
    description: "", 
    price: 0, 
    category: "SSC", 
    thumbnail: "",
    difficulty: "Beginner" as const
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(db, "testSeries"));
      setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    };
    fetchCourses();
  }, []);

  const handleAdd = async () => {
    const courseData = {
      ...newCourse,
      createdAt: new Date().toISOString(),
      isFree: newCourse.price === 0,
      rating: 4.5,
      studentsCount: 0
    };
    const docRef = await addDoc(collection(db, "testSeries"), courseData);
    setCourses([...courses, { id: docRef.id, ...courseData }]);
    setShowModal(false);
    setNewCourse({ title: "", description: "", price: 0, category: "SSC", thumbnail: "", difficulty: "Beginner" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this test series?")) {
      await deleteDoc(doc(db, "testSeries", id));
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse({ ...newCourse, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all"
        >
          <Plus className="h-4 w-4" /> Add New Test Series
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 transition-all hover:border-zinc-700">
            <div className="aspect-video overflow-hidden">
              <img src={c.thumbnail || `https://picsum.photos/seed/${c.id}/600/400`} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white">{c.title}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-black text-orange-500">₹{c.price}</span>
                <div className="flex gap-2">
                  <button className="rounded-xl bg-zinc-800 p-2 text-zinc-400 hover:text-white"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="rounded-xl bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8 my-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Test Series</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Test Series Title" 
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none h-32"
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Price (₹)" 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({...newCourse, price: Number(e.target.value)})}
                />
                <select 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                >
                  {["RPSC", "REET", "SSC", "Railway", "Police", "UPSC"].map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
                <select 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none col-span-2"
                  value={newCourse.difficulty}
                  onChange={(e) => setNewCourse({...newCourse, difficulty: e.target.value as any})}
                >
                  {["Beginner", "Intermediate", "Advanced"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">Thumbnail Image</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20"
                    />
                  </div>
                  {newCourse.thumbnail && (
                    <img src={newCourse.thumbnail} alt="Preview" className="h-12 w-16 object-cover rounded-lg border border-zinc-800" />
                  )}
                </div>
                <div className="text-center text-xs text-zinc-600 my-2">OR</div>
                <input 
                  type="text" 
                  placeholder="Paste Image URL" 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newCourse.thumbnail}
                  onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-zinc-800 py-3 font-bold text-zinc-500 hover:bg-zinc-800 hover:text-white">Cancel</button>
                <button onClick={handleAdd} className="flex-1 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">Create Test Series</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [showQuestions, setShowQuestions] = useState<string | null>(null);
  const [newTest, setNewTest] = useState({ 
    title: "", 
    courseId: "", 
    type: "Full" as const, 
    duration: 60, 
    negativeMarking: 0.25, 
    questionsCount: 0,
    difficulty: "Medium" as const
  });

  useEffect(() => {
    const fetchData = async () => {
      const testsSnap = await getDocs(collection(db, "tests"));
      setTests(testsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test)));
      const coursesSnap = await getDocs(collection(db, "testSeries"));
      setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    const docRef = await addDoc(collection(db, "tests"), newTest);
    setTests([...tests, { id: docRef.id, ...newTest }]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all"
        >
          <Plus className="h-4 w-4" /> Create New Test
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((t) => (
          <div key={t.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {t.type}
              </span>
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                t.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                t.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {t.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.title}</h3>
            <p className="text-xs text-zinc-500 mb-4">
              {courses.find(c => c.id === t.courseId)?.title || "Unknown Test Series"}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-zinc-950 p-3 text-center">
                <div className="text-lg font-bold text-white">{t.questionsCount}</div>
                <div className="text-[10px] font-bold uppercase text-zinc-500">Questions</div>
              </div>
              <div className="rounded-2xl bg-zinc-950 p-3 text-center">
                <div className="text-lg font-bold text-white">{t.duration}m</div>
                <div className="text-[10px] font-bold uppercase text-zinc-500">Duration</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowQuestions(t.id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-2 text-xs font-bold text-white hover:bg-zinc-700"
              >
                <FileText className="h-4 w-4" /> Questions
              </button>
              <button className="rounded-xl bg-zinc-800 p-2 text-zinc-400 hover:text-white"><Edit className="h-4 w-4" /></button>
              <button className="rounded-xl bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Test</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Test Title" 
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                value={newTest.title}
                onChange={(e) => setNewTest({...newTest, title: e.target.value})}
              />
              <select 
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                value={newTest.courseId}
                onChange={(e) => setNewTest({...newTest, courseId: e.target.value})}
              >
                <option value="">Select Test Series</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newTest.type}
                  onChange={(e) => setNewTest({...newTest, type: e.target.value as any})}
                >
                  <option value="Full">Full Test</option>
                  <option value="Topic">Topic Test</option>
                  <option value="Subjective">Subjective</option>
                </select>
                <select 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newTest.difficulty}
                  onChange={(e) => setNewTest({...newTest, difficulty: e.target.value as any})}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Duration (mins)" 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newTest.duration}
                  onChange={(e) => setNewTest({...newTest, duration: Number(e.target.value)})}
                />
                <input 
                  type="number" 
                  placeholder="Negative Marking" 
                  step="0.01"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newTest.negativeMarking}
                  onChange={(e) => setNewTest({...newTest, negativeMarking: Number(e.target.value)})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-zinc-800 py-3 font-bold text-zinc-500 hover:bg-zinc-800 hover:text-white">Cancel</button>
                <button onClick={handleAdd} className="flex-1 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">Create Test</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQuestions && (
        <AdminQuestionManager 
          testId={showQuestions} 
          onClose={() => setShowQuestions(null)} 
          testTitle={tests.find(t => t.id === showQuestions)?.title || ""}
        />
      )}
    </div>
  );
}

function AdminQuestionManager({ testId, onClose, testTitle }: { testId: string, onClose: () => void, testTitle: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState({ text: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(collection(db, "questions"), where("testId", "==", testId));
      const snap = await getDocs(q);
      setQuestions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question)));
    };
    fetchQuestions();
  }, [testId]);

  const handleAdd = async () => {
    const docRef = await addDoc(collection(db, "questions"), { ...newQ, testId });
    setQuestions([...questions, { id: docRef.id, ...newQ, testId }]);
    setShowAdd(false);
    setNewQ({ text: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
    
    // Update test question count
    const testRef = doc(db, "tests", testId);
    await updateDoc(testRef, { questionsCount: questions.length + 1 });
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-zinc-950">
      <header className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold text-white">{testTitle}</h2>
          <p className="text-zinc-500">Manage questions for this test.</p>
        </div>
        <button onClick={onClose} className="rounded-full bg-zinc-900 p-3 text-zinc-400 hover:text-white">
          <XCircle className="h-6 w-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{questions.length} Questions</h3>
          <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" /> Add Question
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-orange-500">Q{idx + 1}</span>
                <button className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
              <p className="text-white mb-4">{q.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, i) => (
                  <div key={i} className={`rounded-xl p-3 text-sm ${
                    i === q.correctAnswer ? 'bg-green-500/10 border border-green-500/50 text-green-500' : 'bg-zinc-950 text-zinc-400'
                  }`}>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Question</h2>
            <div className="space-y-4">
              <textarea 
                placeholder="Question Text" 
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none h-24"
                value={newQ.text}
                onChange={(e) => setNewQ({...newQ, text: e.target.value})}
              />
              <div className="grid gap-3">
                {newQ.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Option ${i + 1}`} 
                      className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...newQ.options];
                        newOpts[i] = e.target.value;
                        setNewQ({...newQ, options: newOpts});
                      }}
                    />
                    <button 
                      onClick={() => setNewQ({...newQ, correctAnswer: i})}
                      className={`rounded-xl px-4 py-2 font-bold transition-all ${
                        newQ.correctAnswer === i ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      Correct
                    </button>
                  </div>
                ))}
              </div>
              <textarea 
                placeholder="Explanation (Optional)" 
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none h-24"
                value={newQ.explanation}
                onChange={(e) => setNewQ({...newQ, explanation: e.target.value})}
              />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl border border-zinc-800 py-3 font-bold text-zinc-500 hover:bg-zinc-800 hover:text-white">Cancel</button>
                <button onClick={handleAdd} className="flex-1 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">Add Question</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      const snap = await getDocs(collection(db, "banners"));
      setBanners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner)));
    };
    fetchBanners();
  }, []);

  const handleAdd = async () => {
    const docRef = await addDoc(collection(db, "banners"), { imageUrl: newUrl, active: true });
    setBanners([...banners, { id: docRef.id, imageUrl: newUrl, active: true }]);
    setNewUrl("");
  };

  const toggleActive = async (banner: Banner) => {
    await updateDoc(doc(db, "banners", banner.id), { active: !banner.active });
    setBanners(banners.map(b => b.id === banner.id ? { ...b, active: !b.active } : b));
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "banners", id));
    setBanners(banners.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="New Banner Image URL" 
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button 
          onClick={handleAdd}
          className="rounded-xl bg-orange-500 px-8 py-3 font-bold text-white hover:bg-orange-600"
        >
          Add Banner
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {banners.map((b) => (
          <div key={b.id} className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40">
            <img src={b.imageUrl} alt="" className="aspect-video w-full object-cover opacity-60" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => toggleActive(b)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    b.active ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {b.active ? 'Active' : 'Inactive'}
                </button>
                <button 
                  onClick={() => handleDelete(b.id)}
                  className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function AdminNotifications() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(doc => doc.data() as User));
    };
    fetchUsers();
  }, []);

  const handleSend = async () => {
    if (!title || !message) return;
    setSending(true);

    try {
      if (selectedUser === "all") {
        await addDoc(collection(db, "notifications"), {
          userId: "global",
          title,
          message,
          read: false,
          timestamp: new Date().toISOString()
        });
        alert("Global notification sent to all users!");
      } else {
        await addDoc(collection(db, "notifications"), {
          userId: selectedUser,
          title,
          message,
          read: false,
          timestamp: new Date().toISOString()
        });
        alert("Notification sent to selected user!");
      }
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error sending notifications:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white">Send New Notification</h3>
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Target Audience</label>
          <select 
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="all">All Users ({users.length})</option>
            {users.map(u => <option key={u.uid} value={u.uid}>{u.name} ({u.email})</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Notification Title</label>
          <input 
            type="text" 
            placeholder="e.g. New Test Series Available!" 
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Message Content</label>
          <textarea 
            placeholder="Write your message here..." 
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSend}
          disabled={sending || !title || !message}
          className="w-full rounded-full bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send Notification"}
        </button>
      </div>
    </div>
  );
}

function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      // In a real app, this would fetch from a 'payments' collection
      // For now, we'll simulate some data or fetch from an existing collection if available
      setLoading(false);
    };
    fetchPayments();
  }, []);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="font-bold text-white">Recent Transactions</h3>
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last 30 Days</span>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-zinc-900/50">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">User</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Test Series</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Amount</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {[
            { id: 1, user: "Rahul Sharma", course: "REET 2024 Full Test Series", amount: 1499, status: "Success", date: "2024-03-20" },
            { id: 2, user: "Priya Verma", course: "SSC CGL Math Special", amount: 999, status: "Success", date: "2024-03-19" },
            { id: 3, user: "Amit Singh", course: "Rajasthan Police Test Series", amount: 499, status: "Pending", date: "2024-03-18" },
          ].map((p) => (
            <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
              <td className="px-6 py-4 font-bold text-white">{p.user}</td>
              <td className="px-6 py-4 text-sm text-zinc-300">{p.course}</td>
              <td className="px-6 py-4 font-black text-white">₹{p.amount}</td>
              <td className="px-6 py-4">
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                  p.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-500">{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminSettings() {
  const [config, setConfig] = useState({
    appName: "Bnoy",
    contactEmail: "support@bnoy.com",
    razorpayKey: "rzp_test_...",
    maintenanceMode: false,
    negativeMarking: 0.25,
    defaultLanguage: "Hindi"
  });
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm("This will add sample data to your database. Continue?")) return;
    setSeeding(true);
    try {
      await seedDatabase();
      alert("Database seeded successfully!");
    } catch (error) {
      console.error("Seeding failed:", error);
      alert("Seeding failed. Check console for details.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-orange-500" /> General Settings
        </h3>
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">App Name</label>
            <input 
              type="text" 
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              value={config.appName}
              onChange={(e) => setConfig({...config, appName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Support Email</label>
            <input 
              type="email" 
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              value={config.contactEmail}
              onChange={(e) => setConfig({...config, contactEmail: e.target.value})}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-500" /> Payment Integration
        </h3>
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Razorpay Key ID</label>
            <input 
              type="password" 
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              value={config.razorpayKey}
              onChange={(e) => setConfig({...config, razorpayKey: e.target.value})}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-500" /> Default Exam Config
        </h3>
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Default Negative Marking</label>
            <input 
              type="number" 
              step="0.01"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              value={config.negativeMarking}
              onChange={(e) => setConfig({...config, negativeMarking: Number(e.target.value)})}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-orange-500" /> Database Seeding
        </h3>
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="text-sm text-zinc-500">Populate your database with sample test series, tests, and questions for testing.</p>
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="w-full rounded-xl bg-zinc-800 py-3 font-bold text-white hover:bg-zinc-700 transition-all disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Seed Database"}
          </button>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="rounded-full bg-orange-500 px-10 py-4 font-bold text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
          Save All Settings
        </button>
      </div>
    </div>
  );
}
