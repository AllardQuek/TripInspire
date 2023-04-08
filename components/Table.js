import React, { useState } from "react";
function TableRows({ rows, tableRowRemove, onValUpdate }) {
  return rows.map((rowsData, index) => {
    const { destination, day, budget, time } = rowsData;
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={destination}
            onChange={(event) => onValUpdate(index, event)}
            name="destination"
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={day}
            onChange={(event) => onValUpdate(index, event)}
            name="day"
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={budget}
            onChange={(event) => onValUpdate(index, event)}
            name="budget"
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={time}
            onChange={(event) => onValUpdate(index, event)}
            name="time"
            className="form-control"
          />
        </td>
        <td>
          <button
            className="btn btn-dark"
            onClick={() => tableRowRemove(index)}
          >
            Delete Destination
          </button>
        </td>
      </tr>
    );
  });
}
function Table() {
  const [rows, initRow] = useState([]);
  const addRowTable = () => {
    const data = {
      name: "",
      email: "",
      profile: "",
    };
    initRow([...rows, data]);
  };
  const tableRowRemove = (index) => {
    const dataRow = [...rows];
    dataRow.splice(index, 1);
    initRow(dataRow);
  };
  const onValUpdate = (i, event) => {
    const { name, value } = event.target;
    const data = [...rows];
    data[i][name] = value;
    initRow(data);
  };
  return (
    <>
      <h2 className="text-center">Trip details</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Destination</th>
            <th>Day</th>
            <th>Budget</th>
            <th>Time Spent</th>
            <th>
              <button className="btn btn-danger" onClick={addRowTable}>
                New Destination
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <TableRows
            rows={rows}
            tableRowRemove={tableRowRemove}
            onValUpdate={onValUpdate}
          />
        </tbody>
      </table>
    </>
  );
}
export default Table;

