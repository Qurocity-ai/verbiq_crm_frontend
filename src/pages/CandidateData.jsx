import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

// SVG icons for Edit (Delete removed)
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
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="text-blue-600"
  >
    <path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-6.6 8.8V19a1 1 0 0 1-1.45.89l-2-1A1 1 0 0 1 10 18v-4.6L3.2 6.6A1 1 0 0 1 3 5z" />
  </svg>
);
const ClearFilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="text-red-600"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const getToken = () => localStorage.getItem("crm_token");

const initialFormState = {
  candidateName: "",
  clientName: "",
  candidateEmail: "",
  jobProcessName: "",
  contactNo: "",
  language: "",
  location: "",
  currentCTC: "",
  expectedCTC: "",
  experience: "",
  noticePeriod: "",
  candidateStage: "",
  DOI: "",
  proficiency: "",
  recruiter: "",
};

const PAGE_LIMIT = 5; // number of candidates per page

const Candidatedata = () => {
  const [showForm, setShowForm] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isFetching, setIsFetching] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    currentCTC: "",
    expectedCTC: "",
    location: "",
    language: "",
    experience: "",
    noticePeriod: "",
  });

  // Checkbox select states
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch all candidates with Authorization (paginated)
  const fetchCandidates = async () => {
    setIsFetching(true);
    try {
      const token = getToken();
      if (!token) {
        console.log("No token found. Please log in.");
        setIsFetching(false);
        return;
      }
      const res = await fetch(
        `https://verbiq-crm.onrender.com/api/getCandidate?page=${page}&limit=${PAGE_LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401) {
        alert("Unauthorized. Please log in again.");
        setIsFetching(false);
        return;
      }
      if (res.status === 403) {
        alert("Forbidden. You do not have access to this resource.");
        setIsFetching(false);
        return;
      }
      if (!res.ok) {
        alert("Failed to fetch candidates. Status: " + res.status);
        setIsFetching(false);
        return;
      }
      const data = await res.json();
      // Backend should send: { candidate: [], totalPages, totalCandidates }
      setCandidates(data.candidate || []);
      setTotalPages(data.totalPages || 1);
      setTotalCandidates(
        data.totalCandidates || (data.candidate ? data.candidate.length : 0)
      );
      setSelected([]);
      setSelectAll(false);
    } catch (error) {
      console.log("Failed to fetch candidates", error.message);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line
  }, [page]);

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit for create and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      candidateName: form.candidateName,
      clientName: form.clientName,
      candidateEmail: form.candidateEmail,
      jobProcessName: form.jobProcessName,
      contactNo: form.contactNo,
      language: form.language,
      location: form.location,
      currentCTC: Number(form.currentCTC),
      expectedCTC: Number(form.expectedCTC),
      experience: form.experience,
      noticePeriod: form.noticePeriod,
      candidateStage: Array.isArray(form.candidateStage)
        ? form.candidateStage
        : [form.candidateStage],
      DOI: form.DOI,
      proficiency: form.proficiency,
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
              Authorization: `Bearer ${token}`,
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
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }
      if (res.status === 401) {
        alert("Unauthorized. Please log in again.");
        return;
      }
      if (res.status === 403) {
        alert("Forbidden. You do not have access to this resource.");
        return;
      }
      if (!res.ok) throw new Error("Request failed");
      const createdCandidate = await res.json();
      setCandidates((prev) => [...prev, createdCandidate.candidate]);
      await fetchCandidates();
      setForm(initialFormState);
      setShowForm(false);
      setEditId(null);
    } catch (error) {
      alert("Failed to submit the candidate data", error.message);
    }
  };

  // Handle Edit
  const handleEdit = (candidate) => {
    setEditId(candidate._id);
    setShowForm(true);
    setForm({
      clientName: candidate.clientName || "",
      jobProcessName: candidate.jobProcessName || "",
      candidateName: candidate.candidateName || "",
      language: candidate.language || "",
      proficiency: candidate.proficiency || "",
      contactNo: candidate.contactNo || "",
      candidateEmail: candidate.candidateEmail || "",
      location: candidate.location || "",
      currentCTC: candidate.currentCTC || "",
      expectedCTC: candidate.expectedCTC || "",
      experience: candidate.experience || "",
      noticePeriod: candidate.noticePeriod || "",
      candidateStage: candidate.candidateStage || "",
      DOI: candidate.DOI ? candidate.DOI.split("T")[0] : "",
      recruiter: candidate.recruiter || "",
    });
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
        const candidateEmail =
          row.candidateEmail ||
          row["Candidate Email"] ||
          row["Email"] ||
          row["email"] ||
          row["clientEmail"] ||
          "";
        if (!candidateEmail) continue; // skip if no email

        const payload = {
          candidateName: row.candidateName || row["Candidate Name"] || "",
          clientName: row.clientName || row["Client Name"] || "",
          candidateEmail,
          jobProcessName: row.jobProcessName || row["Job Name"] || "",
          contactNo: row.contactNo || row["Contact Number"] || "",
          language: row.language || row["Language"] || "",
          location: row.location || row["Location"] || "",
          currentCTC: row.currentCTC || row["Current CTC"] || "",
          expectedCTC: row.expectedCTC || row["Expected CTC"] || "",
          experience: row.experience || row["Experience"] || "",
          noticePeriod: row.noticePeriod || row["Notice Period"] || "",
          candidateStage: row.candidateStage || row["Candidate Stage"] || "",
          DOI: row.DOI || row["Date of Interview"] || "",
          proficiency: row.proficiency || row["Proficiency"] || "",
          recruiter: row.recruiter || row["Recruiter"] || "",
        };

        if (!payload.candidateName || !payload.candidateEmail) continue;

        await fetch("https://verbiq-crm.onrender.com/api/createCandidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      await fetchCandidates();
      alert("Bulk upload successful!");
    } catch (error) {
      alert("Bulk upload failed", error.message);
    }
    setUploading(false);
  };

  // Checkbox select logic
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelected(candidates.map((c) => c._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (candidateId) => {
    setSelected((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  useEffect(() => {
    if (candidates.length > 0 && selected.length === candidates.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selected, candidates]);

  // Pagination controls
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleFilterInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const clearFilters = () => {
    setFilters({
      currentCTC: "",
      expectedCTC: "",
      location: "",
      language: "",
      experience: "",
      noticePeriod: "",
    });
    fetchCandidates();
  };
  const addFilters = async () => {
    setIsFetching(true);
    let filteredCandidates = null;

    // Apply filters one by one (since each API filters by one field)
    for (const [field, value] of Object.entries(filters)) {
      if (value) {
        let url = "";
        let body = {};
        switch (field) {
          case "currentCTC":
            url = "https://verbiq-crm.onrender.com/api/filterByCurrentCTC";
            body = [{ CTC: value }];
            break;
          case "expectedCTC":
            url = "https://verbiq-crm.onrender.com/api/filterByExpectedCTC";
            body = [{ CTC: value }];
            break;
          case "location":
            url = "https://verbiq-crm.onrender.com/api/filterByLocation";
            body = [value];
            break;
          case "language":
            url = "https://verbiq-crm.onrender.com/api/filterByLanguage";
            body = [value];
            break;
          case "experience":
            url = "https://verbiq-crm.onrender.com/api/filterByExperience";
            body = [{ experience: value }];
            break;
          case "noticePeriod":
            url = "https://verbiq-crm.onrender.com/api/filterByNoticePeriod";
            body = [{ noticePeriod: value }];
            break;
          default:
            continue;
        }
        try {
          const token = getToken();
          if (!token) {
            alert("No token found. Please log in.");
            setIsFetching(false);
            return;
          }
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          });
          if (res.status === 401) {
            alert("Unauthorized. Please log in again.");
            setIsFetching(false);
            return;
          }
          const data = await res.json();
          // Intersect results if multiple filters, else just assign
          const result = Array.isArray(data) ? data : data.candidate || [];
          if (filteredCandidates === null) {
            filteredCandidates = result;
          } else {
            // Intersect by _id
            filteredCandidates = filteredCandidates.filter((c) =>
              result.some((d) => d._id === c._id)
            );
          }
        } catch (err) {
          alert("Failed to filter candidates", err.message);
          setIsFetching(false);
          return;
        }
      }
    }
    setCandidates(filteredCandidates !== null ? filteredCandidates : []);
    setIsFetching(false);
  };

  return (
    <div className="p-6">
      {/* Cards: Only show when not in form mode */}
      {!showForm && (
        <div className="flex gap-6 mb-8">
          {/* Add Candidate Data Card */}
          <div className="border border-gray-300 rounded-md p-4 w-80 shadow-sm text-center">
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
          <div className="border border-gray-300 rounded-md p-4 w-80 shadow-sm text-center">
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
            <div className="text-xs text-gray-500 mt-2">
              Supported: .xls, .xlsx, .csv
            </div>
          </div>
        </div>
      )}

      {/* Only show form if showForm is true */}
      {showForm && (
        <div className="border border-gray-300 rounded-md p-6 shadow-md w-full max-w-6xl h-120 mt-6">
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
                  name="jobProcessName"
                  value={form.jobProcessName}
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
                  name="contactNo"
                  value={form.contactNo}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <input
                  type="email"
                  name="candidateEmail"
                  value={form.candidateEmail}
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
                  name="DOI"
                  value={form.DOI}
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

      {/* Candidate list table display (with selection, pagination, S.No.) */}
      {!showForm && (
        <>
          <div className="flex gap-4 mt-8 mb-4">
            <input
              type="number"
              placeholder="Current CTC"
              onChange={(e) =>
                handleFilterInputChange("currentCTC", e.target.value)
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="number"
              placeholder="Expected CTC"
              onChange={(e) =>
                handleFilterInputChange("expectedCTC", e.target.value)
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Location"
              onChange={(e) =>
                handleFilterInputChange("location", e.target.value)
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Language"
              onChange={(e) =>
                handleFilterInputChange("language", e.target.value)
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Experience"
              onChange={(e) =>
                handleFilterInputChange("experience", e.target.value)
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Notice Period"
              onChange={(e) =>
                handleFilterInputChange("noticePeriod", e.target.value)
              }
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={addFilters}
              className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition"
            >
              <FilterIcon />
            </button>
            <button
              onClick={clearFilters}
              className="p-3 rounded-full bg-red-50 hover:bg-red-100 transition"
            >
              <ClearFilterIcon />
            </button>
          </div>
          <div className="mt-6 border border-gray-300 rounded-md shadow-md bg-white w-full overflow-x-auto">
            {isFetching ? (
              <div className="px-6 pb-6">Loading...</div>
            ) : (
              <div className="px-0 pb-6">
                {candidates.length === 0 ? (
                  <div className="text-center py-4">No candidates found.</div>
                ) : (
                  <>
                    <table className="w-full border-collapse table-auto">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="py-3 px-2 font-semibold text-left">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              aria-label="Select All"
                            />
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            S.No.
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Name
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Email
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Language
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Location
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Current CTC
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Expected CTC
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Experience
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Notice Period
                          </th>
                          <th className="py-3 px-2 font-semibold text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((c, idx) => (
                          <tr
                            key={c._id}
                            className={
                              "border border-gray-200 hover:bg-gray-50 transition-all" +
                              (selected.includes(c._id) ? " bg-green-50" : "")
                            }
                          >
                            <td className="py-2 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={selected.includes(c._id)}
                                onChange={() => handleSelect(c._id)}
                                aria-label={`Select row ${idx + 1}`}
                              />
                            </td>
                            <td className="py-2 px-2">
                              {(page - 1) * PAGE_LIMIT + idx + 1}
                            </td>
                            <td className="py-2 px-2">{c.candidateName}</td>
                            <td className="py-2 px-2">{c.candidateEmail}</td>
                            <td className="py-2 px-2">{c.language}</td>
                            <td className="py-2 px-2">{c.location}</td>
                            <td className="py-2 px-2">{c.currentCTC}</td>
                            <td className="py-2 px-2">{c.expectedCTC}</td>
                            <td className="py-2 px-2">{c.experience}</td>
                            <td className="py-2 px-2">{c.noticePeriod}</td>
                            <td className="py-2 px-2">
                              <div className="flex gap-2">
                                <button
                                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                                  title="Edit Candidate"
                                  onClick={() => handleEdit(c)}
                                >
                                  <EditIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination controls */}
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
                            Total: <strong>{totalCandidates}</strong> candidates
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
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Candidatedata;
