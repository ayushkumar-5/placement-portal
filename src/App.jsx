import { useState, useMemo } from 'react';
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
    historyOfBacklogs: values[17] || 'NO',
  };
}).filter(Boolean);

function App() {
  const [viewMode, setViewMode] = useState('search'); // 'search' | 'filter'
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Filter state
  const [cgpaFilter, setCgpaFilter] = useState('all');
  const [activeBacklogFilter, setActiveBacklogFilter] = useState('all');
  const [historyBacklogFilter, setHistoryBacklogFilter] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    if (term.toLowerCase() === '1rf23ec002') {
      setStudent(null);
      setError('Student not available');
      return;
    }
    
    setHasSearched(true);
    const found = students.find(s => s.usn && s.usn.toLowerCase() === term.toLowerCase());
    
    if (found) {
      setStudent(found);
      setError('');
    } else {
      setStudent(null);
      setError(`No details found for USN: ${searchTerm}`);
    }
  };

  const isNotEligible = student && (
    ['1rf21ec023', '1rf22ec024', '1rf23ec033'].includes(student.usn.toLowerCase()) ||
    ((!student.mobile || student.mobile === '-') &&
     (!student.personalEmail || student.personalEmail === '-') &&
     (!student.collegeEmail || student.collegeEmail === '-') &&
     (!student.tenth || student.tenth === '-') &&
     (!student.cgpa || student.cgpa === '-'))
  );

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // CGPA Filter
      if (cgpaFilter !== 'all') {
        const cgpa = parseFloat(s.cgpa);
        if (isNaN(cgpa)) return false;
        if (cgpaFilter === '7.0' && cgpa < 7.0) return false;
        if (cgpaFilter === '7.5' && cgpa < 7.5) return false;
        if (cgpaFilter === '8.0' && cgpa < 8.0) return false;
        if (cgpaFilter === '9.0' && cgpa < 9.0) return false;
      }

      // Active Backlog Filter
      if (activeBacklogFilter !== 'all') {
        const ab = s.activeBacklogs ? s.activeBacklogs.toString().toLowerCase() : '-';
        if (activeBacklogFilter === '0') {
            if (ab !== '0' && ab !== 'none' && ab !== 'zero' && ab !== 'no' && ab !== '-') return false;
        } else if (activeBacklogFilter === '>0') {
            if (ab === '0' || ab === 'none' || ab === 'zero' || ab === 'no' || ab === '-') return false;
        }
      }

      // History of Backlog Filter
      if (historyBacklogFilter !== 'all') {
        const hb = s.historyOfBacklogs ? s.historyOfBacklogs.toString().toUpperCase() : '-';
        if (historyBacklogFilter === 'YES' && hb !== 'YES') return false;
        if (historyBacklogFilter === 'NO' && hb !== 'NO') return false;
      }

      return true;
    });
  }, [cgpaFilter, activeBacklogFilter, historyBacklogFilter]);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <a href="https://seres.krupakara.space/" className="back-link" style={{ marginBottom: 0 }}>
            ← Back to Home
          </a>
          <button 
            className="search-btn" 
            style={{ width: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
            onClick={() => {
              setViewMode(viewMode === 'search' ? 'filter' : 'search');
              setStudent(null);
              setError('');
            }}
          >
            {viewMode === 'search' ? 'Switch to Directory & Filters' : 'Switch to USN Search'}
          </button>
        </div>

        {viewMode === 'search' ? (
          <>
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
                  <div key={student.usn} className="profile-avatar" style={{ overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={`/profiles/${student.usn.toUpperCase()}.jpg`} 
                      alt={student.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                      {student.name.charAt(0)}
                    </div>
                  </div>
                  <div className="profile-info">
                    <h2 className="student-name serif">{student.name}</h2>
                    <div className="badge-group">
                      <span className="badge usn-badge">{student.usn}</span>
                      <span className="badge program-badge">{student.program}</span>
                    </div>
                  </div>
                </div>

                {isNotEligible ? (
                  <div className="not-eligible-card">
                    <h3 className="serif">Placement Eligibility Status</h3>
                    <p>We are sorry, but you are currently not eligible for the placement process.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#8b3a39' }}>Please contact the placement department for more details.</p>
                  </div>
                ) : (
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
                      <div className="info-row">
                        <span className="info-label">History of Backlogs</span>
                        <span className={`info-value ${student.historyOfBacklogs === 'YES' ? 'backlog-badge' : (student.historyOfBacklogs === 'NO' ? 'success-badge' : '')}`}>{student.historyOfBacklogs}</span>
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
                )}
              </div>
            )}
          </>
        ) : (
          <div className="filter-section result-section">
            <h1 className="page-title serif">Student Directory</h1>
            
            <div className="filter-controls">
              <div className="filter-group">
                <label>Minimum CGPA</label>
                <select value={cgpaFilter} onChange={e => setCgpaFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="7.0">&ge; 7.0</option>
                  <option value="7.5">&ge; 7.5</option>
                  <option value="8.0">&ge; 8.0</option>
                  <option value="9.0">&ge; 9.0</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Active Backlogs</label>
                <select value={activeBacklogFilter} onChange={e => setActiveBacklogFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="0">No Active Backlogs (0)</option>
                  <option value=">0">Has Active Backlogs (&gt; 0)</option>
                </select>
              </div>
              <div className="filter-group">
                <label>History of Backlogs</label>
                <select value={historyBacklogFilter} onChange={e => setHistoryBacklogFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="NO">No History (NO)</option>
                  <option value="YES">Has History (YES)</option>
                </select>
              </div>
            </div>

            <div className="filter-results-count">
              Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
            </div>

            <div className="students-grid">
              {filteredStudents.map(s => (
                <div key={s.usn} className="student-card" onClick={() => { setViewMode('search'); setStudent(s); }}>
                  <div className="student-card-avatar" style={{ overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={`/profiles/${s.usn.toUpperCase()}.jpg`} 
                      alt={s.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="student-card-initial">
                      {s.name.charAt(0)}
                    </div>
                  </div>
                  <div className="student-card-info">
                    <h4>{s.name}</h4>
                    <span className="badge usn-badge" style={{ alignSelf: 'flex-start', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>{s.usn}</span>
                    <div className="student-card-stats">
                      <div>CGPA: <strong>{s.cgpa}</strong></div>
                      <div>Active: <strong className={s.activeBacklogs !== '0' && s.activeBacklogs !== '-' ? 'backlog-text' : ''}>{s.activeBacklogs}</strong></div>
                    </div>
                  </div>
                </div>
              ))}
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
