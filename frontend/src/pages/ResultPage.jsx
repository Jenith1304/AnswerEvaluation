import React from 'react';
import { FiBookOpen, FiUser, FiAward, FiChevronRight } from 'react-icons/fi';
import '../styles/Result.css';

// --- Mock Data ---
// In a real application, this data would be fetched from an API.
// The structure is kept simple to clearly map to the UI components.

const standard = 'Standard 9'
const subject = 'Science'
const teacherName = 'Teacher 2'

const mockTests = [
  {
      studentId : {
        name : 'Krish Patel'
      },
      resultId : [
        {
            question : 'Question 1',
            marks_obtained : 10
        }
      ]
  },
  {
      studentId : {
        name : 'Siddhath Patel'
      },
      resultId : [
        {
            question : 'Question 1',
            marks_obtained : 10
        },
        {
            question : 'Question 2',
            marks_obtained : 5
        }
      ]
  } ,
  {
      studentId : {
        name : 'Siddhath Patel'
      },
      resultId : [
        
      ]
  }
];

const ResultPage = () => {
  // In a real app, you would have state for tests, loading, and errors.
  // const [tests, setTests] = useState([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => { fetch('/api/tests')... }, []);

  return (
    <div className="test-list-container">
      <div className="test-card">
        {/* --- Card Header --- */}
        <div className="test-card-header">
          <FiBookOpen className="header-icon" />
          <h1 className="header-title">Available Result</h1>
        </div>

        {/* --- List of Test Items --- */}
        <div className="test-items-wrapper">
          {mockTests.map((test,index) => (
            <a
              key={test.id}
              href={`/tests/${index}`} // The entire item is a clickable link
              className="test-item-link"
              onClick={(e) => {
                e.preventDefault(); // Prevents page reload for this demo
                alert(`Navigating to details for ${test.title}`);
              }}
            >
              <div className="test-item-content">
                {/* Left side: Title and tags */}
                <div className="test-info">
                  <h2 className="test-title">{test.studentId.name}</h2>
                  <div className="test-meta">
                    <span className="subject-tag">{subject}</span>
                    <span className="standard-pill">{standard}</span>
                  </div>
                </div>

                {/* Right side: Teacher, Marks, and Arrow */}
                <div className="test-details">
                  <div className="detail-item teacher-info">
                    <FiUser />
                    <span>{teacherName}</span>
                  </div>
                  <div className="detail-item marks-info">
                    <FiAward />
                    {
                        test.resultId.length > 0 ? <span>{test.resultId.reduce((sum,obj)=>{
                        return sum + obj.marks_obtained
                      } ,0)} Marks</span>
                      :
                        <span>Pending</span>
                    }
                      
                  </div>
                  <div className="arrow-icon">
                    <FiChevronRight size={22} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;