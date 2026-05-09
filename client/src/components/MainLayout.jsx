import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">
      <Sidebar />
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
