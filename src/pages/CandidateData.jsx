import React, { useState } from "react";

const CandidateData = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted!");
  };

  return (
    <div className="p-6">
      {!showForm ? (
        <div className="flex gap-6">
          {/* Add Candidate Data Card */}
          <div className="border border-gray-300 rounded-md p-4 w-75 shadow-sm text-center">
            <p className="mb-3">Add Candidate data</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2 w-50 rounded-md"
            >
              Add
            </button>
          </div>

          {/* Upload Bulk Candidate Card */}
          <div className="border border-gray-300 rounded-md p-4 w-75 shadow-sm text-center">
            <p className="mb-3">Upload bulk candidate</p>
            <button className="bg-green-600 text-white px-6 py-2 w-50 rounded-md">
              Upload
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-md p-6 shadow-md w-full">
          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div>
                <label className="block text-sm mb-1">Client Name</label>
                <input type="text" className="border px-2 py-1 rounded w-half" />
              </div>
              <div>
                <label className="block text-sm mb-1">Job (process) Name</label>
                <input type="text" className="border px-2 py-1 rounded w-half" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Candidate Name</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Language</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Proficiency</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact number</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <input type="email" className="border px-2 py-1 rounded w-full" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Location</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Current CTC</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Expected CTC</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Experience</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1">Notice period</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
            </div>
             
              <div className="grid grid-cols-5 gap-4 mb-4">
              <div>
                  <label className="block mb-1">Candidate Stage</label>
              <select className="w-full border border-gray-300  rounded px-2 py-1">
                <option>Sourced </option>
                <option>Screened</option>
                <option>Submitted</option>
                <option>Shortlisted</option>
                <option>Interview 1</option>
                <option>Interview 2</option>
                <option>Final Interview </option>
                <option>Offered</option>
                <option>Joined</option>
                <option>Back out</option>
                <option>Rejected</option>
              </select>
              </div>
               <div>
                <label className="block text-sm mb-1">Date of Interview</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
               <div>
                <label className="block text-sm mb-1">Recruter</label>
                <input type="text" className="border px-2 py-1 rounded w-full" />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CandidateData;



