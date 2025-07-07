import React, { useState, useEffect } from "react";
import axios from "axios";

const PAGE_LIMIT = 5;

function Client() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, isClientShow] = useState(false);
  const [clients, setClients] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const [clientForm, setClientForm] = useState([
    {
      _id: 1,
      clientName: "",
      clientEmail: "",
      contactNumber: "",
      Role: "",
    },
  ]);

  const handleAddClient = () => {
    setClientForm([
      ...clientForm,
      {
        _id: clientForm.length + 1,
        clientName: "",
        clientEmail: "",
        contactNumber: "",
        Role: "",
      },
    ]);
  };

  const handleRemoveClient = (idToRemove) => {
    if (clientForm.length > 1) {
      // Only remove if there's more than one language
      setClientForm(clientForm.filter((c) => c._id !== idToRemove));
    }
  };

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
    companyName: "",
    clientName: "",
    clientEmail: "",
    contactNumber: "",
    Role: "",
    // contactName: "",
    // contactEmail: "",
    // location: "",
    // employmentType: [],
    // workMode: [],
    // minCTC: "",
    // maxCTC: "",
    // noticePeriod: "",
    // language: "",
    // proficiency: "",
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
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const token = localStorage.getItem("crm_token");
  //   try {
  //     if (editMode) {
  //       // Update existing record
  //       await axios.put(
  //         `https://verbiq-crm.onrender.com/api/updateClient/${editingId}`,
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //     } else {
  //       // Create new record
  //       await axios.post(
  //         "https://verbiq-crm.onrender.com/api/createClient",
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //     }

  //     // Reset form and edit mode
  //     setFormData({
  //       companyName:"",
  //       clientName: "",
  //       clientEmail: "",
  //       // contactName: "",
  //       // contactEmail: "",
  //       contactNumber: "",
  //       Role: "",
  //       // location: "",
  //       // employmentType: [],
  //       // workMode: [],
  //       // minCTC: "",
  //       // maxCTC: "",
  //       // noticePeriod: "",
  //       // language: "",
  //       // proficiency: "",
  //     });
  //     setEditMode(false);
  //     setEditingId(null);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // ...existing code...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("crm_token");
    try {
      // Make sure to send all required fields
      const response = await axios.post(
        "https://verbiq-crm.onrender.com/api/createClient",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Reset form after successful creation
      setFormData({
        companyName: "",
        clientName: "",
        clientEmail: "",
        contactNumber: "",
        Role: "",
      });
      if (
        !formData.companyName ||
        !formData.clientName ||
        !formData.clientEmail ||
        !formData.contactNumber ||
        !formData.Role
      ) {
        setError("All fields are required.");
        setIsLoading(false);
        return;
      }
      // Optionally, refresh client list
      fetchData();
      console.log(response.data);
    } catch (error) {
      console.log(formData);
      console.error("Error creating client:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // ...existing code...
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

  // const handleEditClick = (clients) => {
  //   setFormData({
  //     clientName: clients.clientName,
  //     clientEmail: clients.clientEmail,
  //     contactName: clients.contactNumber,
  //     contactEmail: clients.contactEmail,
  //     contactNumber: clients.contactNumber,
  //     jobTitle: clients.jobTitle,
  //     location: clients.location,
  //     employmentType: clients.employmentType || [],
  //     workMode: clients.workMode || [],
  //     minCTC: clients.minCTC,
  //     maxCTC: clients.maxCTC,
  //     noticePeriod: clients.noticePeriod,
  //     language: clients.language,
  //     proficiency: clients.proficiency,
  //   });
  //   setEditClient(clients._id);
  //   setShowEditModal(true);
  // };

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
      {!isClient && (
        <>
          <div className={`${showEditModal ? " hidden" : "blur-none"}`}>
            <div
              className={`border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm `}
            >
              <h2 className="mb-4 text-center text-base font-medium">
                Add Client and Job Information
              </h2>
              <button
                onClick={() => isClientShow(true)}
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
                    <table className="min-w-[1300px] border-collapse table-auto ">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 min-w-[1300px]">
                          <th className="py-3 px-2 font-semibold text-left">
                            S.No.
                          </th>

                          <th className="py-3 px-2 font-semibold text-left">
                            Company Name
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Client Name
                          </th>

                          <th className="py-3 px-2 font-semibold text-left">
                            Number
                          </th>

                          <th className="py-3 px-2 font-semibold text-left">
                            Email
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Role
                          </th>
                          {/* <th className="py-3 px-2 font-semibold text-left">
                            CPD Number
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Job Title
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Location
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Employment Type
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Work Mode
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Minimum CTC
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Maximum CTC
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Notice period allowed
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Language Required
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Proficiency required
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Edit
                          </th> */}
                          <th className="py-3 px-2 font-semibold text-left">
                            View
                          </th>
                        </tr>
                      </thead>
                      {Array.isArray(clients) && clients.length > 0 ? (
                        clients.map((client, index) => (
                          <tbody>
                            <tr
                              key={index}
                              className={
                                "border border-gray-200 hover:bg-gray-50 transition-all"
                              }
                            >
                              <td className="py-2 px-2">
                                {(page - 1) * PAGE_LIMIT + index + 1}
                              </td>
                              <td className="py-2 px-2">
                                {client.companyName}
                              </td>
                              <td>{client.clientEmail}</td>
                              <td className="py-2 px-2">{client.clientName}</td>
                              <td>{client.clientEmail}</td>

                              <td className="py-2 px-2">
                                {client.contactNumber}
                              </td>
                              <td className="py-2 px-2">{client.Role}</td>

                              {/* <td className="py-2 px-2">
                                {client.contactNumber}
                              </td> */}
                              {/* <td className="py-2 px-2">{client.jobTitle}</td>
                              <td className="py-2 px-2">{client.location}</td>
                              <td className="py-2 px-2">
                                {client.employmentType}
                              </td>
                              <td className="py-2 px-2">{client.workMode}</td>
                              <td className="py-2 px-2">{client.minCTC}</td>
                              <td className="py-2 px-2">{client.maxCTC}</td>
                              <td className="py-2 px-2">
                                {client.noticePeriod}
                              </td>
                              <td className="py-2 px-2">{client.language}</td>
                              <td className="py-2 px-2">
                                {client.proficiency}
                              </td> */}
                              {/* <td>
                                <button
                                  onClick={() => handleEditClick(client)}
                                  className="p-4 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                                  title="Edit Candidate"
                                >
                                  <EditIcon />
                                </button>
                              </td> */}
                              <td>
                                <button
                                  onClick={() => handleDelete(client._id)}
                                  className="p-4 rounded-full bg-red-50 hover:bg-red-100 transition ml-2"
                                  title="Delete Client"
                                >
                                  <DeleteIcon />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        ))
                      ) : (
                        <div>No clients found</div>
                      )}
                    </table>

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

      {isClient && (
        <>
          <div className="border w-max px-24 py-3">
            <form onSubmit={handleSubmit}>
              <label className="block mb-1">Company Name</label>
              <input
                type="text"
                onChange={handleChange}
                name="companyName"
                value={formData.companyName}
                className="w-1/2 border border-gray-300  rounded px-2 py-1"
              />
              {clientForm.map((c) => (
                <div
                  key={c._id}
                  className="grid grid-cols-1 md:grid-cols-7 gap-4 py-5"
                >
                  <div>
                    <label className="block mb-1">Client Name</label>
                    <input
                      id={`clientName-${c._id}`}
                      name="clientName"
                      type="text"
                      // required
                      className={`"w-full border border-gray-300  rounded px-2 py-4"`}
                      value={formData.clientName}
                      // onChange={(e) => {
                      //   const updatedLanguages = clientForm.map((d) => {
                      //     if (d._id === c._id) {
                      //       return { ...d, clientName: e.target.value };
                      //     }
                      //     return d;
                      //   });
                      //   setClientForm(updatedLanguages);
                      // }}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      id={`clientEmail-${c._id}`}
                      name="clientEmail"
                      type="email"
                      // required
                      className={`"w-full border border-gray-300  rounded px-2 py-4"`}
                      value={formData.clientEmail}
                      // onChange={(e) => {
                      //   const updatedLanguages = clientForm.map((d) => {
                      //     if (d._id === c._id) {
                      //       return { ...d, clientEmail: e.target.value };
                      //     }
                      //     return d;
                      //   });
                      //   setClientForm(updatedLanguages);
                      // }}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Number</label>
                    <input
                      id={`number-${c._id}`}
                      name="contactNumber"
                      type="text"
                      // required
                      className={`"w-full border border-gray-300 rounded px-2 py-4"`}
                      value={formData.contactNumber}
                      // onChange={(e) => {
                      //   const updatedLanguages = clientForm.map((d) => {
                      //     if (d._id === c._id) {
                      //       return { ...d, contactNumber: e.target.value };
                      //     }
                      //     return d;
                      //   });
                      //   setClientForm(updatedLanguages);
                      // }}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Role</label>
                    <input
                      id={`Role-${c._id}`}
                      name="Role"
                      type="text"
                      // required
                      className={`"w-full border border-gray-300  rounded px-2 py-4"`}
                      value={formData.Role}
                      // onChange={(e) => {
                      //   const updatedLanguages = clientForm.map((d) => {
                      //     if (d._id === c._id) {
                      //       return { ...d, Role: e.target.value };
                      //     }
                      //     return d;
                      //   });
                      //   setClientForm(updatedLanguages);
                      // }}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center">
                    <>
                      <button
                        type="button"
                        onClick={handleAddClient}
                        className="ml-6 p-2 text-white rounded-md bg-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveClient(c._id);
                        }}
                        className="ml-2 p-2 text-white rounded-md bg-[#B0181B]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                        >
                          <line
                            x1="5"
                            y1="12"
                            x2="20"
                            y2="12"
                            stroke="white"
                            strokeWidth="3"
                          />
                        </svg>
                      </button>
                    </>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className={`" text-sm font-medium rounded-md text-white 
                ${
                  isLoading
                    ? "bg-[#46EB19] cursor-not-allowed w-40 py-2 px-4"
                    : "bg-[#46EB19] hover:bg-green-500 w-40 py-2 px-4"
                }"`}
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Client;
