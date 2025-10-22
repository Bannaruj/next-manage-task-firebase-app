"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import planning from "@/assets/planning.png";
import Link from "next/link";
import { firebasedb } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type Task = {
  id: string;
  title: string;
  detail: string;
  is_completed: boolean;
  image_url: string;
  create_at: string;
  update_at: string;
};

function AllTaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTask() {
      //ไปดึงข้อมูลจาก firebase firestore
      const result = await getDocs(collection(firebasedb, "tasks"));
      //เอาข้อมูลที่ดึงมาแปลงให้อยู่ในรูปแบบ array ของ Task
      setTasks(
        result.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          detail: doc.data().detail,
          is_completed: doc.data().is_completed,
          image_url: doc.data().image_url,
          create_at: doc.data().create_at,
          update_at: doc.data().update_at,
        }))
      );
    }

    fetchTask();
  }, []);

  async function handleDeleteTaskClick(id: string, image_url: string) {
    if (confirm("คุณต้องการลบงานนี้ใช่หรือไม่?")) {
      try {
        // ลบ task จากฐานข้อมูล
        await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });

        // ลบรูปภาพจาก storage (ถ้ามี)
        if (image_url) {
          await fetch(`/api/deleteImage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_url }),
          });
        }

        // อัปเดต state
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } catch (error) {
        console.error("ลบไม่สำเร็จ:", error);
      }
    }
  }

  return (
    <div className="flex flex-col w-3/4 mx-auto">
      <div className="flex items-center mt-20 flex-col">
        <Image src={planning} alt="" width={150} height={150} />
        <h1 className="text-2xl font-bold mt-10">Manage Task App</h1>
        <h1 className="text-2xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>

      <div className="flex justify-end">
        <Link
          href="/addtask"
          className="mt-10 mb-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 w-max rounded"
        >
          เพิ่มงาน
        </Link>
      </div>

      <div>
        <table className="min-w-full border boder-black text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-black p-2">รูป</th>
              <th className="border border-black p-2">งานที่ต้องทำ</th>
              <th className="border border-black p-2">รายละเอียด</th>
              <th className="border border-black p-2">สถานะ</th>
              <th className="border border-black p-2">วันที่เพิ่ม</th>
              <th className="border border-black p-2">วันที่แก้ไข</th>
              <th className="border border-black p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border border-black p-2">
                  {task.image_url ? (
                    <Image
                      src={task.image_url}
                      alt="task"
                      width={100}
                      height={100}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border border-black p-2">{task.title}</td>
                <td className="border border-black p-2">{task.detail}</td>
                <td className="border border-black p-2">
                  {task.is_completed ? (
                    <span className="text-green-500">เสร็จสิ้นแล้ว</span>
                  ) : (
                    <span className="text-red-500">ยังไม่เสร็จสิ้น</span>
                  )}
                </td>
                <td className="border border-black p-2">
                  {new Date(task.create_at).toLocaleString()}
                </td>
                <td className="border border-black p-2">
                  {new Date(task.update_at).toLocaleString()}
                </td>
                <td className="border border-black p-2 text-center">
                  <Link
                    href={`/edittask/${task.id}`}
                    className="mr-2 text-green-500 font-bold cursor-pointer"
                  >
                    แก้ไข
                  </Link>
                  <button
                    onClick={() =>
                      handleDeleteTaskClick(task.id, task.image_url)
                    }
                    className="text-red-500 font-bold cursor-pointer"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/" className="text-blue-500 font-bold">
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}

export default AllTaskPage;
