import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import envConfig from "../../../envConfig";

const SystemReports = () => {
  const [officeLocations, setOfficeLocations] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [genders, setGenders] = useState([
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedOffices, setSelectedOffices] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [expandedDoctors, setExpandedDoctors] = useState({});

  const [sortOption, setSortOption] = useState("");

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: envConfig.apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          officeLocationsRes,
          specialtiesRes,
          statesRes,
          citiesRes,
          doctorsRes,
        ] = await Promise.all([
          axiosInstance.get("/auth/admin/adminDoctorReport/getOfficeLocations"),
          axiosInstance.get("/auth/admin/adminDoctorReport/getSpecialties"),
          axiosInstance.get("/auth/admin/adminDoctorReport/getStates"),
          axiosInstance.get("/auth/admin/adminDoctorReport/getCities"),
          axiosInstance.get("/auth/admin/adminDoctorReport/getDoctors"),
        ]);

        setOfficeLocations(officeLocationsRes.data);
        setSpecialties(specialtiesRes.data);
        setStates(statesRes.data);
        setCities(citiesRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [axiosInstance]);

  const handleGenerateReport = async () => {
    try {
      const params = new URLSearchParams();

      selectedOffices.forEach((office) =>
        params.append("officeID", office.value)
      );
      selectedSpecialties.forEach((specialty) =>
        params.append("specialtyID", specialty.value)
      );
      selectedGenders.forEach((gender) =>
        params.append("gender", gender.value)
      );
      selectedStates.forEach((state) => params.append("state", state.value));
      selectedCities.forEach((city) => params.append("city", city.value));
      selectedDoctors.forEach((doctor) =>
        params.append("doctorID", doctor.value)
      );
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axiosInstance.get(
        `/auth/admin/adminDoctorReport/generateDoctorReport`,
        { params }
      );

      setReportData(response.data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const toggleDoctorDetails = (doctorID) => {
    setExpandedDoctors((prev) => ({
      ...prev,
      [doctorID]: !prev[doctorID],
    }));
  };

  const formatDateTime = (dateTime) =>
    new Date(dateTime).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  const formatAddress = (doctor) => {
    const { addrStreet, addrcity, addrstate, addrzip } = doctor;
    let addressParts = [];
    if (addrStreet) addressParts.push(addrStreet);
    if (addrcity) addressParts.push(addrcity);
    if (addrstate) addressParts.push(addrstate);
    if (addrzip) addressParts.push(addrzip);
    return addressParts.join(", ");
  };

  const sortedReportData = useMemo(() => {
    if (!sortOption) return reportData;

    const sortedData = [...reportData];
    sortedData.sort((a, b) => {
      switch (sortOption) {
        case "prescriptionCount":
          return b.prescriptions.length - a.prescriptions.length;
        case "scheduledAppointments":
          return (
            b.appointments.filter((a) => a.status === "Scheduled").length -
            a.appointments.filter((a) => a.status === "Scheduled").length
          );
        case "requestedAppointments":
          return (
            b.appointments.filter((a) => a.status === "Requested").length -
            a.appointments.filter((a) => a.status === "Requested").length
          );
        case "completedAppointments":
          return (
            b.appointments.filter((a) => a.status === "Completed").length -
            a.appointments.filter((a) => a.status === "Completed").length
          );
        default:
          return 0;
      }
    });

    return sortedData;
  }, [reportData, sortOption]);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <div className="flex items-center justify-center">
          <span className="ml-2 text-2xl font-bold text-gray-900">
            Doctor Appointment Data
          </span>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Doctor Report
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Office Locations
              </label>
              <Select
                isMulti
                options={officeLocations.map((office) => ({
                  value: office.officeID,
                  label: office.officeName,
                }))}
                value={selectedOffices}
                onChange={setSelectedOffices}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specialties
              </label>
              <Select
                isMulti
                options={specialties.map((specialty) => ({
                  value: specialty.specialtyID,
                  label: specialty.specialtyName,
                }))}
                value={selectedSpecialties}
                onChange={setSelectedSpecialties}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Genders
              </label>
              <Select
                isMulti
                options={genders}
                value={selectedGenders}
                onChange={setSelectedGenders}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                States
              </label>
              <Select
                isMulti
                options={states}
                value={selectedStates}
                onChange={setSelectedStates}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cities
              </label>
              <Select
                isMulti
                options={cities}
                value={selectedCities}
                onChange={setSelectedCities}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Doctors
              </label>
              <Select
                isMulti
                options={doctors} // Use the fetched data directly
                value={selectedDoctors}
                onChange={setSelectedDoctors}
                placeholder="Select Doctors..."
              />
            </div>
            {/* Date Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* **New Sorting Component** */}
          {reportData.length > 0 && (
            <div className="flex justify-end items-center">
              <label
                htmlFor="sort"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                Sort By:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
              >
                <option value="">None</option>
                <option value="prescriptionCount">Prescription Count</option>
                <option value="scheduledAppointments">
                  Scheduled Appointments
                </option>
                <option value="requestedAppointments">
                  Requested Appointments
                </option>
                <option value="completedAppointments">
                  Completed Appointments
                </option>
              </select>
            </div>
          )}

          <button
            onClick={handleGenerateReport}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
          >
            Generate Report
          </button>

          {/* Aggregate Data Display */}
          {reportData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Aggregate Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Total Prescriptions
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalPrescriptions}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Scheduled Appointments
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentStatusCounts.Scheduled || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Requested Appointments
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentStatusCounts.Requested || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Completed Appointments
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentStatusCounts.Completed || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Report Data Display */}
          {reportData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h2 className="text-2xl font-bold mb-4">Report Results</h2>
              {sortedReportData.map((doctor) => {
                const appointmentCounts = [
                  "Scheduled",
                  "Requested",
                  "Completed",
                ].reduce((acc, status) => {
                  acc[status] = doctor.appointments.filter(
                    (a) => a.status === status
                  ).length;
                  return acc;
                }, {});

                return (
                  <div
                    key={doctor.doctorID}
                    className="border rounded-lg shadow-md p-4 mb-4 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Specialty:{" "}
                          <span className="font-medium">
                            {doctor.specialtyName || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender:{" "}
                          <span className="font-medium">
                            {doctor.gender || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Office:{" "}
                          <span className="font-medium">
                            {doctor.officeName || "Unknown Office"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Address:{" "}
                          <span className="font-medium">
                            {formatAddress(doctor) || "Unknown Address"}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleDoctorDetails(doctor.doctorID)}
                        className="text-pink-600 hover:text-pink-800 flex items-center"
                      >
                        {expandedDoctors[doctor.doctorID]
                          ? "Hide Details"
                          : "Show Details"}
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Prescriptions:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {doctor.prescriptions.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Scheduled Appointments:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Scheduled || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Requested Appointments:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Requested || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Completed Appointments:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Completed || 0}
                        </p>
                      </div>
                    </div>
                    {expandedDoctors[doctor.doctorID] && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        {/* Appointment Details */}
                        {["Scheduled", "Requested", "Completed"].map(
                          (status) => {
                            const filteredAppointments =
                              doctor.appointments.filter(
                                (appointment) => appointment.status === status
                              );

                            return (
                              filteredAppointments.length > 0 && (
                                <div key={status} className="mb-4">
                                  <h4 className="font-semibold text-lg">
                                    {status} Appointments:
                                  </h4>
                                  <ul className="list-disc list-inside">
                                    {filteredAppointments.map((appointment) => (
                                      <li key={appointment.appointmentID}>
                                        {formatDateTime(
                                          appointment.appointmentDateTime
                                        )}{" "}
                                        - {appointment.reason} (
                                        {appointment.patientFirstName}{" "}
                                        {appointment.patientLastName})
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            );
                          }
                        )}
                        {/* Prescription Details */}
                        <div>
                          <h4 className="font-semibold text-lg">
                            Prescriptions:
                          </h4>
                          <ul className="list-disc list-inside">
                            {doctor.prescriptions.map((prescription) => (
                              <li key={prescription.prescriptionID}>
                                {formatDateTime(prescription.dateIssued)} -{" "}
                                {prescription.medicationName},{" "}
                                {prescription.dosage} mg (
                                {prescription.patientFirstName}{" "}
                                {prescription.patientLastName})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SystemReports;
