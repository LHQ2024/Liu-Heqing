import React from 'react';
import { ExperimentConfig, Severity } from '../types';

interface ExperimentSetupProps {
  config: ExperimentConfig;
  setGroupCount: (count: number) => void;
  setGroupSize: (index: number, size: number) => void;
  setGroupName: (index: number, name: string) => void;
  updateConfig: (newConfig: Partial<ExperimentConfig>) => void;
  setStratumRatio: (severity: Severity, ratio: number) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  resetExperiment: () => void;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-xs font-semibold text-gray-500 uppercase px-4 pt-6 pb-2">
    {title}
  </h2>
);

const ExperimentSetup: React.FC<ExperimentSetupProps> = ({
  config,
  setGroupCount,
  setGroupSize,
  setGroupName,
  updateConfig,
  setStratumRatio,
  saveToLocalStorage,
  loadFromLocalStorage,
  resetExperiment
}) => {
  const handleStratificationToggle = () => {
    updateConfig({ stratificationEnabled: !config.stratificationEnabled });
  };
  
  return (
    <div className="flex flex-col">
      <SectionHeader title="Experiment Setup" />
      <div className="bg-white rounded-xl border border-gray-200/80">
        <div className="p-4 flex justify-between items-center border-b border-gray-200/80">
          <label htmlFor="groupCount" className="text-sm font-medium text-gray-800">Number of Groups</label>
          <input
            type="number"
            id="groupCount"
            value={config.groupCount}
            onChange={(e) => setGroupCount(parseInt(e.target.value, 10))}
            min="2"
            max="10"
            className="w-20 text-right rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="p-4 border-b border-gray-200/80">
            <label className="block text-sm font-medium text-gray-800 mb-2">Group Details</label>
            <div className="space-y-2">
            {Array.from({ length: config.groupCount }).map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 items-center">
                 <input
                  type="text"
                  value={config.groupNames[i] || `Group ${i + 1}`}
                  onChange={(e) => setGroupName(i, e.target.value)}
                  placeholder={`Group ${i + 1}`}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="number"
                  value={config.groupSizes[i] || 0}
                  onChange={(e) => setGroupSize(i, parseInt(e.target.value, 10))}
                  placeholder="Size"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 flex justify-between items-center">
            <label className="text-sm font-medium text-gray-800">Enable Stratification</label>
            <button
              onClick={handleStratificationToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.stratificationEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.stratificationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
        </div>
        {config.stratificationEnabled && (
          <div className="px-4 pb-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Symptom Severity Ratios</h3>
            <div className="flex items-center gap-4">
              <label htmlFor="highSeverity" className="text-sm w-10">High</label>
              <input
                type="range"
                id="highSeverity"
                min="0"
                max="100"
                value={config.strata.high}
                onChange={(e) => setStratumRatio(Severity.High, parseInt(e.target.value, 10))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
              />
              <span className="text-sm font-mono w-12 text-right">{config.strata.high}%</span>
            </div>
             <div className="flex items-center gap-4 mt-2">
              <label htmlFor="lowSeverity" className="text-sm w-10">Low</label>
              <input
                type="range"
                id="lowSeverity"
                min="0"
                max="100"
                value={config.strata.low}
                onChange={(e) => setStratumRatio(Severity.Low, parseInt(e.target.value, 10))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
              />
              <span className="text-sm font-mono w-12 text-right">{config.strata.low}%</span>
            </div>
            </div>
          </div>
        )}
      </div>

      <SectionHeader title="Data Management" />
      <div className="bg-white rounded-xl border border-gray-200/80">
        <button onClick={saveToLocalStorage} className="w-full text-left p-4 text-sm text-blue-600 font-medium border-b border-gray-200/80 hover:bg-gray-50 transition-colors">
            Save Configuration
        </button>
        <button onClick={loadFromLocalStorage} className="w-full text-left p-4 text-sm text-blue-600 font-medium border-b border-gray-200/80 hover:bg-gray-50 transition-colors">
            Load Configuration
        </button>
        <button onClick={resetExperiment} className="w-full text-left p-4 text-sm text-red-600 font-medium hover:bg-gray-50 transition-colors">
            Reset Experiment
        </button>
      </div>
    </div>
  );
};

export default ExperimentSetup;