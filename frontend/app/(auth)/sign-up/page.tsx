import SignupCard from "@/components/public/auth/SignupCard";

export default function SignupPage() {
  return  <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4">
        {/* ── Background grid ── */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
  
        {/* ── Color blobs ── */}
        <div className="absolute top-[-10%] right-[-5%] w-100 h-100 rounded-full bg-indigo-600 opacity-20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-87.5 h-87.5 rounded-full bg-blue-500 opacity-15 blur-[100px] pointer-events-none" />
  
        {/* ── Card ── */}
        <div className="relative z-10 w-full max-w-sm">
          <SignupCard />
        </div>
      </div>;
}
