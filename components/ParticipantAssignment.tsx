import React, { useState } from 'react';
import { ExperimentConfig, Severity } from '../types';

interface ParticipantAssignmentProps {
  config: ExperimentConfig;
  assignParticipant: (severity: Severity | null) => void;
  lastAssignment: { participantId: string; groupName: string } | null;
  error: string | null;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-xs font-semibold text-gray-500 uppercase px-4 pt-6 pb-2">
    {title}
  </h2>
);

const ParticipantAssignment: React.FC<ParticipantAssignmentProps> = ({
  config,
  assignParticipant,
  lastAssignment,
  error
}) => {
  const [severity, setSeverity] = useState<Severity | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignParticipant(severity);
    // Keep severity selected for faster next entry
  };

  return (
    <div className="flex flex-col">
       <SectionHeader title="New Participant" />
       <form onSubmit={handleSubmit} className="space-y-4">
        {config.stratificationEnabled && (
            <div className="bg-white rounded-xl border border-gray-200/80">
               <div className="p-4">
                  <div className="flex w-full bg-gray-200/80 rounded-lg p-1">
                      <button type="button" onClick={() => setSeverity(Severity.High)} className={`w-1/2 p-1.5 text-sm font-semibold rounded-md transition-all ${severity === Severity.High ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>High Severity</button>
                      <button type="button" onClick={() => setSeverity(Severity.Low)} className={`w-1/2 p-1.5 text-sm font-semibold rounded-md transition-all ${severity === Severity.Low ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>Low Severity</button>
                  </div>
               </div>
            </div>
        )}
        
        <button
          type="submit"
          className="w-full justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Assign Participant
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-xl text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {lastAssignment && !error && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-xl text-sm">
          Assigned <strong>{lastAssignment.participantId}</strong> to <strong>{lastAssignment.groupName}</strong>.
        </div>
      )}
    </div>
  );
};

export default ParticipantAssignment;