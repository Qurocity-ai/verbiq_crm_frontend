import React, { useState }  from 'react'

function Client() {
   const [showForm, setShowForm] = useState(false);
  return (
   <div className="flex flex-col items-start min-h-screen p-6 bg-white">
      {/* Left-aligned small box */}
      {!showForm && (
        <div className="border border-gray-300 rounded-lg p-4 w-[300px] shadow-sm">
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
      )}

      {/* Form Section */}
      {showForm && (
        <div className="border border-gray-300 rounded-lg p-6 mt-4 w-full max-w-6xl shadow-sm">
          <form className="grid grid-cols-3 gap-x-8 gap-y-2">
            {/* Row 1 */}
            <div>
              <label className="block mb-1">Client Name</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>

            {/* Contact Person Details */}
            <div className="col-span-3 mt-4 font-medium">Contact Person details</div>
            <div>
              <label className="block mb-1">Name</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Number</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>

            {/* Job Info */}
            <div>
              <label className="block mb-1">Job Title</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Location</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Employment Type</label>
              <select className="w-full border border-gray-300  rounded px-2 py-1">
                <option>Full Time</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Work Mode</label>
              <select className="w-full border border-gray-300  rounded px-2 py-1">
                <option>On site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Salary */}
            <div className="col-span-3 mt-4 font-medium">Salary range</div>
            <div>
              <label className="block mb-1">Minimum CTC</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Maximum CTC</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
{/* Section Title */}
            <div className="col-span-3 mt-4 font-medium"></div>
            {/* Other */}
            <div>
              <label className="block mb-1">Notice period allowed</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Language Required</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>
            <div>
              <label className="block mb-1">Proficiency required</label>
              <input type="text" className="w-full border border-gray-300  rounded px-2 py-1" />
            </div>

            {/* Submit */}
            <div className="col-span-3 mt-4">
              <button
                type="submit"
                className="bg-[#46EB19] hover:bg-[#8bd178] text-white px-6 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Client
