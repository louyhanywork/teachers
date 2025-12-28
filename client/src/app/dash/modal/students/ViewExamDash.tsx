/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import LessonName from '../../../profile/[studentId]/lessonName';

interface RoleDet {
  id: string;
}

interface ExamResult {
  examName: string;
  examId: string;
  lessonName: string;
  score: number;
  completedAt: string;
}

const ViewExamDash = ({ roleDet }: { roleDet: RoleDet }) => {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const allExamFetch = await axios.get(
          `${process.env.local  }/exams`
        );

        const examResultsData = await Promise.all(
          allExamFetch.data.data.map(async (exam: any) => {
            try {
              const allAnswers = await axios.get(
                `${process.env.local  }/answers/student/${roleDet.id}/exam/${exam.id}`
              );

              if (allAnswers.data.data.length === 0) return null;

              const correctAnswersCount = allAnswers.data.data.reduce(
                (acc: number, answer: any) =>
                  acc + (answer.is_correct ? 1 : 0),
                0
              );

              const totalQuestions = allAnswers.data.data.length;

              const percentage = Math.round(
                (correctAnswersCount / totalQuestions) * 100
              );

              const examTime = allAnswers.data.data[0]?.date;
              const formattedDate = format(
                new Date(examTime),
                "dd MMM yyyy - HH:mm"
              );

              return {
                examName: exam.title,
                examId: exam.id,
                lessonName: exam.lesson_id,
                score: percentage,
                completedAt: formattedDate,
              };
            } catch (error) {
              console.log(error);
              return null;
            }
          })
        );

        setExamResults(
          examResultsData.filter(Boolean) as ExamResult[]
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchAll();
  }, [roleDet.id]);

  return (
    <div className="w-full px-4">
      <h2 className="text-[#121416] text-[22px] ">
        Exam Results
      </h2>

      <div className="w-full  bg-white rounded-b-2xl">
        <div className="p-2">
          <div className="flex overflow-auto rounded-xl ">
            <table className="flex-1">
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Lesson Name</th>
                  <th>Score (%)</th>
                  <th>Completed At</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((result) => (
                  <tr key={result.examId}>
                    <td>
                      <Link
                        href={`/exam/${result.examId}?lessonId=${result.lessonName}&studentId=${roleDet.id}`}
                        className="border-b "
                      >
                        {result.examName}
                      </Link>
                    </td>
                    <td >
                      <LessonName lessonId={result.lessonName} />
                    </td>
                    <td>{result.score}%</td>
                    <td>{result.completedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExamDash;
