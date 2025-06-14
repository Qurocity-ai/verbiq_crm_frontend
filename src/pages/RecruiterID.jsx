

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecruiterID() {
  const [form, setForm] = useState({ fullname: '', email: '', password: '', number: '' });
  const [recruiters, setRecruiters] = useState([]);

  const token = localStorage.getItem('crm_token');

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const res = await axios.get('https://verbiq-crm.onrender.com/api/getallrecruiters', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecruiters(res.data.recruiters);
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
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
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
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
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
      </div>
    </div>
  );
}

export default RecruiterID;
