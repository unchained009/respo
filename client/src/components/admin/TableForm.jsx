import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  tableNumber: '',
  seats: 2
};

const TableForm = ({ editingTable, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingTable) {
      setFormData({
        name: editingTable.name,
        tableNumber: editingTable.tableNumber,
        seats: editingTable.seats
      });
    } else {
      setFormData(initialState);
    }
  }, [editingTable]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
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
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2">
          <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Table Name / Label</label>
          <input name="name" className="input-base" placeholder="e.g. VIP Booth 1" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
            <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Table Number</label>
            <input
                name="tableNumber"
                type="number"
                className="input-base"
                placeholder="101"
                value={formData.tableNumber}
                onChange={handleChange}
                required
            />
        </div>
        <div className="grid gap-2">
            <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Seats</label>
            <input
                name="seats"
                type="number"
                className="input-base"
                placeholder="4"
                value={formData.seats}
                onChange={handleChange}
                required
            />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="btn-primary flex-1 h-[60px] text-lg">
          {editingTable ? 'Update Table' : 'Provision Table'}
        </button>
        {editingTable && (
          <button type="button" className="btn-secondary flex-1 h-[60px] text-lg" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TableForm;
