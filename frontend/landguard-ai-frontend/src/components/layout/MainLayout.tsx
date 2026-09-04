import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#090D16] text-white overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-[#090D16]">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-6 lg:px-8 lg:py-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}