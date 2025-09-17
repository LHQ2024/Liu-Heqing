
export enum Severity {
  High = 'high',
  Low = 'low',
}

export interface ExperimentConfig {
  groupCount: number;
  groupNames: string[];
  groupSizes: number[];
  stratificationEnabled: boolean;
  strata: {
    [key in Severity]: number;
  };
}

export interface Participant {
  id: string;
  severity: Severity | null;
  assignedGroup: number;
  assignedGroupName: string;
  assignedAt: string;
}

export interface AssignmentCounts {
  overall: number[];
  stratified: {
    [key in Severity]: number[];
  };
}
