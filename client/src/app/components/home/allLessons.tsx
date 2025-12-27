/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SubAndViewLesson from "./subAndViewLesson";



const AllLessons: React.FC<any> = async ({ allData }) => {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 bg-[#F9FAFB] rounded-lg overflow-y-hidden">
      {allData
        .sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((lesson:any) => (
          <SubAndViewLesson key={lesson.id} lesson={lesson} />
        ))}
    </div>
  );
};

export default AllLessons;
