import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        <main
          className="flex-1 overflow-y-auto transition-colors duration-200"
          style={{
            backgroundColor: "var(--bg-main)",
          }}
        >
          <div className="mx-auto w-full max-w-[1720px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}