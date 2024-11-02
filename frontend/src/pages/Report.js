import React, { useState } from 'react';
import './Report.css';

export default function Report() {
  const [formData, setFormData] = useState({
    reportingTo: '',
    scamType: '',
    description: '',
    email: '',
    attachments: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.reportingTo) newErrors.reportingTo = 'This field is required';
    if (!formData.scamType) newErrors.scamType = 'This field is required';
    if (!formData.description) newErrors.description = 'This field is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('http://localhost:5000/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Report submitted successfully!');
        setFormData({
          reportingTo: '',
          scamType: '',
          description: '',
          email: '',
          attachments: '',
        });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting the report:', error);
    }
  };

  return (
    <div className="report-container">
      <h1 className="report-title">Report Scam</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Who are you reporting to? *</label>
          <input
            type="text"
            name="reportingTo"
            value={formData.reportingTo}
            onChange={handleChange}
            className="input-text"
          />
          {errors.reportingTo && <p className="error">{errors.reportingTo}</p>}
        </div>

        <div className="form-group">
          <label className="label">What type of scam? *</label>
          <select name="scamType" value={formData.scamType} onChange={handleChange} className="select">
            <option value="">Select Scam Type</option>
            <option value="Phishing">Phishing</option>
            <option value="Identity Theft">Identity Theft</option>
            <option value="Investment Scam">Investment Scam</option>
            <option value="Credit Card Fraud">Credit Card Fraud</option>
            <option value="Online Shopping Scam">Online Shopping Scam</option>
            <option value="Others">Others</option>
          </select>
          {errors.scamType && <p className="error">{errors.scamType}</p>}
        </div>

        <div className="form-group">
          <label className="label">Detailed information about the scam *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea"
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-text"
          />
        </div>

        <div className="form-group">
          <label className="label">Attachments (Google Drive Link)</label>
          <input
            type="text"
            name="attachments"
            value={formData.attachments}
            onChange={handleChange}
            className="input-text"
          />
        </div>

        <button type="submit" className="submit-button">Submit Report</button>
      </form>
    </div>
  );
}
