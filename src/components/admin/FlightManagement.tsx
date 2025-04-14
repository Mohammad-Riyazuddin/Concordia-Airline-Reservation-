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

  const [seats, setSeats] = useState<
    Array<{
      seatNumber: string;
      class: "Economy" | "Business" | "First";
      isOccupied: boolean;
    }>
  >([]);

  const [newSeat, setNewSeat] = useState({
    seatNumber: "",
    class: "Economy" as "Economy" | "Business" | "First",
    isOccupied: false,
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

  const handleSeatInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewSeat({
        ...newSeat,
        [name]: checked,
      });
    } else {
      setNewSeat({
        ...newSeat,
        [name]: value,
      });
    }
  };

  const addSeat = () => {
    if (!newSeat.seatNumber) return;

    setSeats([...seats, { ...newSeat }]);
    setNewSeat({
      seatNumber: "",
      class: "Economy",
      isOccupied: false,
    });
  };

  const removeSeat = (index: number) => {
    const updatedSeats = [...seats];
    updatedSeats.splice(index, 1);
    setSeats(updatedSeats);
  };

  const handleAddFlight = async () => {
    try {
      // Use the manually added seats instead of generating them
      const flightData = {
        ...formData,
        availableSeats: seats,
        price: Number(formData.price),
      } as FlightData;

      console.log("Sending flight data:", flightData);

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
    setSeats([]);
    setNewSeat({
      seatNumber: "",
      class: "Economy",
      isOccupied: false,
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

            {/* Seat Management Section */}
            <div className="space-y-4 mt-4 border-t pt-4">
              <h3 className="font-semibold">Seat Management</h3>

              {/* Add New Seat Form */}
              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="space-y-2">
                  <Label htmlFor="seatNumber">Seat Number</Label>
                  <Input
                    id="seatNumber"
                    name="seatNumber"
                    value={newSeat.seatNumber}
                    onChange={handleSeatInputChange}
                    placeholder="E.g., A1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <select
                    id="class"
                    name="class"
                    value={newSeat.class}
                    onChange={handleSeatInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOccupied"
                    name="isOccupied"
                    checked={newSeat.isOccupied}
                    onChange={handleSeatInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="isOccupied" className="text-sm">
                    Occupied
                  </Label>
                  <Button
                    type="button"
                    onClick={addSeat}
                    className="ml-auto"
                    disabled={!newSeat.seatNumber}
                  >
                    Add Seat
                  </Button>
                </div>
              </div>

              {/* Seats List */}
              {seats.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Added Seats ({seats.length})
                  </h4>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seat Number
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Class
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {seats.map((seat, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {seat.seatNumber}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {seat.class}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex px-2 text-xs font-semibold rounded-full ${seat.isOccupied ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                              >
                                {seat.isOccupied ? "Occupied" : "Available"}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSeat(index)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
