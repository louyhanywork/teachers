"use client";

import React, { useState, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";
import axios from "axios";
import socket from "../../../../lib/socket";

/* ================= TYPES ================= */

type StudentPayload = {
  roleData: {
    id: string;
    role?: string;
  };
  iat?: number;
  exp?: number;
};

/* ================= COMPONENT ================= */

const AddReplay = ({ commentId }: { commentId: string }) => {
  const [errText, setErrText] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [userData, setUserData] = useState<StudentPayload | null>(null);

  const userDe = getCookie("UserDe");

  /* ================= VERIFY TOKEN ================= */

  useEffect(() => {
    const validateUserToken = async () => {
      try {
        if (!userDe) return;

        const decoded = await jwtVerify(
          userDe as string,
          new TextEncoder().encode(
            process.env.NEXT_PUBLIC_TOKEN_SECRET
          )
        );

        const payload = decoded.payload as unknown as StudentPayload;

        if (!payload?.roleData?.id) {
          throw new Error("Invalid token payload");
        }

        setUserData(payload);
      } catch (error) {
        console.log("Token validation error:", error);
      }
    };

    validateUserToken();
  }, [userDe]);

  /* ================= FILE HANDLER ================= */

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  /* ================= ADD REPLY ================= */

  const addCommentHandel = async () => {
    if (!textInput.trim()) {
      setErrText(true);
      setTimeout(() => setErrText(false), 3000);
      return;
    }

    if (!userData) return;

    setIsSubmitting(true);

    try {
      let fileUrl = "";
      let fileType = "";

      if (file) {
        fileType = file.type.startsWith("image") ? "image" : "file";

        const formData = new FormData();
        formData.append(fileType, file);

        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_IMG}/upload/${fileType}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        fileUrl = uploadRes.data;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_LOCAL}/replay`, {
        comment_id: commentId,
        user_id: userData.roleData.id,
        text: textInput,
        file_url: fileUrl,
        file_type: fileType,
      });

      socket.emit("add_replay");

      setTextInput("");
      setFile(null);
    } catch (error) {
      console.log("Add replay error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white shadow-md rounded-md">
      <div className="flex gap-3 items-center p-2 px-4">
        <textarea
          rows={2}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className={`${
            errText
              ? "border-red-400 border-4 animate-pulse"
              : ""
          } w-full p-3 rounded-md resize-none`}
          placeholder="Write your comment here..."
        />

        <label htmlFor="file-input" className="cursor-pointer">
          <CiImageOn size={24} className="text-gray-600 hover:text-gray-800" />
        </label>

        <input
          id="file-input"
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFile}
        />

        <button
          type="button"
          disabled={isSubmitting}
          onClick={addCommentHandel}
          className="flex items-center justify-center px-5 py-1 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Submitting..." : "Post"}
        </button>
      </div>

      {file && (
        <div className="px-5 py-2 text-sm text-gray-500">
          {file.type.split("/")[1]} : {file.name}
        </div>
      )}
    </div>
  );
};

export default AddReplay;
