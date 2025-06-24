import React, { useState } from 'react'
import {
    FiPlusCircle, FiTrash2
} from 'react-icons/fi'

const StudentPage = () => {
    const initialStudents = [
        { id: 1, roll: 101, name: 'Alice', gender: 'Female', standard: 'Grade 7' },
        { id: 2, roll: 102, name: 'Bob', gender: 'Male', standard: 'Grade 8' },
        { id: 3, roll: 103, name: 'Charlie', gender: 'Male', standard: 'Grade 7' },
    ]

    const [students, setStudents] = useState(initialStudents)
    const [filter, setFilter] = useState('All')
    const filteredStudents =
        filter === 'All' ? students : students.filter((s) => s.standard === filter)

    return (
        <div className="card">
            <h1 className="page-title">Student Management</h1>

            {/* Filter + Button Section */}
            <div className="student-controls">
                <div className="form-group" style={{ flex: 1 }}>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option>All</option>
                        <option>Grade 7</option>
                        <option>Grade 8</option>
                    </select>
                </div>
                <button className="btn btn-primary">
                    <FiPlusCircle /> Create Student
                </button>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Roll No.</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Standard</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr key={s.id}>
                                <td>{s.roll}</td>
                                <td>{s.name}</td>
                                <td>{s.gender}</td>
                                <td>{s.standard}</td>
                                <td>
                                    <button>
                                        <FiTrash2 color="var(--red)" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentPage
