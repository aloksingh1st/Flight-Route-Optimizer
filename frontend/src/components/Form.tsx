import React, { useState } from "react";
import { Plus, X, MapPin, Plane, Car, Ship, Train } from "lucide-react";

import airports from "../data/data.json";

interface Destination {
  id: string;
  name: string;
}

function Form({ isModalOpen, setIsModalOpen }: any) {
  const [selectedOption, setSelectedOption] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: "1", name: "" },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const serviceOptions = [
    { value: "flight", label: "Flight Booking", icon: Plane },
    { value: "road-trip", label: "Road Trip", icon: Car },
    { value: "cruise", label: "Cruise Package", icon: Ship },
    { value: "train", label: "Train Journey", icon: Train },
  ];

  const addDestination = () => {
    const newDestination: Destination = {
      id: Date.now().toString(),
      name: "",
    };
    setDestinations([...destinations, newDestination]);
  };

  const removeDestination = (id: string) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((dest) => dest.id !== id));
    }
  };

  const updateDestination = (id: string, value: string) => {
    setDestinations(
      destinations.map((dest) =>
        dest.id === id ? { ...dest, name: value } : dest
      )
    );
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedOption) {
      newErrors.service = "Please select a service type";
    }

    const hasValidDestination = destinations.some(
      (dest) => dest.name.trim() !== ""
    );
    if (!hasValidDestination) {
      newErrors.destinations = "At least one destination must be specified";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const validDestinations = destinations.filter(
        (dest) => dest.name.trim() !== ""
      );
      console.log("Form submitted:", {
        service: selectedOption,
        destinations: validDestinations,
      });
      alert("Form submitted successfully!");
      setIsModalOpen(false);
      // Reset form
      setSelectedOption("");
      setDestinations([{ id: "1", name: "" }]);
      setErrors({});
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const selectedService = serviceOptions.find(
    (opt) => opt.value === selectedOption
  );

  return (
    <>
      {" "}
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/50 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Simulate the Route</h2>
                <p className="text-blue-100">Plan the perfect route</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-3">
                 
                  <div className="relative">
                    <select
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-slate-700 font-medium transition-all duration-200 appearance-none cursor-pointer hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none ${
                        errors.service ? "border-red-300" : "border-slate-200"
                      }`}
                    >
                      <option value="">Choose Starting Airport</option>
                      {airports.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>

                    {selectedService && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <selectedService.icon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  {errors.service && (
                    <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Destinations Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                      Destinations *{" "}
                      <span className="text-slate-500 font-normal">
                        (At least one required)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={addDestination}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Destination
                    </button>
                  </div>

                  {errors.destinations && (
                    <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.destinations}
                    </p>
                  )}

                  <div className="space-y-3">
                    {destinations.map((destination, index) => (
                      <div
                        key={destination.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">
                              {index + 1}.
                            </span>
                          </div>

                          <select
                            value={destination.name}
                            onChange={(e) =>
                              updateDestination(destination.id, e.target.value)
                            }
                            className={`flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-slate-300 ${
                              errors.service
                                ? "border-red-300"
                                : "border-slate-200"
                            }`}
                          >
                            <option value="">Choose Airport</option>
                            {airports.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>

                          {destinations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDestination(destination.id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-slate-100 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:ring-4 focus:ring-blue-100 focus:outline-none"
                  >
                    Submit Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Form;
