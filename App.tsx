import React from 'react';
import { useExperiment } from './hooks/useExperiment';
import ExperimentSetup from './components/ExperimentSetup';
import ParticipantAssignment from './components/ParticipantAssignment';
import AssignmentMonitor from './components/AssignmentMonitor';
import AssignmentResults from './components/AssignmentResults';

const App: React.FC = () => {
  const experiment = useExperiment();

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 font-sans">
      <header className="bg-slate-100/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-800">RCT Randomization System</h1>
          <p className="text-slate-500 mt-1 text-sm">Participant Allocation for Clinical Trials</p>
        </div>
      </header>

      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <ExperimentSetup {...experiment} />
          <ParticipantAssignment {...experiment} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-8">
          <AssignmentMonitor {...experiment} />
          <AssignmentResults {...experiment} />
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        <p>&copy; 2024 RCT Systems Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;