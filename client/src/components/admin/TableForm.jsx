import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  tableNumber: '',
  seats: 4,
  isActive: true
};

const TableForm = ({ editingTable, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingTable) {
      setFormData({
        name: editingTable.name,
        tableNumber: editingTable.tableNumber,
        seats: editingTable.seats,
        isActive: editingTable.isActive
      });
    } else {
      setFormData(initialState);
    }
  }, [editingTable]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      tableNumber: Number(formData.tableNumber),
      seats: Number(formData.seats)
    });
    setFormData(initialState);
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Table code, e.g. T1" value={formData.name} onChange={handleChange} required />
      <input
        name="tableNumber"
        type="number"
        placeholder="Table number"
        value={formData.tableNumber}
        onChange={handleChange}
        required
      />
      <input name="seats" type="number" placeholder="Seats" value={formData.seats} onChange={handleChange} required />
      <label className="checkbox-row">
        <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
        Active table
      </label>
      <div className="action-row">
        <button type="submit" className="primary-button">
          {editingTable ? 'Update Table' : 'Add Table'}
        </button>
        {editingTable ? (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default TableForm;
