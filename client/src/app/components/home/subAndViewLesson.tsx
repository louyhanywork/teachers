import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { format } from "date-fns";

interface Lesson {
  id: string;
  title: string;
  date: string;
  image_url: string;
  is_active: boolean;
  is_paid: boolean;
  is_new?: boolean;
  price?: number | string;
  views?: {
    lesson_id: string;
    progress: number;
  };
  subscribe?: {
    lesson_id: string;
    price: number | string;
    expire: string;
  };
}

interface SubAndViewLessonProps {
  lesson: Lesson;
}

const SubAndViewLesson: React.FC<SubAndViewLessonProps> = ({ lesson }) => {
  const now = new Date();

  // ======================
  // 👀 View Logic
  // ======================
  const isViewed = lesson.views?.lesson_id === lesson.id;
  const progressPercent = Number(lesson.views?.progress || 0).toFixed(0);

  // ======================
  // 📅 Date Validation
  // ======================
  const lessonDateValid = new Date(lesson.date) <= now;

  const subscribeExpireValid = lesson.subscribe?.expire
    ? new Date(lesson.subscribe.expire) >= now
    : false;

  // ======================
  // 💰 Payment Logic
  // ======================
  const isPaidLesson = lesson.is_paid === true;

  const isSubscribed =
    isPaidLesson &&
    lesson.subscribe?.lesson_id === lesson.id &&
    subscribeExpireValid;

  const isFreeAfterPay =
    isSubscribed &&
    Number(lesson.subscribe?.price ?? lesson.price ?? 0) === 0;

  // ======================
  // 🔒 Final Access Logic
  // ======================
  const canAccessLesson =
    lesson.is_active &&
    lessonDateValid &&
    (!isPaidLesson || isSubscribed);

  return (
    <div className="w-fit max-w-80 flex-shrink-0">
      <Link
        href={canAccessLesson ? `/lesson/${lesson.id}` : "#"}
        className={`relative flex flex-col h-96 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.03] border ${
          canAccessLesson ? "border-gray-200" : "border-gray-300"
        }`}
      >
        {/* Thumbnail */}
        <div className="relative h-2/3 w-full">
          <Image
            src={`${process.env.img}/image/${lesson.image_url}`}
            alt={lesson.title}
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className={`rounded-t-2xl object-cover ${
              !canAccessLesson ? "opacity-50 grayscale" : ""
            }`}
          />

          {!canAccessLesson && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <FaLock className="text-white text-3xl" />
            </div>
          )}

          {lesson.is_new && canAccessLesson && (
            <span className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded">
              NEW
            </span>
          )}
        </div>

        {/* Progress */}
        {isViewed && (
          <div
            className="h-2 bg-green-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        )}

        {/* Content */}
        <div className="flex flex-col justify-between h-1/3 p-3 bg-white">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(lesson.date), "d MMM yyyy")}
            </p>
          </div>

          {/* Action Button */}
          <div>
            {!lessonDateValid ? (
              <button className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold mt-2">
                Coming Soon
              </button>
            ) : isSubscribed ? (
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold mt-2">
                Continue {isFreeAfterPay && "(Free)"}
              </button>
            ) : isPaidLesson ? (
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-2">
                Unlock for {lesson.price} EGP
              </button>
            ) : (
              <button className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold mt-2">
                Start Lesson
              </button>
            )}

            {lesson.subscribe && !subscribeExpireValid && (
              <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold mt-2">
                Subscription Expired
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SubAndViewLesson;
