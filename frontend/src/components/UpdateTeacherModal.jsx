import { useEffect, useRef, useState } from "react";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "../styles/UpdateTeacherModal.css";

const UpdateTeacherModal = ({ isOpen, onClose, teacher, onSave, showToast }) => {
  const [currentAssignments, setCurrentAssignments] = useState([]);
  const [newAssignments, setNewAssignments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef();

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const availableStandards = Array.from({ length: 12 }, (_, i) => `Standard ${i + 1}`);
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentStandard, setCurrentStandard] = useState(availableStandards[0]);

  useEffect(() => {
    if (isOpen) {
      setCurrentAssignments(teacher.subjects);
      setNewAssignments([]);
      setSelectedSubject("");
      setSelectedStandard("");
    }
  }, [isOpen, teacher]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  useEffect(() => {
    const getAllSubjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getAllSubjects`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok || data.success === false) {
          throw new Error(data.message);
        }

        setAvailableSubjects(data.data || []);
        setCurrentSubject(data.data[0].subject_name);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        // setLoading(false);
      }
    };

    getAllSubjects();
  }, []);
  const handleRemoveCurrentAssignment = (assignmentId) => {
    setCurrentAssignments(currentAssignments.filter(a => a.id !== assignmentId));
  };

  const handleRemoveNewAssignment = (assignmentId) => {
    setNewAssignments(newAssignments.filter(a => a.id !== assignmentId));
  };

  const handleAddAssignment = () => {
    if (!currentSubject || !currentStandard) {
      showToast("Please select both a subject and a standard.", false);
      return;
    }

    const isDuplicateInCurrent = currentAssignments.some(
      a => a.subject_name === currentSubject && a.standard === currentStandard
    );
    const isDuplicateInNew = newAssignments.some(
      a => a.subject_name === currentSubject && a.standard === currentStandard
    );

    if (isDuplicateInCurrent || isDuplicateInNew) {
      showToast("This subject and standard combination already exists.", false);
      return;
    }

    const newAssignment = {
      subject_name: currentSubject,
      standard: currentStandard,
    };

    setNewAssignments(prev => [...prev, newAssignment]);
    showToast("Assignment added successfully.", true);

    // Optionally reset the dropdowns
    setCurrentSubject('');
    setCurrentStandard('');
  };


  const handleSaveChanges = () => {
    const updatedTeacherData = {
      ...teacher,
      subjects: [...teacher.subjects, ...newAssignments]
    };    // Send to parent, let parent do API + toast
    onSave({
      teacherData: updatedTeacherData,
      subjects: newAssignments,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">Update Teacher Details</h3>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <IoClose size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="teacher-info">
            <h4 className="teacher-name">{teacher.name}</h4>
            <p className="teacher-email">{teacher.email}</p>
          </div>

          <div>
            <h5 className="section-title">Current Assignments</h5>
            <div className="assignment-list">
              {currentAssignments.length > 0 ? (
                currentAssignments.map((assignment) => (
                  <div key={assignment.id} className="assignment-item">
                    <div className="assignment-text">
                      <span>{assignment.subject_name}</span>
                      <span> - </span>
                      <span className="assignment-tag">{assignment.standard}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveCurrentAssignment(assignment._id)}
                      className="assignment-remove-btn"
                      title="Remove assignment"
                    >

                    </button>
                  </div>
                ))
              ) : (
                <p className="no-assignments">No subjects assigned.</p>
              )}
            </div>
          </div>

          <div className="add-assignment">
            <h5>Add New Assignment</h5>
            <div className="form-group">
              <select value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)}>
                {availableSubjects.map(s => <option key={s._id} value={s.subject_name}>{s.subject_name}</option>)}
              </select>

              <select value={currentStandard} onChange={(e) => setCurrentStandard(e.target.value)}>
                {availableStandards.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button onClick={handleAddAssignment} className="add-button">
                <FiPlusCircle size={18} style={{ marginRight: '5px' }} /> Add
              </button>
            </div>
          </div>

          {newAssignments.length > 0 && (
            <div className="new-assignments">
              <h5 className="section-title">Staged for Addition</h5>
              {newAssignments.map((assignment) => (
                <div key={assignment._id} className="assignment-item">
                  <div className="assignment-text">
                    <span>{assignment.subject_name}</span>
                    <span> - </span>
                    <span className="assignment-tag">{assignment.standard}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveNewAssignment(assignment.id)}
                    className="assignment-remove-btn"
                    title="Remove staged assignment"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="footer-btn cancel-btn">
            Cancel
          </button>
          <button onClick={handleSaveChanges} className="footer-btn save-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTeacherModal;