import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

// SVG icons for Edit and Delete
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
    fill="currentColor"
    viewBox="0 0 24 24"
    className="text-red-600"
  >
    <path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const getToken = () => localStorage.getItem("crm_token");

const initialFormState = {
  clientName: "",
  jobName: "",
  candidateName: "",
  language: "",
  proficiency: "",
  contactNumber: "",
  clientEmail: "",
  location: "",
  currentCTC: "",
  expectedCTC: "",
  experience: "",
  noticePeriod: "",
  candidateStage: "",
  dateOfInterview: "",
  recruiter: "",
};

const CandidateData = () => {
  const [showForm, setShowForm] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch all candidates with Authorization
  const fetchCandidates = async () => {
    setIsFetching(true);
    try {
      const token = getToken();
      if (!token) {
        alert("No token found. Please log in.");
        setIsFetching(false);
        return;
      }
      const res = await fetch(
        "https://verbiq-crm.onrender.com/api/getCandidate",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401) {
        alert("Unauthorized. Please log in again.");
        setIsFetching(false);
        return;
      }
      const data = await res.json();
      setCandidates(data.candidate || []);
    } catch (error) {
      alert("Failed to fetch candidates");
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit for create and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      candidateName: form.candidateName,
      language: form.language,
      proficiency: form.proficiency,
      clientEmail: form.clientEmail,
      location: form.location,
      currentCTC: form.currentCTC,
      expectedCTC: form.expectedCTC,
      experience: form.experience,
      noticePeriod: form.noticePeriod,
      jobName: form.jobName,
      clientName: form.clientName,
      contactNumber: form.contactNumber,
      stage: form.candidateStage,
      DOI: form.dateOfInterview,
      recruiter: form.recruiter,
    };

    try {
      const token = getToken();
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      let res;
      if (editId) {
        // Update
        res = await fetch(
          `https://verbiq-crm.onrender.com/api/updateCandidate/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Create
        res = await fetch(
          "https://verbiq-crm.onrender.com/api/createCandidate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }
      if (res.status === 401) {
        alert("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) throw new Error("Request failed");
      await fetchCandidates();
      setShowForm(false);
      setForm(initialFormState);
      setEditId(null);
    } catch (error) {
      alert("Failed to submit the candidate data");
    }
  };

  // Handle Edit
  const handleEdit = (candidate) => {
    setEditId(candidate._id);
    setShowForm(true);
    setForm({
      clientName: candidate.clientName || "",
      jobName: candidate.jobName || "",
      candidateName: candidate.candidateName || "",
      language: candidate.language || "",
      proficiency: candidate.proficiency || "",
      contactNumber: candidate.contactNumber || "",
      clientEmail: candidate.clientEmail || "",
      location: candidate.location || "",
      currentCTC: candidate.currentCTC || "",
      expectedCTC: candidate.expectedCTC || "",
      experience: candidate.experience || "",
      noticePeriod: candidate.noticePeriod || "",
      candidateStage: candidate.stage || "",
      dateOfInterview: candidate.DOI ? candidate.DOI.split("T")[0] : "",
      recruiter: candidate.recruiter || "",
    });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      const token = getToken();
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const res = await fetch(
        `https://verbiq-crm.onrender.com/api/deleteCandidate/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401) {
        alert("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) throw new Error("Failed to delete");
      await fetchCandidates();
    } catch (error) {
      alert("Delete failed");
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setForm(initialFormState);
    setEditId(null);
  };

  // Handle file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Handle file change (parse & upload one by one)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = getToken();
      if (!token) {
        alert("No token found. Please log in.");
        setUploading(false);
        return;
      }
      // Read file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Now rows is an array of objects
      for (let row of rows) {
        // Map Excel fields to API fields as required
        const payload = {
          candidateName: row.candidateName || row["Candidate Name"] || "",
          language: row.language || row["Language"] || "",
          proficiency: row.proficiency || row["Proficiency"] || "",
          clientEmail: row.clientEmail || row["Email"] || "",
          location: row.location || row["Location"] || "",
          currentCTC: row.currentCTC || row["Current CTC"] || "",
          expectedCTC: row.expectedCTC || row["Expected CTC"] || "",
          experience: row.experience || row["Experience"] || "",
          noticePeriod: row.noticePeriod || row["Notice Period"] || "",
          jobName: row.jobName || row["Job Name"] || "",
          clientName: row.clientName || row["Client Name"] || "",
          contactNumber: row.contactNumber || row["Contact Number"] || "",
          stage: row.candidateStage || row["Candidate Stage"] || "",
          DOI: row.dateOfInterview || row["Date of Interview"] || "",
          recruiter: row.recruiter || row["Recruiter"] || "",
        };

        // Skip empty rows
        if (!payload.candidateName || !payload.clientEmail) continue;

        await fetch("https://verbiq-crm.onrender.com/api/createCandidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      await fetchCandidates();
      alert("Bulk upload successful!");
    } catch (error) {
      alert("Bulk upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="p-6">

      {/* Cards: Only show when not in form mode */}
      {!showForm && (
        <div className="flex gap-6">
          {/* Add Candidate Data Card */}
          <div className="border border-gray-300 rounded-md p-4 w-75 shadow-sm text-center">
            <p className="mb-3">Add Candidate data</p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setForm(initialFormState);
              }}
              className="bg-green-600 text-white px-6 py-2 w-50 rounded-md"
            >
              Add
            </button>
          </div>
          {/* Upload Bulk Candidate Card */}
          <div className="border border-gray-300 rounded-md p-4 w-75 shadow-sm text-center">
            <p className="mb-3">Upload bulk candidate</p>
            <button
              onClick={handleUploadClick}
              className="bg-green-600 text-white px-6 py-2 w-50 rounded-md"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="text-xs text-gray-500 mt-2">Supported: .xls, .xlsx, .csv</div>
          </div>
        </div>
      )}

      {/* Only show form if showForm is true */}
      {showForm && (
        <div className="border border-gray-300 rounded-md p-6 shadow-md w-full max-w-6xl mt-6">
          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div>
                <label className="block text-sm mb-1">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-half"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Job (process) Name</label>
                <input
                  type="text"
                  name="jobName"
                  value={form.jobName}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-half"
                />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Candidate Name</label>
                <input
                  type="text"
                  name="candidateName"
                  value={form.candidateName}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Language</label>
                <input
                  type="text"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Proficiency</label>
                <input
                  type="text"
                  name="proficiency"
                  value={form.proficiency}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={form.clientEmail}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                  required
                />
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Current CTC</label>
                <input
                  type="number"
                  name="currentCTC"
                  value={form.currentCTC}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Expected CTC</label>
                <input
                  type="number"
                  name="expectedCTC"
                  value={form.expectedCTC}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Notice period</label>
                <input
                  type="text"
                  name="noticePeriod"
                  value={form.noticePeriod}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
            </div>
            {/* Row 4 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1">Candidate Stage</label>
                <select
                  name="candidateStage"
                  value={form.candidateStage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  <option>Sourced</option>
                  <option>Screened</option>
                  <option>Submitted</option>
                  <option>Shortlisted</option>
                  <option>Interview 1</option>
                  <option>Interview 2</option>
                  <option>Final Interview</option>
                  <option>Offered</option>
                  <option>Joined</option>
                  <option>Back out</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Date of Interview</label>
                <input
                  type="date"
                  name="dateOfInterview"
                  value={form.dateOfInterview}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Recruiter</label>
                <input
                  type="text"
                  name="recruiter"
                  value={form.recruiter}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-2 rounded-md"
              >
                {editId ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-8 py-2 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Only show flex-list if showForm is false */}
      {!showForm && (
        <div className="mt-10 border border-gray-300 rounded-md shadow-md bg-white">
          <h2 className="text-lg font-semibold mb-3 px-6 pt-6"></h2>
          {isFetching ? (
            <div className="px-6 pb-6">Loading...</div>
          ) : (
            <div className="px-6 pb-6">
              {candidates.length === 0 ? (
                <div className="text-center py-4">
                  No candidates found.
                </div>
              ) : (
                <div>
                  {/* List Header */}
                  <div className=" font-semibold bg-gray-100 border-b border-gray-200 py-2 px-2 rounded-t hidden md:flex">
                    <div className="w-13 shrink-0 ">S.No. </div>
                    <div className="w-44">Name</div>
                    <div className="w-52">Email</div>
                    <div className="w-32">Language</div>
                    <div className="w-36">Location</div>
                    <div className="w-28">Current CTC</div>
                    <div className="w-32">Expected CTC</div>
                    <div className="w-28">Experience</div>
                    <div className="w-32">Notice Period</div>
                    {/* <div className="w-36">Stage</div> */}
                    <div className="w-28">Actions</div>
                  </div>
                  {/* List Body */}
                  {candidates.map((c, idx) => (
                    <div
                      key={c._id}
                      className="flex flex-col md:flex-row items-start md:items-center border-b border-gray-100 hover:bg-gray-50 transition-all py-2 px-2"
                    >
                      <div className="w-12 shrink-0 font-medium">{idx + 1}</div>
                      <div className="w-44">{c.candidateName}</div>
                      <div className="w-52">{c.clientEmail}</div>
                      <div className="w-32">{c.language}</div>
                      <div className="w-36">{c.location}</div>
                      <div className="w-28">{c.currentCTC}</div>
                      <div className="w-32">{c.expectedCTC}</div>
                      <div className="w-28">{c.experience}</div>
                      <div className="w-32">{c.noticePeriod}</div>
                      {/* <div className="w-36">{c.stage || ""}</div> */}
                      <div className="w-28 flex gap-1 mt-2 md:mt-0">
                        <button
                          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                          title="Edit Candidate"
                          onClick={() => handleEdit(c)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                          title="Delete Candidate"
                          onClick={() => handleDelete(c._id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateData;
