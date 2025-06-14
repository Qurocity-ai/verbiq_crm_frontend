import React, { useState } from 'react';

const users = [
  {
    id: 1,
    name: "Shubham Paypare",
    email: "shubham@verbiq.ai",
    number: "9325063503",
    password: "Pass@123",
  },
  {
    id: 2,
    name: "Aman Singh",
    email: "aman@verbiq.ai",
    number: "9999999999",
    password: "Aman@123",
  },
  {
    id: 3,
    name: "Supriya Singh",
    email: "supriya@verbiq.ai",
    number: "8888888888",
    password: "Supriya@123",
  },
];

function RecruiterID() {
  const [form, setForm] = useState({ name: '', email: '', password: '', number: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    console.log("Create clicked", form);
    // Logic to add user can be added here
  };

  return (
    <div className="p-4 md:p-10 min-h-screen bg-white space-y-6">
      
      {/* Create Box */}
      <div className="bg-white p-4 md:p-12 rounded-xl border border-[#0000001A] shadow-sm w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start md:items-center justify-start md:justify-between">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
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
        
        {/* Table Heading */}
        <div className="hidden md:grid grid-cols-12 gap-2 text-gray-500 text-sm font-semibold tracking-widest px-2">
          <div className="col-span-1">Sr.no</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Number</div>
          <div className="col-span-2">Password</div>
          <div className="col-span-1 text-center">Edit</div>
          <div className="col-span-1 text-center">Delete</div>
        </div>

        {/* Cards */}
        {users.map((user, index) => (
          <div
            key={user.id}
            className="grid md:grid-cols-12 gap-2 items-center bg-white px-4 py-3 border border-gray-200 rounded-lg text-sm"
          >
            {/* Mobile View */}
            <div className="md:hidden space-y-1">
              <div><strong>Sr.no:</strong> {index + 1}</div>
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Number:</strong> {user.number}</div>
              <div><strong>Password:</strong> {user.password}</div>
              <div className="flex gap-2 pt-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">
                  Delete
                </button>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block col-span-1">{index + 1}</div>
            <div className="hidden md:block col-span-2">{user.name}</div>
            <div className="hidden md:block col-span-3">{user.email}</div>
            <div className="hidden md:block col-span-2">{user.number}</div>
            <div className="hidden md:block col-span-2">{user.password}</div>
            <div className="hidden md:flex justify-center col-span-1">
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
                Edit
              </button>
            </div>
            <div className="hidden md:flex justify-center col-span-1">
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">
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

