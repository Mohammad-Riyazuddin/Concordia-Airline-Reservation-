import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { PlusCircle, Edit, Trash } from "lucide-react";
import {
  LoyaltyProgramData,
  addLoyaltyProgram,
  getAllLoyaltyPrograms,
  updateLoyaltyProgram,
  deleteLoyaltyProgram,
} from "../../api/loyalty";

const LoyaltyManagement = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<LoyaltyProgramData>>({
    programId: "",
    programName: "",
    pointsPerDollar: 0,
    tier: "",
    active: true,
    validTill: "",
  });

  // Fetch all loyalty programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllLoyaltyPrograms();
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching loyalty programs:", error);
      setError("Failed to load loyalty programs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      active: checked,
    });
  };

  const handleAddProgram = async () => {
    try {
      const programData = {
        ...formData,
        pointsPerDollar: Number(formData.pointsPerDollar),
      } as LoyaltyProgramData;

      await addLoyaltyProgram(programData);
      setShowAddDialog(false);
      fetchPrograms();
      resetForm();
    } catch (error) {
      console.error("Error adding loyalty program:", error);
      setError("Failed to add loyalty program. Please try again.");
    }
  };

  const handleEditProgram = async () => {
    try {
      if (!currentProgram) return;

      const programData = {
        ...formData,
        pointsPerDollar: Number(formData.pointsPerDollar),
      };

      await updateLoyaltyProgram(currentProgram.programId, programData);
      setShowEditDialog(false);
      fetchPrograms();
      resetForm();
    } catch (error) {
      console.error("Error updating loyalty program:", error);
      setError("Failed to update loyalty program. Please try again.");
    }
  };

  const handleDeleteProgram = async () => {
    try {
      if (!currentProgram) return;

      await deleteLoyaltyProgram(currentProgram.programId);
      setShowDeleteDialog(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting loyalty program:", error);
      setError("Failed to delete loyalty program. Please try again.");
    }
  };

  const openEditDialog = (program: any) => {
    setCurrentProgram(program);
    setFormData({
      programId: program.programId,
      programName: program.programName,
      pointsPerDollar: program.pointsPerDollar,
      tier: program.tier,
      active: program.active,
      validTill: program.validTill,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (program: any) => {
    setCurrentProgram(program);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      programId: "",
      programName: "",
      pointsPerDollar: 0,
      tier: "",
      active: true,
      validTill: "",
    });
    setCurrentProgram(null);
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loyalty Program Management</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Program
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading loyalty programs...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : programs.length === 0 ? (
            <div className="text-center py-4">
              No loyalty programs found. Add a new program to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program ID</TableHead>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Points Per Dollar</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Till</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.programId}>
                    <TableCell>{program.programId}</TableCell>
                    <TableCell>{program.programName}</TableCell>
                    <TableCell>{program.pointsPerDollar}</TableCell>
                    <TableCell>{program.tier}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${program.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {program.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{program.validTill}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(program)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Loyalty Program Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Loyalty Program</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="programId">Program ID</Label>
                <Input
                  id="programId"
                  name="programId"
                  value={formData.programId}
                  onChange={handleInputChange}
                  placeholder="E.g., GOLD2023"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input
                  id="programName"
                  name="programName"
                  value={formData.programName}
                  onChange={handleInputChange}
                  placeholder="E.g., Gold Rewards"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pointsPerDollar">Points Per Dollar</Label>
                <Input
                  id="pointsPerDollar"
                  name="pointsPerDollar"
                  type="number"
                  min="0"
                  value={formData.pointsPerDollar}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Input
                  id="tier"
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  placeholder="E.g., Gold, Silver, Bronze"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validTill">Valid Till</Label>
                <Input
                  id="validTill"
                  name="validTill"
                  value={formData.validTill}
                  onChange={handleInputChange}
                  placeholder="E.g., Dec 31, 2023"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProgram}>Add Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Loyalty Program Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Loyalty Program</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="programId">Program ID</Label>
                <Input
                  id="programId"
                  name="programId"
                  value={formData.programId}
                  onChange={handleInputChange}
                  disabled
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input
                  id="programName"
                  name="programName"
                  value={formData.programName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pointsPerDollar">Points Per Dollar</Label>
                <Input
                  id="pointsPerDollar"
                  name="pointsPerDollar"
                  type="number"
                  min="0"
                  value={formData.pointsPerDollar}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Input
                  id="tier"
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validTill">Valid Till</Label>
                <Input
                  id="validTill"
                  name="validTill"
                  value={formData.validTill}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProgram}>Update Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Loyalty Program Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              loyalty program
              {currentProgram && ` ${currentProgram.programName}`} and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProgram}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LoyaltyManagement;
