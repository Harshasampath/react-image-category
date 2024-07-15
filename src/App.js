import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [categoryValue, setCategoryValue] = useState(3); // Default to no category selected
  const [result, setResult] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showBlink, setShowBlink] = useState(false);

  useEffect(() => {
    if (result) { // Only blink if there is a result
      setShowBlink(true);
      let blinkCount = 0;
      const interval = setInterval(() => {
        setShowBlink(show => !show);
        blinkCount++;
        if (blinkCount === 6) { // 3 times blinking (blink on and off)
          clearInterval(interval);
          setShowBlink(false); // Stop blinking and hide after blinking
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [result]); // Dependency on result to restart blinking when it changes

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setUploadSuccess(false); // Reset upload success on new file selection
      setResult(''); // Clear previous result
      await sendFileToServer(file);
    } else {
      setFile(null);
      setUploadSuccess(false);
    }
  };

  const sendFileToServer = async (file) => {
    if (categoryValue === 3) {
      alert("Select the category before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`http://127.0.0.1/predict?skin_lesion=${categoryValue}`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data.Disease);
        setUploadSuccess(true);
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setResult('Failed to get prediction');
      setUploadSuccess(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cancer Subtype Detector in Major Type</h1>
        <div>
          <label>
            <input type="radio" value={0} name="cancerType" checked={categoryValue === 0} onChange={() => setCategoryValue(0)} /> Melanoma
          </label>
          <label>
            <input type="radio" value={1} name="cancerType" checked={categoryValue === 1} onChange={() => setCategoryValue(1)} /> BCC
          </label>
          <label>
            <input type="radio" value={2} name="cancerType" checked={categoryValue === 2} onChange={() => setCategoryValue(2)} /> SCC
          </label>
        </div>
        <input type="file" onChange={handleFileChange} accept="image/*" className={uploadSuccess ? "upload-success" : ""} />
        <p>{uploadSuccess ? 'File uploaded successfully!' : 'No file uploaded yet'}</p>
        <p className={showBlink ? "blink" : ""}>Result: {result}</p>
      </header>
    </div>
  );
}

export default App;
