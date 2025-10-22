"use client";
import React from "react";
import Image from "next/image";
import planning from "@/assets/planning.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditTaskPage() {
  // แก้ไขชื่อตัวแปรให้เป็นมาตรฐาน: rounter -> router
  const router = useRouter();
  // id ที่มาจาก useParams อาจเป็น string หรือ string[] (กรณี dynamic route)
  const idParam = useParams().id;
  const taskId = Array.isArray(idParam) ? idParam[0] : idParam;

  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  // ตรวจสอบชื่อคอลัมน์ใน Supabase: is_complete หรือ is_completed
  const [is_complete, setIsComplete] = useState<boolean>(false);
  const [image_file, setImageFile] = useState<File | null>(null);
  const [preview_file, setPreviewFile] = useState<string | null>(null);
  // State นี้ใช้สำหรับเก็บ URL รูปภาพเดิม เพื่อใช้ในการลบรูปเก่าเมื่อมีการอัปโหลดรูปใหม่
  const [old_image_file, setOldImageFile] = useState<string | null>(null);

  // ดึงข้อมูลจาก supabase มาแสดงที่หน้าจอตามid ที่ได้มากจากurl
  useEffect(() => {
    async function fetchData() {}

    fetchData();
  }, [taskId]); // ใช้ taskId ใน dependency array

  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImageFile(file);

    if (file) {
      setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }

  async function handleUploadAndUpdate(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-col w-3/4 mx-auto">
      <div className="flex items-center mt-20 flex-col">
        <Image src={planning} alt="Planning Icon" width={150} height={150} />
        <h1 className="text-2xl font-bold mt-10">Manage Task App</h1>
        <h1 className="text-2xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>
      <div className="flex flex-col border border-gray-300 p-5 rounded-lg shadow-lg mt-5">
        <h1 className="text-center text-xl font-bold rounded-xl text-gray-700">
          👨‍🔧แก้ไขงานที่ต้องทำ (ID: {taskId})
        </h1>
      </div>
      <form onSubmit={handleUploadAndUpdate}>
        <div className="flex flex-col mt-5">
          <label className="text-lg font-bold text-gray-700">ชื่องาน</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </div>

        <div className="flex flex-col mt-5">
          <label className="text-lg font-bold text-gray-700">
            รายละเอียดงาน
          </label>
          <textarea
            className="text-lg font-bold border border-gray-300 rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setDetail(e.target.value)}
            value={detail}
            rows={4}
          ></textarea>
        </div>

        <div className="flex flex-col mt-5">
          <label className="text-lg font-bold text-gray-700">
            อัปโหลดรูปภาพ
          </label>
          <input
            id="fileinput"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleSelectImagePreview}
          />
          <label
            htmlFor="fileinput"
            className="bg-blue-500 hover:bg-blue-600 rounded-lg p-3 text-white cursor-pointer w-40 text-center transition duration-200 shadow-md"
          >
            เลือกรูปใหม่
          </label>

          {preview_file && (
            <div className="mt-3 p-3 border border-gray-200 rounded-lg max-w-max">
              <h3 className="text-sm font-semibold mb-2">
                รูปภาพปัจจุบัน/รูปภาพใหม่:
              </h3>
              <Image
                src={preview_file}
                alt="preview"
                width={150}
                height={150}
                className="rounded-lg object-cover"
                // ใช้ URL ของรูปภาพเพื่อป้องกัน error ใน Next/Image เมื่อ URL เป็น external
                loader={({ src }) => src}
                unoptimized={true}
              />
              {/* แสดงปุ่มลบรูปภาพเฉพาะเมื่อมีรูปภาพอยู่ และไม่ใช่รูปเดิมที่ดึงมา */}
              {image_file && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewFile(null);
                    setImageFile(null);
                    // ตั้งค่ากลับไปเป็นรูปเดิม (old_image_file) หากผู้ใช้ต้องการยกเลิกการเลือกรูปใหม่
                    setPreviewFile(old_image_file);
                  }}
                  className="text-red-500 hover:text-red-700 mt-2 text-sm"
                >
                  ยกเลิกรูปใหม่
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col mt-5">
          <label htmlFor="status" className="text-lg font-bold text-gray-700">
            สถานะงาน
          </label>
          <select
            id="status"
            className="border border-gray-300 rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
            value={is_complete ? "1" : "0"}
            onChange={(e) => setIsComplete(e.target.value === "1")}
          >
            <option value="0">ยังไม่เสร็จสิ้น</option>
            <option value="1">เสร็จสิ้น</option>
          </select>
        </div>
        <div className="flex flex-col mt-8">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 rounded-lg p-3 text-white font-bold transition duration-200 shadow-md"
          >
            บันทึกแก้ไขงาน
          </button>
        </div>
      </form>

      <div className="flex justify-center mt-10 mb-20">
        <Link
          href="/alltask"
          className="text-blue-600 hover:text-blue-800 font-bold transition duration-200"
        >
          กลับไปแสดงงานทั้งหมด
        </Link>
      </div>
    </div>
  );
}
