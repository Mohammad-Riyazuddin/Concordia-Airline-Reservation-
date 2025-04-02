import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
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
import { PlusCircle, Edit, Trash, ArrowLeft } from "lucide-react";
import {
  FlightData,
  getAllFlights,
  addFlight,
  updateFlight,
  deleteFlight,
} from "../../api/flights";

const FlightManagement = () => {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentFlight, setCurrentFlight] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<FlightData>>({
    flightNumber: "",
    departureTime: "",
    arrivalTime: "",
    origin: "",
    destination: "",
    price: 0,
    airline: "",
    availableSeats: [],
  });
  const navigate = useNavigate();

  // Fetch all flights on component mount
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use fetch to directly get flights from the API endpoint
      const response = await fetch("http://localhost:3000/flights");
      if (!response.ok) {
        throw new Error(`Failed to fetch flights: ${response.statusText}`);
      }

      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setError("Failed to load flights. Please try again.");
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

  const handleAddFlight = async () => {
    try {
      // Create a basic set of available seats
      const seatRows = ["A", "B", "C", "D", "E", "F"];
      const seatColumns = [1, 2, 3, 4, 5];
      const availableSeats = [];

      for (const row of seatRows) {
        for (const col of seatColumns) {
          availableSeats.push({
            seatNumber: `${row}${col}`,
            class: col <= 2 ? "First" : "Economy",
            isOccupied: false,
          });
        }
      }

      const flightData = {
        ...formData,
        availableSeats,
        price: Number(formData.price),
      } as FlightData;

      // Use fetch to make a direct POST request to the /flights endpoint
      const response = await fetch("http://localhost:3000/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add flight: ${response.statusText}`);
      }

      setShowAddDialog(false);
      fetchFlights();
      resetForm();
    } catch (error) {
      console.error("Error adding flight:", error);
      setError("Failed to add flight. Please try again.");
    }
  };

  const handleEditFlight = async () => {
    try {
      if (!currentFlight) return;

      const flightData = {
        ...formData,
        price: Number(formData.price),
      };

      // Use fetch to make a direct PUT request to the /flight/{flightID}/update endpoint
      const response = await fetch(
        `http://localhost:3000/flight/${currentFlight._id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flightData),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update flight: ${response.statusText}`);
      }

      setShowEditDialog(false);
      fetchFlights();
      resetForm();
    } catch (error) {
      console.error("Error updating flight:", error);
      setError("Failed to update flight. Please try again.");
    }
  };

  const handleDeleteFlight = async () => {
    try {
      if (!currentFlight) return;

      // Use fetch to make a direct DELETE request to the /flight/{flightID}/delete endpoint
      const response = await fetch(
        `http://localhost:3000/flight/${currentFlight._id}/delete`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete flight: ${response.statusText}`);
      }

      setShowDeleteDialog(false);
      fetchFlights();
    } catch (error) {
      console.error("Error deleting flight:", error);
      setError("Failed to delete flight. Please try again.");
    }
  };

  const openEditDialog = (flight: any) => {
    setCurrentFlight(flight);

    // Create a copy of available seats or initialize an empty array
    const availableSeats = flight.availableSeats
      ? [...flight.availableSeats]
      : [];

    setFormData({
      flightNumber: flight.flightNumber,
      departureTime: new Date(flight.departureTime).toISOString().slice(0, 16),
      arrivalTime: new Date(flight.arrivalTime).toISOString().slice(0, 16),
      origin: flight.origin,
      destination: flight.destination,
      price: flight.price,
      airline: flight.airline,
      availableSeats: availableSeats,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (flight: any) => {
    setCurrentFlight(flight);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      flightNumber: "",
      departureTime: "",
      arrivalTime: "",
      origin: "",
      destination: "",
      price: 0,
      airline: "",
      availableSeats: [],
    });
    setCurrentFlight(null);
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Flight Management</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Flight
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading flights...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : flights.length === 0 ? (
            <div className="text-center py-4">
              No flights found. Add a new flight to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight Number</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.flightNumber}>
                    <TableCell>{flight.flightNumber}</TableCell>
                    <TableCell>{flight.airline}</TableCell>
                    <TableCell>{flight.origin}</TableCell>
                    <TableCell>{flight.destination}</TableCell>
                    <TableCell>
                      {new Date(flight.departureTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(flight.arrivalTime).toLocaleString()}
                    </TableCell>
                    <TableCell>${flight.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(flight)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(flight)}
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

      {/* Add Flight Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Flight</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number</Label>
                <Input
                  id="flightNumber"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleInputChange}
                  placeholder="E.g., AA123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  name="airline"
                  value={formData.airline}
                  onChange={handleInputChange}
                  placeholder="E.g., American Airlines"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="E.g., New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="E.g., Los Angeles"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="datetime-local"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="datetime-local"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFlight}>Add Flight</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Flight Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Flight</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number</Label>
                <Input
                  id="flightNumber"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleInputChange}
                  disabled
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  name="airline"
                  value={formData.airline}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="datetime-local"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="datetime-local"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFlight}>Update Flight</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Flight Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              flight
              {currentFlight && ` ${currentFlight.flightNumber}`} and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFlight}
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

export default FlightManagement;
