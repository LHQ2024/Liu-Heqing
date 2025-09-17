import { Participant } from '../types';

export const downloadCSV = (data: Participant[]) => {
  if (data.length === 0) return;

  const headers = ['participantId', 'assignedGroup', 'assignedGroupName', 'severity', 'assignedAt'];
  const csvRows = [headers.join(',')];

  for (const row of data) {
    // Sanitize data to prevent CSV injection and handle commas
    const sanitize = (val: string | number | null | undefined): string => {
        if (val === null || val === undefined) return '""';
        const str = String(val);
        // Escape double quotes by doubling them
        const escapedStr = str.replace(/"/g, '""');
        // Enclose in double quotes
        return `"${escapedStr}"`;
    };

    const values = [
      sanitize(row.id),
      row.assignedGroup,
      sanitize(row.assignedGroupName),
      sanitize(row.severity || 'N/A'),
      sanitize(new Date(row.assignedAt).toISOString()),
    ];
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  // Prepend BOM for UTF-8 to ensure Excel compatibility with special characters (like Korean)
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rct_assignments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};