

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecruiterID() {
  const [form, setForm] = useState({ fullname: '', email: '', password: '', number: '' });
  const [recruiters, setRecruiters] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecruiterId, setEditingRecruiterId] = useState(null);
  const [page,setPage]=useState(1);
  const[totalPages,setTotalPages]=useState(1);
  const [totalRecruiter,setTotalRecruiter]=useState();

  const token = localStorage.getItem('crm_token');

  useEffect(() => {
    fetchRecruiters();
  }, [page]);



  const fetchRecruiters = async () => {
    try {
      const res = await axios.get(`https://verbiq-crm.onrender.com/api/getallrecruiters?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRecruiters(res.data.recruiters);
      setTotalPages(res.data.totalPages);
      setTotalRecruiter(res.data.totalRecruiter);
    } catch (err) {
      console.error("Error fetching recruiters:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const res = await axios.post(
        'https://verbiq-crm.onrender.com/api/createrecruiter',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Recruiter created:", res.data);
      setForm({ fullname: '', email: '', password: '', number: '' });
      fetchRecruiters();
    } catch (error) {
      console.error("Error creating recruiter:", error.response?.data || error.message);
    }
  };
  // edit functinality
 const handleEditClick = (recruiter) => {
    setForm({
      fullname: recruiter.fullname ?? '',
      email: recruiter.email ?? '',
      password: recruiter.password ?? '',
      number: recruiter.number ?? '',
    });
    setEditingRecruiterId(recruiter._id);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://verbiq-crm.onrender.com/api/updaterecruiter/${editingRecruiterId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ fullname: '', email: '', password: '', number: '' });
      setEditingRecruiterId(null);
      setShowEditModal(false);
      fetchRecruiters();
    } catch (error) {
      alert("Error updating recruiter");
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this recruiter?")) return;

  try {
    await axios.delete(`https://verbiq-crm.onrender.com/api/deleterecruiter/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchRecruiters(); // Refresh the list
  } catch (err) {
    console.error("Error deleting recruiter:", err.response?.data || err.message);
    alert("Failed to delete recruiter.");
  }
};

  return (
    <div className="p-4 md:p-10 min-h-screen bg-white space-y-6">
      {/* Create Box */}
      <div className="bg-white p-4 md:p-12 rounded-xl border border-[#0000001A] shadow-sm w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start md:items-center justify-start md:justify-between">
          <input
            type="text"
            name="fullname"
            placeholder="Name"
            value={form.fullname}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-[180px]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-[180px]"
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-[180px]"
          />
          <input
            type="text"
            name="number"
            placeholder="Number"
            value={form.number}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-[180px]"
          />
           <button
            onClick={handleCreate}
            className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded font-semibold w-full md:w-auto"
          >
            Create
          </button>
          </div>
      </div>
           {/* Table + Edit Form Side by Side*/}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto">
      {/* Recruiter Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-[#0000001A]  shadow-sm w-full max-w-6xl mx-auto space-y-4 overflow-x-auto">
        <div className="hidden md:grid grid-cols-12 gap-2 text-gray-500 text-sm font-semibold tracking-widest px-2">
          <div className="col-span-1">Sr.no</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Number</div>
          <div className="col-span-2">Password</div>
          <div className="col-span-1 text-center">Edit</div>
          <div className="col-span-1 text-center">Delete</div>
        </div>

        {recruiters.map((user, index) => (
          <div
            key={user._id}
            className="grid md:grid-cols-12 gap-2 items-center bg-white px-4 py-3 border border-gray-200 rounded-lg text-sm"
          >
            {/* Mobile View */}
            <div className="md:hidden space-y-1">
              <div><strong>Sr.no:</strong> {index + 1}</div>
              <div><strong>Name:</strong> {user.fullname || user.first_name + " " + user.last_name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Number:</strong> {user.number || "-"}</div>
              <div><strong>Password:</strong> {user.password || "Hidden"}</div>
              <div className="flex gap-2 pt-2">
                <button  onClick={() => handleEditClick(user)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
                  Edit
                </button>
                 <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block col-span-1">{index + 1}</div>
            <div className="hidden md:block col-span-2">{user.fullname || user.first_name + " " + user.last_name}</div>
            <div className="hidden md:block col-span-3">{user.email}</div>
            <div className="hidden md:block col-span-2">{user.number || "-"}</div>
            <div className="hidden md:block col-span-2">{user.password || "Hidden"}</div>
            <div className="hidden md:flex justify-center col-span-1">
              <button  onClick={() => handleEditClick(user)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
                Edit
              </button>
            </div>
            <div className="hidden md:flex justify-center col-span-1">
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {/* pagination */}
        {totalPages>1 &&
<div className="flex justify-center items-center gap-6 py-6">
  <button
    onClick={() => setPage(page - 1)}
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
    Page <span className="text-blue-600">{page}</span> of <span className="text-blue-600">{totalPages}</span>
    <span className="ml-4 text-gray-600">Total: <strong>{totalRecruiter}</strong> recruiters</span>
  </span>

  <button
    onClick={() => setPage(page + 1)}
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
}
      </div>
      
      {/* Right-side Edit Form */}
        {showEditModal && (
          <div className="bg-white p-4 md:p-6 rounded-xl border border-[#0000001A] shadow-sm w-full md:w-1/3">
            <h2 className="text-lg font-semibold mb-4">Edit Recruiter</h2>

            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="w-full border px-2 py-1 mb-3 rounded"
            />

            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-2 py-1 mb-3 rounded"
            />

            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-2 py-1 mb-3 rounded"
            />

            <label className="block text-sm font-medium mb-1">Number</label>
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full border px-2 py-1 mb-4 rounded"
            />

            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-green-400 hover:bg-green-500 text-white px-4 py-1 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
      </div>
    
     </div>
    
  );
}

export default RecruiterID;
