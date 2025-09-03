import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Music, Eye, Check, X, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BandRegistration {
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
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<BandRegistration[]>([]);
  const [selectedRegistration, setSelectedRegistration] =
    useState<BandRegistration | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        "http://localhost:5000/api/admin/dashboard/bands",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      toast.error("Failed to fetch registrations");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/dashboard/bands/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(`Status updated to ${status}`);
      fetchRegistrations();
      setSelectedRegistration(null);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    const icons = {
      pending: <Clock className="mr-1 h-3 w-3" />,
      approved: <Check className="mr-1 h-3 w-3" />,
      rejected: <X className="mr-1 h-3 w-3" />,
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {icons[status as keyof typeof icons]} {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="registrations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="registrations">Band Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>Band Registration Submissions</CardTitle>
                <CardDescription>
                  Review and manage band registration applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Band Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-muted-foreground"
                          >
                            No registrations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        registrations.map((registration) => (
                          <TableRow key={registration._id}>
                            <TableCell>{registration.bandName}</TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">
                                  {registration.contactPerson}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {registration.contactEmail}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{registration.genre}</TableCell>
                            <TableCell>
                              {getStatusBadge(registration.status)}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                registration.createdAt
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedRegistration(registration)
                                }
                              >
                                <Eye className="mr-1 h-4 w-4" /> View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog
          open={!!selectedRegistration}
          onOpenChange={() => setSelectedRegistration(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedRegistration?.bandName}</DialogTitle>
              <DialogDescription>
                Registration details and actions
              </DialogDescription>
            </DialogHeader>
            {selectedRegistration && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Contact Person
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRegistration.contactPerson}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRegistration.contactEmail}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRegistration.contactPhone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Genre</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRegistration.genre}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">City / State</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRegistration.cityState}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Band Members</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRegistration.bandMembers}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRegistration.bandBio}
                  </p>
                </div>

                {selectedRegistration.socialLinks && (
                  <div>
                    <label className="text-sm font-medium">Social Links</label>
                    <a
                      href={selectedRegistration.socialLinks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline mt-1"
                    >
                      {selectedRegistration.socialLinks}
                    </a>
                  </div>
                )}

                {selectedRegistration.auditionVideoUrl && (
                  <div>
                    <label className="text-sm font-medium">
                      Audition Video
                    </label>
                    <a
                      href={selectedRegistration.auditionVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline mt-1"
                    >
                      {selectedRegistration.auditionVideoUrl}
                    </a>
                  </div>
                )}

                {selectedRegistration.bandPhotoUrl && (
                  <div>
                    <label className="text-sm font-medium">Band Photo</label>
                    <img
                      src={selectedRegistration.bandPhotoUrl}
                      alt={selectedRegistration.bandName}
                      className="mt-1 rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() =>
                      updateStatus(selectedRegistration._id, "approved")
                    }
                    disabled={
                      loading || selectedRegistration.status === "approved"
                    }
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      updateStatus(selectedRegistration._id, "rejected")
                    }
                    disabled={
                      loading || selectedRegistration.status === "rejected"
                    }
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
