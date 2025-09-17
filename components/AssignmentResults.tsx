import React from 'react';
import { Participant } from '../types';
import { downloadCSV } from '../utils/csv';

interface AssignmentResultsProps {
  participants: Participant[];
}

const AssignmentResults: React.FC<AssignmentResultsProps> = ({ participants }) => {
  const handleDownload = () => {
    downloadCSV(participants);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
       <div className="flex justify-between items-center border-b border-gray-200/80 pb-3 mb-4">
        <h2 className="text-lg font-bold text-slate-700">Assignment Results</h2>
        <button
            onClick={handleDownload}
            disabled={participants.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
            Download CSV
        </button>
      </div>
      
      <div className="overflow-y-auto max-h-96 relative">
        <table className="min-w-full divide-y divide-gray-200/80">
          <thead className="bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Group</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/80">
            {participants.length > 0 ? (
                [...participants].reverse().map((p) => (
                <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.assignedGroupName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{p.severity || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(p.assignedAt).toLocaleString()}</td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">No participants have been assigned yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentResults;