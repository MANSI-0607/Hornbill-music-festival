import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Invalid credentials");
      }

      localStorage.setItem("adminToken", data.token);
      toast.success("Login successful");
      navigate("/admin");
    } catch (err: any) {
      toast.error(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#090b10] to-[#040507] p-4 text-white">
      <form
        onSubmit={handleLogin}
        className="space-y-5 p-8 bg-[#0e121a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-festival-orange/15 border border-festival-orange/30 text-festival-orange flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-xs text-gray-400">
            Sign in to manage official festival merchandise & auditions
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-300 font-medium block mb-1">
              Admin Email
            </label>
            <Input
              type="email"
              placeholder="admin@hornbill.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-black/40 border-white/10 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 font-medium block mb-1">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="bg-black/40 border-white/10 text-white text-sm"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-festival-orange to-orange-600 hover:from-festival-orange/90 hover:to-orange-700 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" /> Secure Sign In
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
