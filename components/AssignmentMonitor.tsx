import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExperimentConfig, AssignmentCounts, Severity } from '../types';

interface AssignmentMonitorProps {
  config: ExperimentConfig;
  assignmentCounts: AssignmentCounts;
}

const AssignmentMonitor: React.FC<AssignmentMonitorProps> = ({ config, assignmentCounts }) => {
  const chartData = config.groupNames.map((name, index) => ({
    name,
    'Target': config.groupSizes[index],
    'Assigned': assignmentCounts.overall[index],
  }));

  const totalParticipants = assignmentCounts.overall.reduce((sum, count) => sum + count, 0);
  const totalTarget = config.groupSizes.reduce((sum, size) => sum + size, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
      <div className="flex justify-between items-center border-b border-gray-200/80 pb-3 mb-4">
        <h2 className="text-lg font-bold text-slate-700">Assignment Monitor</h2>
        <div className="text-sm text-gray-600">
            Total Assigned: <span className="font-bold">{totalParticipants}</span> / <span className="font-bold">{totalTarget}</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-2 text-gray-700">Overall Status</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip wrapperClassName="!text-sm !border-gray-200 !rounded-lg !shadow-lg" />
              <Legend wrapperStyle={{fontSize: "14px"}} />
              <Bar dataKey="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Assigned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {config.stratificationEnabled && (
        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-700">Stratification Matrix</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/80">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  {config.groupNames.map(name => (
                    <th key={name} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/80">
                {Object.values(Severity).map(severity => (
                  <tr key={severity}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{severity}</td>
                    {config.groupNames.map((_, index) => {
                      const target = Math.floor(config.groupSizes[index] * (config.strata[severity] / 100));
                      const assigned = assignmentCounts.stratified[severity][index];
                      return (
                         <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-mono">
                           <span className="font-semibold text-base text-gray-800">{assigned}</span> / {target}
                         </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentMonitor;