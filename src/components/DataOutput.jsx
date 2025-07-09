import React, { useState } from 'react';

const DataOutput = ({ data, onReset, darkMode, addApiCall }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const downloadCSV = () => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    addApiCall({
      type: 'DOWNLOAD',
      url: 'local',
      action: 'CSV Export',
      success: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Extracted Data
        </h3>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            aria-label="Download data as CSV"
          >
            📥 Download CSV
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            aria-label="Start new extraction"
          >
            New Extraction
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={`table table-striped table-hover w-full ${darkMode ? 'table-dark' : ''}`}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((header) => (
                <th
                  key={header}
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(header)}
                  aria-label={`Sort by ${header}`}
                >
                  <div className="flex items-center justify-between">
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                    <span className="ml-1">
                      {sortField === header ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : (
                        '↕️'
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <td key={cellIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Showing {data.length} extracted records
      </div>
    </div>
  );
};

export default DataOutput;
