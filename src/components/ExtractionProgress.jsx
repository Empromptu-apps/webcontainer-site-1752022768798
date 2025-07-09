import React, { useState, useEffect } from 'react';

const ExtractionProgress = ({ files, onComplete, onCancel, darkMode, addApiCall }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing extraction...');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processFiles = async () => {
      try {
        setStatus('Processing files...');
        setProgress(25);

        // Simulate processing with prompt application
        const payload = {
          created_object_names: [`extracted_data_${Date.now()}`],
          prompt_string: 'Extract key information and structure from the following data: {input_data}',
          inputs: [
            {
              object_name: `uploaded_files_${Date.now()}`,
              processing_mode: 'combine_events'
            }
          ]
        };

        addApiCall({
          type: 'POST',
          url: '/apply_prompt',
          payload: payload,
          status: 'pending'
        });

        setProgress(50);
        setStatus('Applying extraction prompt...');

        const response = await fetch('https://builder.impromptu-labs.com/api_tools/apply_prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        addApiCall({
          type: 'POST',
          url: '/apply_prompt',
          payload: payload,
          response: result,
          status: response.status,
          success: response.ok
        });

        setProgress(75);
        setStatus('Finalizing extraction...');

        // Simulate final processing
        setTimeout(() => {
          setProgress(100);
          setStatus('Extraction complete!');
          setIsProcessing(false);
          
          // Mock extracted data
          const mockData = [
            { id: 1, field: 'Document Title', value: files[0]?.name || 'Sample Document', type: 'Text' },
            { id: 2, field: 'File Size', value: `${(files[0]?.size / 1024).toFixed(1)} KB` || '0 KB', type: 'Number' },
            { id: 3, field: 'Upload Date', value: new Date().toLocaleDateString(), type: 'Date' },
            { id: 4, field: 'Status', value: 'Processed', type: 'Status' }
          ];

          setTimeout(() => {
            onComplete(mockData, payload.created_object_names);
          }, 1000);
        }, 1000);

      } catch (error) {
        addApiCall({
          type: 'POST',
          url: '/apply_prompt',
          error: error.message,
          success: false
        });
        setStatus('Extraction failed. Please try again.');
        setIsProcessing(false);
      }
    };

    processFiles();
  }, [files, onComplete, addApiCall]);

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="spinner"></div>
      </div>

      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Processing Your Files
        </h3>
        
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} aria-live="polite">
          {status}
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {progress}% Complete
        </div>
      </div>

      {isProcessing && (
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Cancel extraction process"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ExtractionProgress;
