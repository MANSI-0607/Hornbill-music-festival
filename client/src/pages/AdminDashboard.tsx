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
import { LogOut, Music, PackageOpen } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const goToMerch = () => navigate("/admin/merch");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Merchandise</CardTitle>
              <CardDescription>Create and update store items</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-muted-foreground">Add, edit, or remove items shown on the public Merch page.</div>
              <Button onClick={goToMerch}>
                <PackageOpen className="mr-2 h-4 w-4" /> Open
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
