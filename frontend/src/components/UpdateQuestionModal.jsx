import { useEffect, useRef, useState } from "react";
import '../styles/UpdateQuestionModal.css'
const UpdateQuestionModal = ({ show, onClose, onUpdate, questionData }) => {
    const [editedQuestion, setEditedQuestion] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");
    const [editedMarks, setEditedMarks] = useState("");


    const modalRef = useRef();

    // Update internal state if the questionData prop changes
    useEffect(() => {
        setEditedQuestion(questionData.questionText);
        setEditedAnswer(questionData.referenceAnswer);
        setEditedMarks(questionData.marks);


    }, [questionData]);

    // Handle clicking outside the modal to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // onClose();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({
            questionText: editedQuestion,
            referenceAnswer: editedAnswer,
            marks: editedMarks,
            _id : questionData._id
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-wrapper" ref={modalRef}>
                <div className="modal-header">
                    <h3>Edit Question</h3>
                    <button onClick={onClose} className="modal-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="question">Question</label>
                            <textarea
                                id="question"
                                value={editedQuestion}
                                onChange={(e) => setEditedQuestion(e.target.value)}
                                rows="3"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="answer">Reference Answer</label>
                            <textarea
                                id="answer"
                                value={editedAnswer}
                                onChange={(e) => setEditedAnswer(e.target.value)}
                                rows="4"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="marks">Marks</label>
                            <input
                                id="marks"
                                type="number"
                                value={editedMarks}
                                onChange={(e) => setEditedMarks(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" onClick={(e)=>handleSubmit(e)}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UpdateQuestionModal;