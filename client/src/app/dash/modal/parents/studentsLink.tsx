import React from "react";
import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import InfoStudent from "../students/infoStudent";
import ViewedLessonsDash from "../students/viewdLesson";
import PaidLessonsDash from "../students/paidLessons";
import AllViewsExam from "../../../profile/[studentId]/exam/allViewsExam";
import { MdDelete } from "react-icons/md";
import socket from '../../../lib/socket';


const StudentsLink = ({ studentId, parentId }) => {
  const [roleDet, setRoleDet] = useState({});
  const [studentDet, setStudentDet] = useState({});
  const [openModel, setOpenModel] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/students/${studentId}`
        );
        setStudentDet(res.data.data);
        const studentDetails = await axios.get(
          `${process.env.local}/users/${studentId}`,
          {
            headers: {
              Authorization: `${getCookie("dataRoleToken")}`,
            },
          }
        );

        setRoleDet(studentDetails.data.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    fetchStudentDetails();
  }, [studentId]);
  const handleDeleteLink = async () => {
    try {
      const res =await axios.delete(`${process.env.local}/ps/delete/${studentId}/${parentId}/${process.env.teacherId}`);
      console.log(res.data.data);
      socket.emit("update_ps")
      
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <>
      <div className="flex gap-2 mb-4">
        <div>Student:</div>
     <div className="flex items-center gap-2">   <div
          onClick={() => setOpenModel(true)}
          className="text-2xl border-b text-blue-600 hover:text-blue-400 duration-300 cursor-pointer"
        >
          {roleDet.full_name}
        </div>
        <MdDelete onClick={handleDeleteLink} className="text-red-500 text-2xl hover:text-red-700 cursor-pointer" />
</div>
        {openModel && (
          <div
            className={`fixed  duration-500 top-0 left-8 flex justify-center items-center w-screen h-screen `}
          >
            <div className="bg-white w-11/12 md:w-9/12 lg:w-2/4  h-3/4 rounded-lg overflow-hidden shadow-2xl">
              <div className="flex justify-start">
                <IoMdArrowRoundBack
                  className="text-4xl cursor-pointer hover:opacity-35 duration-300"
                  onClick={() => setOpenModel(false)}
                />
              </div>
              <div className="p-4 w-full">
                <InfoStudent roleDet={roleDet} studentDet={studentDet} />
                <PaidLessonsDash roleDet={roleDet} studentDet={studentDet} />
                <ViewedLessonsDash roleDet={roleDet} />
                <AllViewsExam roleDet={roleDet} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentsLink;
