"use client";

import { useEffect, useState } from "react";

type Student = {
  uid: number;
  name: string;
  score: number;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch("/api/test-connection")
      .then((res) => res.json())
      .then((data) => setStudents(data.students))
      .catch((err) => console.error("Failed to fetch:", err));
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Test Table
        </h1>
        <ul className="space-y-2">
          {/* Header Row */}
          <li className="flex justify-between items-center p-2 bg-gray-200 rounded-md shadow-sm font-bold">
            <span className="text-black">UID</span>
            <span className="text-black">Name</span>
            <span className="text-black">Score</span>
          </li>
          {/* Student Rows */}
          {students.map((s) => (
            <li
              key={s.uid}
              className="flex justify-between items-center p-2 bg-gray-50 rounded-md shadow-sm"
            >
              <span className="font-medium text-black">{s.uid}</span>
              <span className="font-medium text-black">{s.name}</span>
              <span className="text-black">{s.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
