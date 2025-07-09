import React, { useState, useRef } from 'react';

const FileUpload = ({ onFilesUploaded, darkMode, addApiCall }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const fileArray = Array.from(fileList);
    setFiles(fileArray);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    try {
      const fileData = [];
      for (const file of files) {
        const text = await file.text();
        fileData.push(text);
      }

      const payload = {
        created_object_name: `uploaded_files_${Date.now()}`,
        data_type: 'strings',
        input_data: fileData
      };

      addApiCall({
        type: 'POST',
        url: '/input_data',
        payload: payload,
        status: 'pending'
      });

      const response = await fetch('https://builder.impromptu-labs.com/api_tools/input_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      addApiCall({
        type: 'POST',
        url: '/input_data',
        payload: payload,
        response: result,
        status: response.status,
        success: response.ok
      });

      if (response.ok) {
        onFilesUploaded(files);
      }
    } catch (error) {
      addApiCall({
        type: 'POST',
        url: '/input_data',
        error: error.message,
        success: false
      });
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : darkMode
            ? 'border-gray-600 bg-gray-700/50'
            : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload files"
        />
        
        <div className="space-y-4">
          <div className={`text-4xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            📁
          </div>
          <div>
            <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Drop files here or click to browse
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Support for multiple file types
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            aria-label="Choose files to upload"
          >
            Choose Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📄</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {file.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={uploadFiles}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            aria-label="Upload selected files"
          >
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
