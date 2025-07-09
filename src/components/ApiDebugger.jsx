import React from 'react';

const ApiDebugger = ({ apiCalls, onBack, darkMode }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          API Debug Information
        </h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Go back to data output"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {apiCalls.length === 0 ? (
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No API calls recorded yet
          </p>
        ) : (
          apiCalls.map((call, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                call.success
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      call.type === 'POST'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : call.type === 'GET'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : call.type === 'DELETE'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {call.type}
                  </span>
                  <code className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {call.url}
                  </code>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(call.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {call.status && (
                <div className="mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status: {call.status}
                  </span>
                </div>
              )}

              {call.payload && (
                <details className="mb-2">
                  <summary className={`cursor-pointer text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Request Payload
                  </summary>
                  <pre className={`mt-2 p-2 text-xs rounded overflow-x-auto ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {JSON.stringify(call.payload, null, 2)}
                  </pre>
                </details>
              )}

              {call.response && (
                <details className="mb-2">
                  <summary className={`cursor-pointer text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Response
                  </summary>
                  <pre className={`mt-2 p-2 text-xs rounded overflow-x-auto ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {JSON.stringify(call.response, null, 2)}
                  </pre>
                </details>
              )}

              {call.error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  <strong>Error:</strong> {call.error}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiDebugger;
