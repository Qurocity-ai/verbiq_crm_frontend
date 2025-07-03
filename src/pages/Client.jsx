import React, { useState, useEffect } from "react";
import axios from "axios";

const PAGE_LIMIT = 5;

function Client() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const EditIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="text-blue-600"
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.004 1.004 0 000-1.42l-2.34-2.34a1.004 1.004 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
    </svg>
  );
  const DeleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="text-red-600"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    contactName: "",
    contactEmail: "",
    contactNumber: "",
    jobTitle: "",
    location: "",
    employmentType: [],
    workMode: [],
    minCTC: "",
    maxCTC: "",
    noticePeriod: "",
    language: "",
    proficiency: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClient, setTotalClient] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "employmentType" || name === "workMode") {
      const array = value.split(",").map((item) => item.trim());
      setFormData((prev) => ({
        ...prev,
        [name]: array,
      }));
    } else if (name === "minCTC" || name === "maxCTC") {
      // Handle number inputs
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("crm_token");
    try {
      if (editMode) {
        // Update existing record
        await axios.put(
          `https://verbiq-crm.onrender.com/api/updateClient/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new record
        await axios.post(
          "https://verbiq-crm.onrender.com/api/createClient",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Reset form and edit mode
      setFormData({
        clientName: "",
        clientEmail: "",
        contactName: "",
        contactEmail: "",
        contactNumber: "",
        jobTitle: "",
        location: "",
        employmentType: [],
        workMode: [],
        minCTC: "",
        maxCTC: "",
        noticePeriod: "",
        language: "",
        proficiency: "",
      });
      setEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("crm_token");

      const response = await axios.get(
        `https://verbiq-crm.onrender.com/api/getClient?page=${page}&limit=${PAGE_LIMIT}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setClients(response.data.clients);
      console.log("API Response:", response); // Check the full response
      console.log("Client Data:", response.data);
      console.log(clients);
      const data = await response.data;
      setTotalPages(data.totalPages || 1);
      setTotalClient(
        data.totalClient || (data.clients ? data.clients.length : 0)
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error details:", error.response);
      setError(error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    console.log(clients);
  }, [page]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const deleteClient = async (clientId) => {
    const token = localStorage.getItem("crm_token");
    try {
      await axios.delete(
        `https://verbiq-crm.onrender.com/api/deletedClient/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleEditClick = (clients) => {
    setFormData({
      clientName: clients.clientName,
      clientEmail: clients.clientEmail,
      contactName: clients.contactNumber,
      contactEmail: clients.contactEmail,
      contactNumber: clients.contactNumber,
      jobTitle: clients.jobTitle,
      location: clients.location,
      employmentType: clients.employmentType || [],
      workMode: clients.workMode || [],
      minCTC: clients.minCTC,
      maxCTC: clients.maxCTC,
      noticePeriod: clients.noticePeriod,
      language: clients.language,
      proficiency: clients.proficiency,
    });
    setEditClient(clients._id);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("crm_token");
    try {
      await axios.put(
        `https://verbiq-crm.onrender.com/api/updateClient/${editClient}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ fullname: "", email: "", password: "", number: "" });
      setEditClient(null);
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      alert("Error updating recruiter", error.message);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      await deleteClient(id);
    }
  };
  return (
    <div
      className={`sm:fixed flex flex-col items-start min-h-screen p-6 bg-white `}
    >
      {/* Left-aligned small box */}
      {!showForm && (
        <>
          <div className={`${showEditModal ? " hidden" : "blur-none"}`}>
            <div
              className={`border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm `}
            >
              <h2 className="mb-4 text-center text-base font-medium">
                Add Client and Job Information
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-400 hover:bg-green-500 text-black font-medium py-2 px-6 rounded block mx-auto"
              >
                Create
              </button>
            </div>
            <div>
              {isLoading ? (
                <div className="text-center mt-4">Loading...</div>
              ) : (
                <div className="mb-4 bg-white rounded-lg shadow-md mt-20 flex items-center overflow-x-scroll w-screen pr-72">
                  {/* Scrollable Content */}
                  <div className="flex-growt">
                    <div className="flex p-4 min-w-max ">
                      {" "}
                      {/* min-w-max ensures content pushes div wider than parent */}
                      <div className="flex-shrink-0 w-16 text-gray-600 font-medium">
                        S.no
                      </div>
                      <div className="flex-shrink-0 w-48 text-gray-600 font-medium ">
                        Client Name
                      </div>
                      <div className="flex-shrink-0 w-64 text-gray-600 font-medium">
                        Email
                      </div>
                      <div className="flex-shrink-0 w-32 text-gray-600 font-medium">
                        CPD Name
                      </div>
                      <div className="flex-shrink-0 w-64 text-gray-600 font-medium">
                        CPD Email
                      </div>
                      <div className="flex-shrink-0 w-40 text-gray-600 font-medium">
                        CPD Number
                      </div>
                      <div className="flex-shrink-0 w-40 text-gray-600 font-medium">
                        Job Title
                      </div>
                      <div className="flex-shrink-0 w-32 text-gray-600 font-medium">
                        Location
                      </div>
                      <div className="flex-shrink-0 w-40 text-gray-600 font-medium">
                        Employment Type
                      </div>
                      <div className="flex-shrink-0 w-32 text-gray-600 font-medium">
                        Work Mode
                      </div>
                      <div className="flex-shrink-0 w-32 text-gray-600 font-medium">
                        Minimum CTC
                      </div>
                      <div className="flex-shrink-0 w-32 text-gray-600 font-medium">
                        Maximum CTC
                      </div>
                      <div className="flex-shrink-0 w-48 text-gray-600 font-medium">
                        Notice period allowed
                      </div>
                      <div className="flex-shrink-0 w-40 text-gray-600 font-medium">
                        Language Required
                      </div>
                      <div className="flex-shrink-0 w-40 text-gray-600 font-medium">
                        Proficiency required
                      </div>
                    </div>
                    {Array.isArray(clients) && clients.length > 0 ? (
                      clients.map((client, index) => (
                        <div
                          className="flex p-4 min-w-max border-t border-gray-200"
                          key={index}
                        >
                          <>
                            <div className="flex-shrink-0 w-16">
                              {index + 1}
                            </div>
                            <div className="flex-shrink-0 w-48">
                              {client.clientName}
                            </div>
                            <div className="flex-shrink-0 w-64 truncate">
                              {client.clientEmail}
                            </div>
                            <div className="flex-shrink-0 w-32">
                              {client.contactName}
                            </div>
                            <div className="flex-shrink-0 w-64 truncate">
                              {client.contactEmail}
                            </div>
                            <div className="flex-shrink-0 w-40">
                              {client.contactNumber}
                            </div>
                            <div className="flex-shrink-0 w-40">
                              {client.jobTitle}
                            </div>
                            <div className="flex-shrink-0 w-32">
                              {client.location}
                            </div>
                            <div className="flex-shrink-0 w-40">
                              {client.employmentType}
                            </div>
                            <div className="flex-shrink-0 w-32">
                              {client.workMode}
                            </div>
                            <div className="flex-shrink-0 w-32">
                              {client.minCTC}
                            </div>
                            <div className="flex-shrink-0 w-32">
                              {client.maxCTC}
                            </div>
                            <div className="flex-shrink-0 w-48">
                              {client.noticePeriod}
                            </div>
                            <div className="flex-shrink-0 w-40">
                              {client.language}
                            </div>
                            <div className="flex-shrink-0 w-40">
                              {client.proficiency}
                            </div>
                            <div className="  border-l  border-gray-200 bg-white">
                              <button
                                onClick={() => handleEditClick(client)}
                                className="p-4 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                                title="Edit Candidate"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDelete(client._id)}
                                className="p-4 rounded-full bg-red-50 hover:bg-red-100 transition ml-2"
                                title="Delete Client"
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </>
                        </div>
                      ))
                    ) : (
                      <div>No clients found</div>
                    )}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-6 py-6">
                        <button
                          onClick={handlePrevPage}
                          disabled={page === 1}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                            page === 1
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          ← Prev
                        </button>

                        <span className="text-sm md:text-base font-semibold text-gray-700">
                          Page <span className="text-blue-600">{page}</span> of{" "}
                          <span className="text-blue-600">{totalPages}</span>
                          <span className="ml-4 text-gray-600">
                            Total: <strong>{totalClient}</strong> candidates
                          </span>
                        </span>

                        <button
                          onClick={handleNextPage}
                          disabled={page === totalPages}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                            page === totalPages
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Fixed Action Buttons */}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Form Section */}
      {showEditModal && (
        <div className="border border-gray-300 rounded-lg p-6 mt-4 mx-auto w-full max-w-7xl shadow-sm z-[9999] bg-white ">
          <form
            className="grid grid-cols-3 gap-x-8 gap-y-2"
            onSubmit={handleSubmit}
          >
            {/* Row 1 */}
            <div>
              <label className="block mb-1">Client Name</label>
              <input
                type="text"
                onChange={handleChange}
                name="clientName"
                value={formData.clientName}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                onChange={handleChange}
                name="clientEmail"
                value={formData.clientEmail}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>

            {/* Contact Person Details */}
            <div className="col-span-3 mt-4 font-medium">
              Contact Person details
            </div>
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                onChange={handleChange}
                name="contactName"
                value={formData.contactName}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                onChange={handleChange}
                name="contactEmail"
                value={formData.contactEmail}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Number</label>
              <input
                type="number"
                onChange={handleChange}
                name="contactNumber"
                value={formData.contactNumber}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>

            {/* Job Info */}
            <div>
              <label className="block mb-1">Job Title</label>
              <input
                type="text"
                onChange={handleChange}
                name="jobTitle"
                value={formData.jobTitle}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                onChange={handleChange}
                name="location"
                value={formData.location}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Employment Type</label>
              <select
                className="w-full border border-gray-300  rounded px-2 py-1"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option>Full Time</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Work Mode</label>
              <select
                className="w-full border border-gray-300  rounded px-2 py-1"
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
              >
                <option>On site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Salary */}
            <div className="col-span-3 mt-4 font-medium">Salary range</div>
            <div>
              <label className="block mb-1">Minimum CTC</label>
              <input
                type="text"
                onChange={handleChange}
                name="minCTC"
                value={formData.minCTC}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Maximum CTC</label>
              <input
                type="text"
                onChange={handleChange}
                name="maxCTC"
                value={formData.maxCTC}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            {/* Section Title */}
            <div className="col-span-3 mt-4 font-medium"></div>
            {/* Other */}
            <div>
              <label className="block mb-1">Notice period allowed</label>
              <input
                type="text"
                onChange={handleChange}
                name="noticePeriod"
                value={formData.noticePeriod}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Language Required</label>
              <input
                type="text"
                onChange={handleChange}
                name="language"
                value={formData.language}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Proficiency required</label>
              <input
                type="text"
                onChange={handleChange}
                name="proficiency"
                value={formData.proficiency}
                className="w-full border border-gray-300  rounded px-2 py-1"
              />
            </div>

            {/* Submit */}
            <div className="col-span-3 mt-4">
              {/* <button
                type="submit"
                className="bg-[#46EB19] hover:bg-[#8bd178] text-white px-6 py-2 rounded"
              >
                Submit
              </button> */}
              <button
                type="submit"
                className={`" text-sm font-medium rounded-md text-white 
                ${
                  isLoading
                    ? "bg-[#46EB19] cursor-not-allowed w-40 py-2 px-4"
                    : "bg-[#46EB19] hover:bg-green-500 w-40 py-2 px-4"
                }"`}
                onClick={handleUpdate}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                ) : showEditModal ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </button>
              {showEditModal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditClient(null);
                    setFormData({
                      clientName: "",
                      clientEmail: "",
                      // ... reset other fields
                    });
                  }}
                  className="ml-2 bg-gray-500 hover:bg-gray-600 text-white w-40 py-2 px-4 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      {showForm && (
        <>
          <div className="border border-gray-300 rounded-lg p-6 mt-4 w-full max-w-7xl shadow-sm">
            <form
              className="grid grid-cols-3 gap-x-8 gap-y-2"
              onSubmit={handleSubmit}
            >
              {/* Row 1 */}
              <div>
                <label className="block mb-1">Client Name</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="clientName"
                  value={formData.clientName}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  onChange={handleChange}
                  name="clientEmail"
                  value={formData.clientEmail}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>

              {/* Contact Person Details */}
              <div className="col-span-3 mt-4 font-medium">
                Contact Person details
              </div>
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="contactName"
                  value={formData.contactName}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  onChange={handleChange}
                  name="contactEmail"
                  value={formData.contactEmail}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Number</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="contactNumber"
                  value={formData.contactNumber}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>

              {/* Job Info */}
              <div>
                <label className="block mb-1">Job Title</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="jobTitle"
                  value={formData.jobTitle}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Location</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="location"
                  value={formData.location}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Employment Type</label>
                <select
                  className="w-full border border-gray-300  rounded px-2 py-1"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <option>Full Time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Work Mode</label>
                <select
                  className="w-full border border-gray-300  rounded px-2 py-1"
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                >
                  <option>On site</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>

              {/* Salary */}
              <div className="col-span-3 mt-4 font-medium">Salary range</div>
              <div>
                <label className="block mb-1">Minimum CTC</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="minCTC"
                  value={formData.minCTC}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Maximum CTC</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="maxCTC"
                  value={formData.maxCTC}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              {/* Section Title */}
              <div className="col-span-3 mt-4 font-medium"></div>
              {/* Other */}
              <div>
                <label className="block mb-1">Notice period allowed</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Language Required</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="language"
                  value={formData.language}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Proficiency required</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="proficiency"
                  value={formData.proficiency}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>

              {/* Submit */}
              <div className="col-span-3 mt-4">
                {/* <button
                type="submit"
                className="bg-[#46EB19] hover:bg-[#8bd178] text-white px-6 py-2 rounded"
              >
                Submit
              </button> */}
                <button
                  type="submit"
                  className={`" text-sm font-medium rounded-md text-white 
                ${
                  isLoading
                    ? "bg-[#46EB19] cursor-not-allowed w-40 py-2 px-4"
                    : "bg-[#46EB19] hover:bg-green-500 w-40 py-2 px-4"
                }"`}
                  onClick={handleUpdate}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  ) : showEditModal ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </button>
                {showEditModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditClient(null);
                      setFormData({
                        clientName: "",
                        clientEmail: "",
                        // ... reset other fields
                      });
                    }}
                    className="ml-2 bg-gray-500 hover:bg-gray-600 text-white w-40 py-2 px-4 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Client;
