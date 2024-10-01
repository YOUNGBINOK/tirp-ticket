"use client";

import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  // 버튼 클릭으로 경로 이동을 처리하는 함수
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // 간결한 컴포넌트 구조
  return (
    <div className={`flex ${isOpen ? "w-64" : "w-20"} h-screen bg-gray-800`}>
      <div className="flex flex-col justify-between h-full p-4">
        <Button className="text-white mb-6" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"}
        </Button>

        <ul className="text-white space-y-4">
          {/* 페이지 전환을 위한 반복 구조 */}
          {["Dashboard", "Settings", "Profile", "Logout"].map((item, index) => (
            <li key={index}>
              <Button
                onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
              >
                {item}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
