import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Trash2,
  Download,
  Search,
  RefreshCw,
  ExternalLink,
  Image as ImageIcon,
  CheckSquare,
  Square,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

interface Audition {
  _id: string;
  bandName: string;
  genre: string;
  bandMembers: string;
  bandBio: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  cityState: string;
  socialLinks?: string;
  auditionVideoUrl: string;
  bandPhotoUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  approved: "bg-green-500/20 text-green-300 border-green-500/40",
  rejected: "bg-red-500/20 text-red-300 border-red-500/40",
};

export default function AdminAuditions() {
  const navigate = useNavigate();
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const token = localStorage.getItem("adminToken");

  const fetchAuditions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/auditions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/admin/login"); return; }
      const data = await res.json();
      setAuditions(data);
    } catch {
      console.error("Failed to fetch auditions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuditions(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return auditions.filter((a) => {
      const matchSearch =
        !q ||
        a.bandName.toLowerCase().includes(q) ||
        a.contactEmail.toLowerCase().includes(q) ||
        a.cityState.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        a.contactPerson.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [auditions, search, statusFilter]);

  const allSelected = filtered.length > 0 && filtered.every((a) => selected.has(a._id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((a) => next.delete(a._id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((a) => next.add(a._id));
        return next;
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteOne = async (id: string) => {
    await fetch(`${API_BASE_URL}/api/admin/auditions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setAuditions((prev) => prev.filter((a) => a._id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setDeleteTarget(null);
  };

  const deleteBulk = async () => {
    const ids = Array.from(selected);
    await fetch(`${API_BASE_URL}/api/admin/auditions`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    setAuditions((prev) => prev.filter((a) => !selected.has(a._id)));
    setSelected(new Set());
    setBulkDeleteOpen(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API_BASE_URL}/api/admin/auditions/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    setAuditions((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: status as Audition["status"] } : a))
    );
  };

  const exportExcel = () => {
    const rows = (selected.size > 0 ? auditions.filter((a) => selected.has(a._id)) : filtered).map((a) => ({
      "Band Name": a.bandName,
      Genre: a.genre,
      "Band Members": a.bandMembers,
      "Band Bio": a.bandBio,
      "Contact Person": a.contactPerson,
      Email: a.contactEmail,
      Phone: a.contactPhone,
      "City / State": a.cityState,
      "Social Links": a.socialLinks || "",
      "Audition Video": a.auditionVideoUrl,
      "Band Photo": a.bandPhotoUrl || "",
      Status: a.status,
      "Submitted On": new Date(a.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Auditions");
    XLSX.writeFile(wb, `HMF_Auditions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-screen-xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Audition Submissions</h1>
              <p className="text-sm text-gray-400">
                {auditions.length} total &nbsp;·&nbsp; {filtered.length} shown
                {selected.size > 0 && <span className="text-festival-orange"> &nbsp;·&nbsp; {selected.size} selected</span>}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={fetchAuditions}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportExcel}>
              <Download className="h-4 w-4 mr-1" />
              {selected.size > 0 ? `Export ${selected.size} selected` : "Export Excel"}
            </Button>
            {selected.size > 0 && (
              <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete {selected.size}
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search band, email, city…"
              className="pl-9 bg-input border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading submissions…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No submissions found.</div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-10">
                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-white">
                      {allSelected ? <CheckSquare className="h-4 w-4 text-festival-orange" /> : <Square className="h-4 w-4" />}
                    </button>
                  </TableHead>
                  <TableHead className="text-gray-300">Photo</TableHead>
                  <TableHead className="text-gray-300">Band</TableHead>
                  <TableHead className="text-gray-300">Genre</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">City</TableHead>
                  <TableHead className="text-gray-300">Video</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <>
                    <TableRow
                      key={a._id}
                      className={`border-white/10 cursor-pointer transition-colors ${selected.has(a._id) ? "bg-festival-orange/5" : "hover:bg-white/5"}`}
                      onClick={() => setExpandedRow(expandedRow === a._id ? null : a._id)}
                    >
                      <TableCell onClick={(e) => { e.stopPropagation(); toggleOne(a._id); }}>
                        {selected.has(a._id)
                          ? <CheckSquare className="h-4 w-4 text-festival-orange" />
                          : <Square className="h-4 w-4 text-gray-500" />}
                      </TableCell>
                      <TableCell>
                        {a.bandPhotoUrl
                          ? <img src={a.bandPhotoUrl} alt={a.bandName} className="w-10 h-10 rounded-md object-cover border border-white/10" />
                          : <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center"><ImageIcon className="h-4 w-4 text-gray-500" /></div>}
                      </TableCell>
                      <TableCell className="font-medium text-white">{a.bandName}</TableCell>
                      <TableCell className="text-gray-300 text-sm">{a.genre}</TableCell>
                      <TableCell>
                        <p className="text-sm text-white">{a.contactPerson}</p>
                        <p className="text-xs text-gray-400">{a.contactEmail}</p>
                        <p className="text-xs text-gray-400">{a.contactPhone}</p>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">{a.cityState}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <a href={a.auditionVideoUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <ExternalLink className="h-3 w-3" /> Watch
                        </a>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select value={a.status} onValueChange={(v) => updateStatus(a._id, v)}>
                          <SelectTrigger className={`h-7 text-xs border rounded-full px-2 w-28 ${STATUS_COLORS[a.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => setDeleteTarget(a._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded detail row */}
                    {expandedRow === a._id && (
                      <TableRow key={`${a._id}-detail`} className="border-white/10 bg-white/[0.03]">
                        <TableCell colSpan={10} className="py-4 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Band Members</p>
                              <p className="text-gray-200 whitespace-pre-wrap">{a.bandMembers}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Band Bio</p>
                              <p className="text-gray-200 whitespace-pre-wrap">{a.bandBio}</p>
                            </div>
                            {a.socialLinks && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Social Links</p>
                                <p className="text-blue-400 whitespace-pre-wrap">{a.socialLinks}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Single delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteTarget && deleteOne(deleteTarget)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirm */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} submissions?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={deleteBulk}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
