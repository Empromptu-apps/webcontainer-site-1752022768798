import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ExtractionProgress from './ExtractionProgress';
import DataOutput from './DataOutput';
import ApiDebugger from './ApiDebugger';

const UploadExtractFlow = ({ darkMode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [objectNames, setObjectNames] = useState([]);
  const [apiCalls, setApiCalls] = useState([]);

  const addApiCall = (call) => {
    setApiCalls(prev => [...prev, { ...call, timestamp: new Date().toISOString() }]);
  };

  const handleFilesUploaded = (files) => {
    setUploadedFiles(files);
    setCurrentStep(2);
  };

  const handleExtractionComplete = (data, names) => {
    setExtractedData(data);
    setObjectNames(names);
    setCurrentStep(3);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setExtractedData(null);
    setObjectNames([]);
  };

  const handleDeleteObjects = async () => {
    for (const objectName of objectNames) {
      try {
        const response = await fetch(`https://builder.impromptu-labs.com/api_tools/objects/${objectName}`, {
          method: 'DELETE'
        });
        addApiCall({
          type: 'DELETE',
          url: `/objects/${objectName}`,
          status: response.status,
          success: response.ok
        });
      } catch (error) {
        addApiCall({
          type: 'DELETE',
          url: `/objects/${objectName}`,
          error: error.message,
          success: false
        });
      }
    }
    handleReset();
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Upload & Extract Flow
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(4)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            aria-label="Show API debug information"
          >
            Show API Debug
          </button>
          {objectNames.length > 0 && (
            <button
              onClick={handleDeleteObjects}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              aria-label="Delete created objects"
            >
              Delete Objects
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-primary-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    currentStep > step
                      ? 'bg-primary-600'
                      : darkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <FileUpload
          onFilesUploaded={handleFilesUploaded}
          darkMode={darkMode}
          addApiCall={addApiCall}
        />
      )}

      {currentStep === 2 && (
        <ExtractionProgress
          files={uploadedFiles}
          onComplete={handleExtractionComplete}
          onCancel={handleReset}
          darkMode={darkMode}
          addApiCall={addApiCall}
        />
      )}

      {currentStep === 3 && (
        <DataOutput
          data={extractedData}
          onReset={handleReset}
          darkMode={darkMode}
          addApiCall={addApiCall}
        />
      )}

      {currentStep === 4 && (
        <ApiDebugger
          apiCalls={apiCalls}
          onBack={() => setCurrentStep(3)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default UploadExtractFlow;
