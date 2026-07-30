import { useState } from 'react';
import csvData from './students.csv?raw';

// Parse the CSV data
const lines = csvData.trim().split('\n');
const students = lines.slice(1).map(line => {
  if (!line.trim()) return null;
  const values = line.split(',').map(v => v.trim());
  return {
    name: values[0],
    usn: values[1],
    program: values[2],
    mobile: values[3],
    personalEmail: values[4],
    collegeEmail: values[5],
    tenth: values[6],
    twelfth: values[7],
    sem1: values[8],
    sem2: values[9],
    sem3: values[10],
    sem4: values[11],
    sem5: values[12],
    sem6: values[13],
    backlogSubj: values[14],
    activeBacklogs: values[15],
    cgpa: values[16],
  };
}).filter(Boolean);

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setHasSearched(true);
    const found = students.find(s => s.usn && s.usn.toLowerCase() === searchTerm.toLowerCase().trim());
    
    if (found) {
      setStudent(found);
      setError('');
    } else {
      setStudent(null);
      setError(`No details found for USN: ${searchTerm}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/favicon.png" alt="RVITM Logo" className="nav-logo" style={{ objectFit: 'contain', backgroundColor: 'white', padding: '2px' }} />
          <div className="nav-title" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.3px', marginLeft: '0.5rem' }}>
            RV Institute of Technology and<br/>Management<sup style={{fontSize: '0.6em', fontWeight: 700}}>®</sup>
          </div>
        </div>
        <div className="nav-links">
          <a href="https://seres.krupakara.space/" className="nav-link">Home</a>
          <a href="#" className="nav-link active">Student</a>
        </div>
      </nav>

      <div className="container">
        <a href="https://seres.krupakara.space/" className="back-link">
          ← Back to Home
        </a>

        <h1 className="page-title serif">Verify Your Details</h1>
        
        <form className="search-container" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="search-input"
            placeholder="Enter USN (e.g. 1RF23EC005)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {student && (
          <div className="result-section">
            <div className="student-profile-header">
              <div className="profile-avatar">
                {student.name.charAt(0)}
              </div>
              <div className="profile-info">
                <h2 className="student-name serif">{student.name}</h2>
                <div className="badge-group">
                  <span className="badge usn-badge">{student.usn}</span>
                  <span className="badge program-badge">{student.program}</span>
                </div>
              </div>
            </div>

            <div className="details-grid">
              <div className="details-column">
                <h3 className="section-title serif">Contact Information</h3>
                <div className="info-card">
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{student.mobile || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">College Email</span>
                    <span className="info-value">{student.collegeEmail || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Personal Email</span>
                    <span className="info-value">{student.personalEmail || 'N/A'}</span>
                  </div>
                </div>

                <h3 className="section-title serif">Academic Overview</h3>
                <div className="info-card">
                  <div className="info-row">
                    <span className="info-label">10th Marks</span>
                    <span className="info-value">{student.tenth}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">12th Marks</span>
                    <span className="info-value">{student.twelfth}</span>
                  </div>
                  <div className="info-row highlight-row">
                    <span className="info-label">Cumulative CGPA</span>
                    <span className="info-value cgpa-value">{student.cgpa}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Active Backlogs</span>
                    <span className={`info-value ${student.activeBacklogs !== '0' && student.activeBacklogs !== '-' ? 'backlog-badge' : ''}`}>{student.activeBacklogs}</span>
                  </div>
                </div>
              </div>

              <div className="details-column">
                <h3 className="section-title serif">Semester Performance</h3>
                <div className="info-card sem-grid">
                  {[1,2,3,4,5,6].map(sem => (
                    <div className="sem-card" key={sem}>
                      <span className="sem-title">Sem {sem}</span>
                      <span className="sem-score">{student[`sem${sem}`]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        RVITM PLACEMENT PORTAL © 2026
      </footer>
    </>
  );
}

export default App;
