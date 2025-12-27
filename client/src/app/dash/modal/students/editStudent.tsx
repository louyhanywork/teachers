/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IoClose } from "react-icons/io5";
import InfoStudent from "./infoStudent";
import PaidLessonsDash from "./paidLessons";
import ViewedLessonsDash from "./viewdLesson";
import SubscribeTeacher from "../../../profile/[studentId]/subscribeTeacher";
import ViewExamDash from './ViewExamDash';

const EditStudent = ({ dataUser, dataStudent, setOpenModal }: any) => {
  return (
    <div className="fixed flex justify-center items-center top-0 left-0 bg-black/50 w-screen h-screen z-50">
      <div className="w-11/12 md:w-8/12 bg-white rounded-md p-4 h-11/12 overflow-y-auto">
        <div className="flex justify-end">
          <div>
            <IoClose
              className="text-4xl cursor-pointer hover:opacity-35 duration-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
        </div>
        <div className="flex justify-between growing flex-col md:flex-row gap-4">
          <InfoStudent roleDet={dataUser} studentDet={dataStudent} />
          <SubscribeTeacher studentId={dataUser} dash={true} />
        </div>
        <PaidLessonsDash roleDet={dataUser} studentDet={dataStudent} />
        <ViewedLessonsDash roleDet={dataUser} />
        <ViewExamDash roleDet={dataUser} />
      </div>
    </div>
  );
};

export default EditStudent;
