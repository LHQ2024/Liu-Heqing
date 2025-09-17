import { useState, useEffect, useCallback } from 'react';
import { ExperimentConfig, Participant, AssignmentCounts, Severity } from '../types';

const STORAGE_KEY_CONFIG = 'rctConfig';
const STORAGE_key_PARTICIPANTS = 'rctParticipants';

const initialGroupNames = Array.from({ length: 10 }, (_, i) => `Group ${i + 1}`);

const createInitialConfig = (): ExperimentConfig => ({
  groupCount: 2,
  groupNames: initialGroupNames.slice(0, 2),
  groupSizes: [30, 30],
  stratificationEnabled: false,
  strata: {
    [Severity.High]: 50,
    [Severity.Low]: 50,
  },
});

const calculateCounts = (participants: Participant[], config: ExperimentConfig): AssignmentCounts => {
  const counts: AssignmentCounts = {
    overall: Array(config.groupCount).fill(0),
    stratified: {
      [Severity.High]: Array(config.groupCount).fill(0),
      [Severity.Low]: Array(config.groupCount).fill(0),
    },
  };

  for (const p of participants) {
    if (p.assignedGroup >= 1 && p.assignedGroup <= config.groupCount) {
      counts.overall[p.assignedGroup - 1]++;
      if (p.severity) {
        counts.stratified[p.severity][p.assignedGroup - 1]++;
      }
    }
  }
  return counts;
};


export const useExperiment = () => {
  const [config, setConfig] = useState<ExperimentConfig>(createInitialConfig());
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignmentCounts, setAssignmentCounts] = useState<AssignmentCounts>(calculateCounts([], config));
  const [lastAssignment, setLastAssignment] = useState<{ participantId: string; groupName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    const newCounts = calculateCounts(participants, config);
    setAssignmentCounts(newCounts);
  }, [participants, config]);


  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    localStorage.setItem(STORAGE_key_PARTICIPANTS, JSON.stringify(participants));
  }, [config, participants]);

  const loadFromLocalStorage = () => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      const savedParticipants = localStorage.getItem(STORAGE_key_PARTICIPANTS);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig) as ExperimentConfig;
        setConfig(parsedConfig);
        if (savedParticipants) {
          const parsedParticipants = JSON.parse(savedParticipants) as Participant[];
          setParticipants(parsedParticipants);
        } else {
           setParticipants([]);
        }
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
      resetExperiment();
    }
  };


  const updateConfig = (newConfig: Partial<ExperimentConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const setGroupCount = (count: number) => {
    const newCount = Math.max(2, Math.min(10, count));
    setConfig(prev => ({
      ...prev,
      groupCount: newCount,
      groupNames: initialGroupNames.slice(0, newCount),
      groupSizes: prev.groupSizes.slice(0, newCount).concat(Array(Math.max(0, newCount - prev.groupSizes.length)).fill(30))
    }));
  };

  const setGroupSize = (index: number, size: number) => {
    const newSizes = [...config.groupSizes];
    newSizes[index] = Math.max(0, size);
    updateConfig({ groupSizes: newSizes });
  };
  
  const setGroupName = (index: number, name: string) => {
    const newNames = [...config.groupNames];
    newNames[index] = name;
    updateConfig({ groupNames: newNames });
  };

  const setStratumRatio = (severity: Severity, ratio: number) => {
    const newRatio = Math.max(0, Math.min(100, ratio));
    const otherSeverity = severity === Severity.High ? Severity.Low : Severity.High;
    setConfig(prev => ({
      ...prev,
      strata: {
        ...prev.strata,
        [severity]: newRatio,
        [otherSeverity]: 100 - newRatio,
      }
    }));
  };

  const getNextParticipantId = useCallback((): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    const todayParticipants = participants.filter(p => p.id.startsWith(`${datePrefix}_`));

    let maxSeq = 0;
    todayParticipants.forEach(p => {
        const parts = p.id.split('_');
        if (parts.length === 2) {
            const seq = parseInt(parts[1], 10);
            if (!isNaN(seq) && seq > maxSeq) {
                maxSeq = seq;
            }
        }
    });

    const nextSeq = maxSeq + 1;
    const seqStr = nextSeq.toString().padStart(3, '0');
    
    return `${datePrefix}_${seqStr}`;
  }, [participants]);

  const assignParticipant = (severity: Severity | null) => {
    setError(null);
    if (config.stratificationEnabled && !severity) {
      setError("Severity must be selected for stratified randomization.");
      return;
    }

    let assignedGroup: number | null = null;
    let availableGroups: number[] = [];

    if (config.stratificationEnabled && severity) {
        const stratumTargetSizes = config.groupSizes.map(size => Math.floor(size * (config.strata[severity] / 100)));
        const stratumCurrentCounts = assignmentCounts.stratified[severity];
        
        for (let i = 0; i < config.groupCount; i++) {
            if (stratumCurrentCounts[i] < stratumTargetSizes[i]) {
                const remainingSlots = stratumTargetSizes[i] - stratumCurrentCounts[i];
                for(let j=0; j < remainingSlots; j++){
                    availableGroups.push(i + 1);
                }
            }
        }
    } else {
        const overallTargetSizes = config.groupSizes;
        const overallCurrentCounts = assignmentCounts.overall;
        
        for (let i = 0; i < config.groupCount; i++) {
            if (overallCurrentCounts[i] < overallTargetSizes[i]) {
                const remainingSlots = overallTargetSizes[i] - overallCurrentCounts[i];
                for(let j=0; j < remainingSlots; j++){
                    availableGroups.push(i + 1);
                }
            }
        }
    }

    if (availableGroups.length === 0) {
      setError("All groups are full according to the current criteria.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableGroups.length);
    assignedGroup = availableGroups[randomIndex];
    
    if (assignedGroup !== null) {
      const participantId = getNextParticipantId();
      const assignedGroupName = config.groupNames[assignedGroup - 1];
      const newParticipant: Participant = {
        id: participantId,
        severity: severity,
        assignedGroup,
        assignedGroupName,
        assignedAt: new Date().toISOString(),
      };
      setParticipants(prev => [...prev, newParticipant]);
      setLastAssignment({ participantId: newParticipant.id, groupName: assignedGroupName });
    }
  };
  
  const resetExperiment = () => {
    setConfig(createInitialConfig());
    setParticipants([]);
    setLastAssignment(null);
    setError(null);
  };

  return {
    config,
    participants,
    assignmentCounts,
    lastAssignment,
    error,
    updateConfig,
    setGroupCount,
    setGroupSize,
    setGroupName,
    setStratumRatio,
    assignParticipant,
    saveToLocalStorage,
    loadFromLocalStorage,
    resetExperiment
  };
};