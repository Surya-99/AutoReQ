import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Header from './Header';
import './LandingPage.css';

const LandingPage = ({ userName }) => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [notes, setNotes] = useState('');
    const [pptFileUrl, setPptFileUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0 && (acceptedFiles[0].type === 'text/plain' || acceptedFiles[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(acceptedFiles[0]);
            setSubmitStatus('');
            setSummary('');
            setNotes('');
            setPptFileUrl('');
        } else {
            alert('Please upload a .txt or .docx file.');
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'text/plain': ['.txt'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } });

    const handleSubmit = async () => {
        if (!file) return alert('Please upload a file first.');
        setLoading(true);
        setSubmitStatus('Submitting...');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSubmitStatus('File uploaded successfully!');
            console.log('Upload response:', response.data);
        } catch (error) {
            setSubmitStatus('Failed to upload file. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContent = async (endpoint) => {
        if (!file) return alert('Please upload a file first.');
        setLoading(true);
        try {
            let response;
            const fileName = encodeURIComponent(file.name);
            if (endpoint === 'ppt') {
                response = await axios.get(`http://127.0.0.1:8000/api/generate_${endpoint}/?file=${fileName}`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log('PPT API response:', response.data);
                if (response.data.message === 'PPT generated successfully.' && response.data.ppt_file) {
                    const pptUrl = `http://127.0.0.1:8000/api/${response.data.ppt_file}`;

                    const fileResponse = await axios.get(pptUrl, {
                        responseType: 'blob',
                        headers: { 'Accept': 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
                    });
                    console.log('PPT file response status:', fileResponse.status);
                    const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'presentation.pptx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    setPptFileUrl(pptUrl);
                } else {
                    throw new Error('PPT generation failed or invalid response');
                }
            } else {
                response = await axios.get(`http://127.0.0.1:8000/api/generate_${endpoint}/?file=${fileName}`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (endpoint === 'summary') setSummary(response.data.summary || '');
                else if (endpoint === 'notes') setNotes(response.data.notes || '');
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error.response ? error.response.data : error.message);
            alert(`Failed to fetch ${endpoint}. Check console for details.`);
        } finally {
            setLoading(false);
        }
    };

    
    const renderNotes = () => {
        if (!notes) return null;

        const lines = notes.split('\n').map(line => line.trim()).filter(line => line);
        const structuredNotes = [];
        let currentHeading = null;
        let currentPoints = [];

        lines.forEach(line => {
            if (line.startsWith('**') && line.endsWith('**')) {
                if (currentHeading && currentPoints.length > 0) {
                    structuredNotes.push({ heading: currentHeading, points: currentPoints });
                    currentPoints = [];
                }
                currentHeading = line.replace(/\*\*/g, '');
            } else if (line.startsWith('*')) {
                currentPoints.push(line.replace('*', '').trim());
            }
        });

        if (currentHeading && currentPoints.length > 0) {
            structuredNotes.push({ heading: currentHeading, points: currentPoints });
        }

        return structuredNotes.map((section, index) => (
            <div key={index} className="content-section">
                <h3 style={{color: "black"}}>{section.heading}</h3>
                <ul>
                    {section.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <div className="landing-page">
            <Header userName={userName} />
            <h2 className="page-title">AutoReQ</h2>
            <div className="wrapper-for-drop">
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p className="dropzone-text">Drag and drop a .txt or .docx file here, or click to select</p>
                    {file && <p className="file-name">{file.name}</p>}
                </div>
            </div>
            <button onClick={handleSubmit} className="submit-button" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
            {submitStatus && <p className="submit-status">{submitStatus}</p>}
            <div className="button-group">
                <button onClick={() => fetchContent('summary')} className="action-button" disabled={loading}>
                    Generate Summary
                </button>
                <button onClick={() => fetchContent('notes')} className="action-button" disabled={loading}>
                    Generate Notes
                </button>
                <button onClick={() => fetchContent('ppt')} className="action-button" disabled={loading}>
                    Generate PPT
                </button>
            </div>
            {(summary || notes || pptFileUrl) && (
                <div className="content-box">
                    {summary && <div className="content-section"><h3>Summary</h3><p>{summary}</p></div>}
                    {notes && <div className="content-section"><h3>Notes</h3>{renderNotes()}</div>}
                    {pptFileUrl && (
                        <div className="content-section">
                            <h3>PPT Generated</h3>
                            <p>Download completed. Check your downloads folder.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LandingPage;