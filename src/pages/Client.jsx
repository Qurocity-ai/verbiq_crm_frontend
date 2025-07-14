import React, { useState, useEffect } from "react";
import axios from "axios";

const PAGE_LIMIT = 5;

function Client() {
  const [showForm, setShowForm] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, isClientShow] = useState(false);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [openedCompany, setOpenedCompany] = useState(null);
  const [clientsByCompany, setClientsByCompany] = useState({});
  const [openedJob, setOpenedJob] = useState(null);
  const [jobByClient, setJobByClient] = useState({});
  const [groupedClient, setGroupedClient] = useState([]);
  const [editClient, setEditClient] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [filters, setFilters] = useState({
    clientName: "",
  });

  const [formData, setFormData] = useState({
    clientName: "", // Assuming this will be a string ID from a selection or input
    headCount: "",
    processName: "",
    POCcontactNumber: "",
    POCname: "",
    vendorPayout: "",
    empEngType: "",
    role: "",
    location: "",
    language: "",
    profencency: "",
    CTCoffer: "",
    experience: "",
    interviewType: "",
    noticePeriod: "",
    relocationAllow: false,
    interviewProcess: "",
    RFQstatus: "",
    extraNotes: "",
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("crm_token");
    try {
      const response = await axios.post(
        "https://verbiq-crm.onrender.com/api/createJob",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Entry created successfully!");
        // Optionally, reset the form
        setFormData({
          clientName: "",
          headCount: "",
          processName: "",
          POCcontactNumber: "",
          POCname: "",
          vendorPayout: "",
          empEngType: "",
          role: "",
          location: "",
          language: "",
          profencency: "",
          experience: "",
          interviewType: "",
          noticePeriod: "",
          relocationAllow: false,
          interviewProcess: "",
          RFQstatus: "",
          extraNotes: "",
        });
      } else {
        const errorData = await response.json();
        alert(
          `Failed to create entry: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleAddClient = () => {
    setclientData([
      ...clientData,
      {
        clientName: "",
        clientEmail: "",
        contactNumber: "",
        Role: "",
      },
    ]);
  };
  const handleRemoveClient = (idx) => {
    if (clientData.length > 1) {
      // Only remove if there's more than one language
      setclientData(clientData.filter((_, i) => i !== idx));
    }
  };

  const handleCompanyChange = (e) => setCompanyName(e.target.value);

  async function fetchClientsByCompany(companyName) {
    const resp = await fetch(
      "https://verbiq-crm.onrender.com/api/filterClientByCompanyName",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: [companyName] }),
      }
    );
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    console.log("filterClientByCompanyName", data);
    setClients(data.data);
    setShowJobs(true);
    return data.data; // array of clients
  }

  const handleView = async (companyName) => {
    if (clientsByCompany[companyName]) {
      // Toggle close if already loaded
      setOpenedCompany(openedCompany === companyName ? null : companyName);
      return;
    }
    try {
      const clients = await fetchClientsByCompany(companyName);
      setClientsByCompany((prev) => ({ ...prev, [companyName]: clients }));
      setOpenedCompany(companyName);
    } catch (err) {
      console.error(err);
      alert("Error loading clients: " + err.message);
    }
  };
  async function fetchJobByClientName(clientName) {
    const resp = await fetch(
      "https://verbiq-crm.onrender.com/api/filterJobByClientName",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: [clientName] }),
      }
    );
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    console.log("filterJobByClientName", data);
    setJobs(data.data);
    setShowJobs(true);
    return data.data; // array of clients
  }

  const handleJobView = async (clientName) => {
    if (jobByClient[clientName]) {
      // Toggle close if already loaded
      setOpenedCompany(openedJob === clientName ? null : clientName);
      return;
    }
    try {
      const clients = await fetchJobByClientName(clientName);
      setJobByClient((prev) => ({ ...prev, [clientName]: clients }));
      setOpenedJob(clientName);
    } catch (err) {
      console.error(err);
      alert("Error loading clients: " + err.message);
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

  const [clientData, setclientData] = useState([
    {
      clientName: "",
      clientEmail: "",
      contactNumber: "",
      Role: "",
    },
  ]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClient, setTotalClient] = useState(0);
  const [totalJob, setTotalJob] = useState(0);

  const handleChange = (idx, field, value) => {
    setclientData((forms) =>
      forms.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("crm_token");
    // Inject companyName into each client
    const payload = clients.map((c) => ({ ...c, companyName }));
    // Validate
    if (!companyName) return alert("Company is required");
    if (
      clients.some(
        (c) => !c.clientName || !c.clientEmail || !c.contactNumber || !c.Role
      )
    )
      return alert("All client fields are required");
    try {
      // Make sure to send all required fields
      const response = await axios.post(
        "https://verbiq-crm.onrender.com/api/createClient",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form after successful creation
      setclientData({
        clientName: "",
        clientEmail: "",
        contactNumber: "",
        Role: "",
      });

      if (
        clientData.some(
          (f) =>
            !f.clientName ||
            !f.clientEmail ||
            !f.contactNumber ||
            !f.Role ||
            !f.companyName
        )
      ) {
        alert("All fields are required");
        return;
      }
      // Optionally, refresh client list
      fetchData();
      console.log(response.data);
    } catch (error) {
      console.log(clientData);
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
      const grouped = response.data.clients.reduce((acc, client) => {
        const name = client.companyName;
        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push(client);
        return acc;
      }, {});
      console.log("Grouped data", grouped);

      setGroupedClient(grouped);
      setIsLoading(false);
    } catch (error) {
      console.error("Error details:", error.response);
      setError(error.message);
      setIsLoading(false);
    }
  };
  const fetchJobData = async () => {
    try {
      const token = localStorage.getItem("crm_token");

      const response = await axios.get(
        `https://verbiq-crm.onrender.com/api/getJob?page=${page}&limit=${PAGE_LIMIT}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setJobs(response.data.jobs);
      console.log("API Response:", response); // Check the full response
      console.log("Jobs Data:", response.data);
      console.log(jobs);
      const data = await response.data;
      setTotalPages(data.totalPages || 1);
      setTotalJob(data.totalJob || (data.jobs ? data.jobs.length : 0));
      setIsLoading(false);
    } catch (error) {
      console.error("Error details:", error.response);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleFilterInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchData();
    fetchJobData();
    console.log(jobs);
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

  const handleUpdate = async () => {
    const token = localStorage.getItem("crm_token");
    try {
      await axios.put(
        `https://verbiq-crm.onrender.com/api/updateClient/${editClient}`,
        clientData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setclientData({ fullname: "", email: "", password: "", number: "" });
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
      {!isClient && !showJobs && (
        <>
          <div className={`${showEditModal ? " hidden" : "blur-none"}`}>
            <div
              className={`border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm `}
            >
              <h2 className="mb-4 text-center text-base font-medium">
                Add Client
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

                          <th className="py-3 px-2 font-semibold text-left">
                            Delete
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            View
                          </th>
                        </tr>
                      </thead>
                      {Object.entries(groupedClient).map(
                        ([company, clients]) => (
                          <tbody key={company}>
                            <tr className="bg-gray-100">
                              <td></td>
                              <td colSpan={6} className="py-2 font-bold">
                                {company}
                              </td>
                              <td>
                                <button
                                  className="bg-green-500 px-4 py-2 rounded-full"
                                  onClick={() => handleView(company)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                            {clients.slice(0, 1).map((client, idx) => (
                              <tr key={idx} className="border hover:bg-gray-50">
                                <td className="px-2 py-1">
                                  {(page - 1) * PAGE_LIMIT + idx + 1}
                                </td>
                                <td>{client.companyName}</td>
                                <td>{client.clientName}</td>
                                <td>{client.contactNumber}</td>
                                <td>{client.clientEmail}</td>
                                <td>{client.Role}</td>
                                <td>
                                  <button
                                    onClick={() => handleDelete(client._id)}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )
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
              className="grid grid-cols-4 gap-x-8 gap-y-2"
              onSubmit={handleFormSubmit}
            >
              {/* Row 1 */}
              <div>
                <label className="block mb-1">Client Name</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="clientName"
                  value={formData.clientName}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Headcount</label>
                <input
                  type="number"
                  onChange={handleFormChange}
                  name="headCount"
                  value={formData.headCount}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Process Name</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="processName"
                  value={formData.processName}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">POC Name</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="POCname"
                  value={formData.POCname}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">POC Contact Number</label>
                <input
                  type="tel"
                  onChange={handleFormChange}
                  name="POCcontactNumber"
                  value={formData.POCcontactNumber}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Vendor payout</label>
                <input
                  type="number"
                  onChange={handleFormChange}
                  name="vendorPayout"
                  value={formData.vendorPayout}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Employee Engement Type</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="empEngType"
                  value={formData.empEngType}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Role Type</label>
                <select
                  className="w-full border border-gray-300  rounded px-2 py-1"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option>Full Time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Location of Hire</label>
                <input
                  type="text"
                  className="w-full border border-gray-300  rounded px-2 py-1"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                />
              </div>

              <div>
                <label className="block mb-1">Language</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="language"
                  value={formData.language}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Profeciency</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="profencency"
                  value={formData.profencency}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">CTC offered</label>
                <input
                  type="number"
                  onChange={handleFormChange}
                  name="CTCoffer"
                  value={formData.CTCoffer}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Experience</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="experience"
                  value={formData.experience}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Interview Type</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="interviewType"
                  value={formData.interviewType}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Notice Period Buyout</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Relocation Allownce</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="relocationAllow"
                  value={formData.relocationAllow}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Interview Process</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="interviewProcess"
                  value={formData.interviewProcess}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">RFQ status</label>
                <input
                  type="text"
                  onChange={handleFormChange}
                  name="RFQstatus"
                  value={formData.RFQstatus}
                  className="w-full border border-gray-300  rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Extra Notes</label>
                <textarea
                  type="text"
                  onChange={handleFormChange}
                  name="extraNotes"
                  value={formData.extraNotes}
                  className="w-sm border border-gray-300  rounded px-2 py-1"
                ></textarea>
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
                name="companyName"
                value={companyName}
                className="w-1/2 border border-gray-300  rounded px-2 py-1"
                onChange={handleCompanyChange}
              />

              {clientData.map((c, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-7 gap-4 py-5"
                >
                  <div>
                    <label className="block mb-1">Client Name</label>
                    <input
                      id={`clientName-${idx}`}
                      name="clientName"
                      type="text"
                      // required
                      className={`"w-full border border-gray-300  rounded px-2 py-4"`}
                      value={c.clientName}
                      onChange={(e) =>
                        handleChange(idx, "clientName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      id={`clientEmail-${idx}`}
                      name="clientEmail"
                      type="email"
                      // required
                      className={`"w-full border border-gray-300  rounded px-2 py-4"`}
                      value={c.clientEmail}
                      onChange={(e) =>
                        handleChange(idx, "clientEmail", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Number</label>
                    <input
                      id={`number-${idx}`}
                      name="contactNumber"
                      type="text"
                      // required
                      className={`"w-full border border-gray-300 rounded px-2 py-4"`}
                      value={c.contactNumber}
                      onChange={(e) =>
                        handleChange(idx, "contactNumber", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Role</label>
                    <input
                      id={`Role-${idx}`}
                      name="Role"
                      type="text"
                      // required
                      className={`"w-full border border-gray-300  rounded px-2 py-4"`}
                      value={c.Role}
                      onChange={(e) =>
                        handleChange(idx, "Role", e.target.value)
                      }
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
                          handleRemoveClient(idx);
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
                className="ml-2 p-2 text-white rounded-md bg-green-600"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}
      {showJobs && !showForm && (
        <>
          <div className={`${showEditModal ? " hidden" : "blur-none"}`}>
            <div
              className={`border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm `}
            >
              <h2 className="mb-4 text-center text-base font-medium">
                Add Jobs
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
                <>
                  <div className="mb-2 bg-white rounded-lg shadow-md mt-3 flex items-center overflow-x-scroll w-screen pr-72">
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
                            <th className="py-3 px-2 font-semibold text-left">
                              Filter Jobs
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
                                <td>
                                  <input
                                    type="text"
                                    onChange={(e) =>
                                      handleFilterInputChange(
                                        "clientName",
                                        e.target.value
                                      )
                                    }
                                    value={client.clientName}
                                    className="border-none"
                                  />
                                </td>

                                <td className="py-2 px-2">
                                  {client.contactNumber}
                                </td>
                                <td>{client.clientEmail}</td>
                                <td className="py-2 px-2">{client.Role}</td>
                                <td>
                                  <button
                                    onClick={() =>
                                      handleJobView(client.clientName)
                                    }
                                    className="bg-green-400 hover:bg-green-500 text-black font-medium py-2 px-6 rounded block mx-auto"
                                  >
                                    Jobs
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
                            Page <span className="text-blue-600">{page}</span>{" "}
                            of{" "}
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
                  <div className="mb-4 bg-white rounded-lg shadow-md mt-2 flex items-center overflow-x-scroll w-screen pr-72">
                    {/* Scrollable Content */}
                    <div className="flex-growt">
                      <table className="min-w-[1300px] border-collapse table-auto">
                        <thead>
                          <tr className="bg-yellow-300 border-b border-yellow-200 min-w-[1300px]">
                            <th className="py-3 px-2 font-semibold text-left border-r-2 border-gray-400">
                              S.No.
                            </th>

                            <th className="py-3 px-2 font-semibold text-left border-r-2 border-gray-400">
                              Client Name
                            </th>

                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              Headcount
                            </th>

                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              Process Name
                            </th>
                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              PoC Name
                            </th>
                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              PoC Contact Number
                            </th>
                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              Vendor Payout
                            </th>
                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              Employee Engagement Type
                            </th>
                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              Role Type
                            </th>
                            <th className="py-3 px-2 font-semibold text-left border-gray-400 border-r-2">
                              Location of Hire
                            </th>
                          </tr>
                        </thead>
                        {Array.isArray(jobs) && jobs.length > 0 ? (
                          jobs.map((job, index) => (
                            <tbody>
                              <tr
                                key={index}
                                className={
                                  "border border-gray-200 hover:bg-gray-50 transition-all"
                                }
                              >
                                <td className="py-2 px-10 border-b-2 border-r-2 border-gray-400">
                                  {(page - 1) * PAGE_LIMIT + index + 1}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.clientName}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.headCount}
                                </td>

                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.processName}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.POCname}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.POCcontactNumber}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.vendorPayout}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.empEngType}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.role}
                                </td>
                                <td className="py-2 px-10 border-r-2 border-b-2 border-gray-400">
                                  {job.location}
                                </td>
                              </tr>
                            </tbody>
                          ))
                        ) : (
                          <div>No Jobs found</div>
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
                            Page <span className="text-blue-600">{page}</span>{" "}
                            of{" "}
                            <span className="text-blue-600">{totalPages}</span>
                            <span className="ml-4 text-gray-600">
                              Total: <strong>{totalJob}</strong> Jobs
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
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Client;
