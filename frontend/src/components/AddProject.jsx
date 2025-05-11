import React, { useRef, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './AddProject.css';

const AddProject = () => {
  const fileInput = useRef();
  const coverInput = useRef();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleCoverChange = (e) => {
    setCoverFile(e.target.files[0] || null);
  };

  return (
    <DashboardLayout section="add">
      <h2 className="addproject-title">Add project</h2>
      <form className="addproject-form">
        <label>Wedding Name</label>
        <input type="text" placeholder="Amrita-Deepak" className="addproject-input" />

        <div className="addproject-row">
          <div className="addproject-col">
            <label>Package</label>
            <select className="addproject-input">
              <option>Select Package</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>Platinum</option>
            </select>
          </div>
          <div className="addproject-col">
            <label>Mobile Number</label>
            <input type="text" placeholder="Enter Mobile Number" className="addproject-input" />
          </div>
        </div>

        <label>Upload Pictures</label>
        <div className="addproject-dropzone" onClick={() => fileInput.current.click()}>
          <span className="addproject-dropicon">➕</span>
          Drop files to begin upload , <b>or browse.</b>
          <input type="file" multiple ref={fileInput} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <div className="addproject-uploaded">
          {uploadedFiles.map((file, i) => (
            <div className="addproject-file" key={i}>
              <span className="addproject-fileicon">🗂️</span>
              {file.name}
            </div>
          ))}
        </div>

        <label>Upload Cover Picture</label>
        <div className="addproject-dropzone" onClick={() => coverInput.current.click()}>
          <span className="addproject-dropicon">➕</span>
          Drop a cover picture or <b>browse.</b>
          <input type="file" accept="image/*" ref={coverInput} style={{ display: 'none' }} onChange={handleCoverChange} />
        </div>
        {coverFile && (
          <div className="addproject-uploaded">
            <div className="addproject-file">
              <span className="addproject-fileicon">🖼️</span>
              {coverFile.name}
            </div>
          </div>
        )}

        <div className="addproject-row">
          <div className="addproject-col">
            <label>Due Date</label>
            <input type="date" className="addproject-input" />
          </div>
          <div className="addproject-col">
            <label>Estimated Time</label>
            <input type="text" placeholder="22 Days" className="addproject-input" />
          </div>
        </div>

        <div className="addproject-row">
          <div className="addproject-col">
            <label>Members</label>
            <select className="addproject-input">
              <option>Select Members</option>
              <option>Member 1</option>
              <option>Member 2</option>
            </select>
          </div>
          <div className="addproject-col">
            <label>Number of Pictures</label>
            <select className="addproject-input">
              <option>Select no. of pictures</option>
              <option>100</option>
              <option>200</option>
              <option>300</option>
            </select>
          </div>
        </div>

        <label>Terms and Conditions</label>
        <select className="addproject-input">
          <option>Select Terms and Conditions</option>
          <option>Terms 1</option>
          <option>Terms 2</option>
        </select>

        <button type="submit" className="addproject-submit">Submit</button>
      </form>
    </DashboardLayout>
  );
};

export default AddProject; 