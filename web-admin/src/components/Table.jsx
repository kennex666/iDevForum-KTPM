import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ employees }) => {
    return (
        <div className="table-responsive">
            <table className="table my-0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>
                                <img
                                    className="rounded-circle me-2"
                                    width="30"
                                    height="30"
                                    src={employee.avatar}
                                    alt={employee.name}
                                />
                                {employee.name}
                            </td>
                            <td>{employee.position}</td>
                            <td>{employee.office}</td>
                            <td>{employee.age}</td>
                            <td>{employee.startDate}</td>
                            <td>{employee.salary}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Name</strong></td>
                        <td><strong>Position</strong></td>
                        <td><strong>Office</strong></td>
                        <td><strong>Age</strong></td>
                        <td><strong>Start date</strong></td>
                        <td><strong>Salary</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

Table.propTypes = {
    employees: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            office: PropTypes.string.isRequired,
            age: PropTypes.number.isRequired,
            startDate: PropTypes.string.isRequired,
            salary: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Table;