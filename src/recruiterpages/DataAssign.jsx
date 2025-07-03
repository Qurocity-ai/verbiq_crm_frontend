import React from "react";
import { useSelector } from "react-redux";
function DataAssign() {
  const selectedCandidates = useSelector((state) => state.Candidates);
  return (
    <div>
      <h2>Selected Candidates</h2>

      <table className="min-w-[1200px] border-collapse table-auto ">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            {/* <th className="py-3 px-2 font-semibold text-left">S.No.</th> */}
            <th className="py-3 px-2 font-semibold text-left">Client Name</th>

            <th className="py-3 px-2 font-semibold text-left">
              Job (process) Name
            </th>

            <th className="py-3 px-2 font-semibold text-left">
              Candidate Name
            </th>
            <th className="py-3 px-2 font-semibold text-left">Language</th>
            <th className="py-3 px-2 font-semibold text-left">Proficiency</th>
            <th className="py-3 px-2 font-semibold text-left">
              Contact number
            </th>
            <th className="py-3 px-2 font-semibold text-left">Email Address</th>
            <th className="py-3 px-2 font-semibold text-left">Location</th>
            <th className="py-3 px-2 font-semibold text-left">Current CTC</th>
            <th className="py-3 px-2 font-semibold text-left">Expected CTC</th>
            <th className="py-3 px-2 font-semibold text-left">Experience</th>
            <th className="py-3 px-2 font-semibold text-left">Notice Period</th>
            <th className="py-3 px-2 font-semibold text-left">
              Candidate Stage
            </th>
            <th className="py-3 px-2 font-semibold text-left">
              Date of Interview
            </th>
            <th className="py-3 px-2 font-semibold text-left">Recuriter</th>
            {/* <th className="py-3 px-2 font-semibold text-left">Actions</th> */}
          </tr>
        </thead>
        {selectedCandidates.map((c, index) => (
          <tbody>
            <tr
              key={index}
              className={
                "border border-gray-200 hover:bg-gray-50 transition-all"
              }
              // (selected.includes(c._id) ? " bg-green-50" : "")
            >
              {/* <td className="py-2 px-2">
                  {(page - 1) * PAGE_LIMIT + idx + 1}
                </td>  */}
              <td className="py-2 px-2">{c.clientName}</td>
              <td>{c.jobProcessName}</td>

              <td className="py-2 px-2">{c.candidateName}</td>
              <td className="py-2 px-2">{c.language}</td>
              <td className="py-2 px-2">{c.proficiency}</td>
              <td className="py-2 px-2">{c.contactNo}</td>
              <td className="py-2 px-2">{c.candidateEmail}</td>
              <td className="py-2 px-2">{c.location}</td>
              <td className="py-2 px-2">{c.currentCTC}</td>
              <td className="py-2 px-2">{c.expectedCTC}</td>
              <td className="py-2 px-2">{c.experience}</td>
              <td className="py-2 px-2">{c.noticePeriod}</td>
              <td className="py-2 px-2">{c.candidateStage}</td>
              <td className="py-2 px-2">{c.DOI}</td>
              <td className="py-2 px-2">{c.recruiter}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default DataAssign;
