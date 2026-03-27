import { db, collection, addDoc, getDocs } from "./firebase";

export async function seedDatabase() {
  const coursesSnap = await getDocs(collection(db, "testSeries"));
  if (coursesSnap.size > 0) return; // Already seeded

  console.log("Seeding data...");

  // Banners
  await addDoc(collection(db, "banners"), {
    imageUrl: "https://picsum.photos/seed/bnoy1/1920/1080",
    link: "/test-series",
    active: true
  });

  // Test Series
  const course1 = await addDoc(collection(db, "testSeries"), {
    title: "Complete REET 2026 Preparation",
    description: "Comprehensive test series covering all subjects for REET Level 1 & 2. Includes 50+ topic tests and 10 full-length mock tests.",
    thumbnail: "https://picsum.photos/seed/reet/800/600",
    price: 499,
    category: "REET",
    isFree: false,
    createdAt: new Date().toISOString()
  });

  const course2 = await addDoc(collection(db, "testSeries"), {
    title: "SSC CGL Tier 1 Masterclass",
    description: "Master Quantitative Aptitude, Reasoning, English, and GA with our expert-led test series. 100+ hours of content.",
    thumbnail: "https://picsum.photos/seed/ssc/800/600",
    price: 999,
    category: "SSC",
    isFree: false,
    createdAt: new Date().toISOString()
  });

  const course3 = await addDoc(collection(db, "testSeries"), {
    title: "Rajasthan Police Constable Free Test Series",
    description: "Free mock tests for Rajasthan Police Constable exam. Real-time ranking and detailed solutions.",
    thumbnail: "https://picsum.photos/seed/police/800/600",
    price: 0,
    category: "Police",
    isFree: true,
    createdAt: new Date().toISOString()
  });

  // Subjects for Course 1
  const subject1 = await addDoc(collection(db, "subjects"), {
    courseId: course1.id,
    title: "Child Development & Pedagogy",
    order: 1
  });

  const subject2 = await addDoc(collection(db, "subjects"), {
    courseId: course1.id,
    title: "Hindi Language",
    order: 2
  });

  // Topics for Subject 1
  await addDoc(collection(db, "topics"), {
    subjectId: subject1.id,
    title: "Concept of Development",
    order: 1,
    pdfUrl: "https://example.com/notes1.pdf"
  });

  await addDoc(collection(db, "topics"), {
    subjectId: subject1.id,
    title: "Principles of Development",
    order: 2
  });

  // Tests for Course 1
  const test1 = await addDoc(collection(db, "tests"), {
    title: "REET Level 1: Child Development & Pedagogy",
    courseId: course1.id,
    type: "Topic",
    duration: 30,
    negativeMarking: 0.25,
    questionsCount: 5,
    difficulty: "Medium"
  });

  const test2 = await addDoc(collection(db, "tests"), {
    title: "REET 2026: Full Length Mock Test 1",
    courseId: course1.id,
    type: "Full",
    duration: 150,
    negativeMarking: 0.25,
    questionsCount: 150,
    difficulty: "Hard"
  });

  // Questions for Test 1
  const questions = [
    {
      testId: test1.id,
      text: "Who is known as the father of Educational Psychology?",
      options: ["Edward Thorndike", "Jean Piaget", "Lev Vygotsky", "B.F. Skinner"],
      correctAnswer: 0,
      explanation: "Edward Thorndike is widely considered the father of educational psychology."
    },
    {
      testId: test1.id,
      text: "According to Piaget, at which stage does object permanence develop?",
      options: ["Pre-operational", "Sensorimotor", "Concrete operational", "Formal operational"],
      correctAnswer: 1,
      explanation: "Object permanence typically develops during the sensorimotor stage (birth to 2 years)."
    },
    {
      testId: test1.id,
      text: "Vygotsky's theory emphasizes the role of ______ in cognitive development.",
      options: ["Biology", "Social interaction", "Reinforcement", "Maturation"],
      correctAnswer: 1,
      explanation: "Vygotsky's sociocultural theory emphasizes that social interaction plays a fundamental role in the development of cognition."
    },
    {
      testId: test1.id,
      text: "What does IQ stand for?",
      options: ["Intelligence Quantity", "Intellectual Quotient", "Intelligence Quotient", "Internal Quality"],
      correctAnswer: 2,
      explanation: "IQ stands for Intelligence Quotient."
    },
    {
      testId: test1.id,
      text: "The 'Zone of Proximal Development' was proposed by:",
      options: ["Piaget", "Vygotsky", "Bruner", "Bandura"],
      correctAnswer: 1,
      explanation: "The ZPD is a key concept in Vygotsky's theory."
    }
  ];

  for (const q of questions) {
    await addDoc(collection(db, "questions"), q);
  }

  // Sample Notifications (Global)
  await addDoc(collection(db, "notifications"), {
    userId: "global", // Or specific user ID if available
    title: "Welcome to Bnoy!",
    message: "Start your preparation today with our free test series.",
    read: false,
    timestamp: new Date().toISOString()
  });

  console.log("Seeding complete!");
}
