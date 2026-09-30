import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import ChatWindow from "../components/ChatWindow";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0B1120] overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Topbar />

        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}