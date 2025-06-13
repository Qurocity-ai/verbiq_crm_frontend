import React, { useState } from 'react'
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
    name: "Shubham Paypare",
    email: "shubham@verbiq.ai",
    number: "9325063503",
    password: "Pass@123",
  },
  // Add more if needed
    {
    id: 2,
    name: "Shubham Paypare",
    email: "shubham@verbiq.ai",
    number: "9325063503",
    password: "Pass@123",
  },

];


function RecruiterID() {
   const [form, setForm] = useState({ name: '', email: '', password: '', number: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    console.log("Create clicked", form);
    // Add your logic to add a new user here
  };
  return (
         <div className="p-10 min-h-screen flex flex-col items-center space-y-6 bg-white">
         {/* Create Box */}
      <div className="bg-white p-12 rounded-xl border border-[#0000001A] shadow-sm w-full max-w-6xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-[180px]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-[180px]"
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-[180px]"
          />
          <input
            type="text"
            name="number"
            placeholder="Number"
            value={form.number}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-[180px]"
          />
          <button
            onClick={handleCreate}
            className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded font-semibold"
          >
            Create
          </button>
        </div>
      </div>
       <div className="bg-white p-6 rounded-xl border border-[#0000001A] shadow-sm w-full max-w-6xl space-y-4">
        {/* Table Heading */}
        <div className="grid grid-cols-18 text-gray-500 text-sm font-semibold tracking-widest px-6 py-2">
          <div className="col-span-2">Sr.no</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Number</div>
          <div className="col-span-3">Password</div>
          <div> </div>
          <div> </div>
        </div>

        {/* Cards */}
        {users.map((user, index) => (
          <div
            key={user.id}
            className="grid grid-cols-18 items-center bg-white px-4 py-3 border border-[#0000001A] rounded-lg"
          >
            <div className="col-span-2">{index + 1}</div>
            <div className="col-span-3">{user.name}</div>
            <div className="col-span-4">{user.email}</div>
            <div className="col-span-3">{user.number}</div>
            <div className="col-span-2">{user.password}</div>
            <div className="flex justify-center col-span-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-base font-medium">
                Edit
              </button>
            </div>
            <div className="flex justify-center">
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-base font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}

export default RecruiterID
