import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [categoryValue, setCategoryValue] = useState(3); // Default to 0 for Melanoma
  const [result, setResult] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      await sendFileToServer(file);
    } else {
      // Reset if no file is selected
      setFile(null);
      setCategory('');
    }
  };

  const sendFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    if (categoryValue == 0) {
      console.log(categoryValue);
    
      alert("Select the category");
    }
    
    try {
      const response = await fetch(`http://127.0.0.1/predict?skin_lesion=${categoryValue}`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.Disease)
        setResult(data.Disease); // Assuming the backend returns JSON with a result key
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setResult('Failed to get prediction');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cancer Subtype Detector in Major Type</h1>
        <div>
          <label>
            <input
              type="radio"
              value={0}
              name="cancerType"
              checked={categoryValue === 0}
              onChange={() => setCategoryValue(0)}
            /> Melanoma
          </label>
          <label>
            <input
              type="radio"
              value={1}
              name="cancerType"
              checked={categoryValue === 1}
              onChange={() => setCategoryValue(1)}
            /> BCC
          </label>
          <label>
            <input
              type="radio"
              value={2}
              name="cancerType"
              checked={categoryValue === 2}
              onChange={() => setCategoryValue(2)}
            /> SCC
          </label>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
        <p>File: {file ? 'uploaded successfull' : 'No file uploaded yet'}</p>
        <p>Result: {result}</p>
      </header>
    </div>
  );
}

export default App;
