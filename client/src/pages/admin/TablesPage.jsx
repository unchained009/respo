import { useEffect, useState } from 'react';
import SectionCard from '../../components/common/SectionCard.jsx';
import TableForm from '../../components/admin/TableForm.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { api } from '../../services/api.js';

const TablesPage = () => {
  const { restaurant } = useAdmin();
  const [tables, setTables] = useState([]);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedQr, setSelectedQr] = useState(null);
  const [deliveryQr, setDeliveryQr] = useState(null);

  const loadTables = async () => {
    try {
      const tableList = await api.getTables();
      setTables(tableList);
    } catch (error) {
      console.warn('Failed to load tables, using mock defaults.', error);
      setTables([
        { _id: 't1', name: 'Window Booth', tableNumber: 1, seats: 4, accessToken: 'mock-t1' },
        { _id: 't2', name: 'Center Table', tableNumber: 5, seats: 2, accessToken: 'mock-t2' }
      ]);
    }
  };

  useEffect(() => {
    loadTables();
    api.getDeliveryQr()
      .then(setDeliveryQr)
      .catch(() => {
        setDeliveryQr({
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=mock-delivery',
          entryLabel: 'Home Delivery Portal',
          accessUrl: 'http://localhost:5173/r/demo/access/mock-delivery'
        });
      });
  }, []);

  const handleSubmit = async (payload) => {
    if (editingTable) {
      await api.updateTable(editingTable._id, payload);
      setEditingTable(null);
    } else {
      await api.createTable(payload);
    }

    await loadTables();
  };

  const openQr = async (tableId) => {
    const qr = await api.getTableQr(tableId);
    setSelectedQr(qr);
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">{restaurant?.restaurantCode || 'Floor setup'}</p>
          <h2>Table Management</h2>
        </div>
      </header>

      <div className="two-column-grid">
        <SectionCard title={editingTable ? 'Edit Table' : 'Add Table'} subtitle="Each table gets a unique QR-ready URL.">
          <TableForm editingTable={editingTable} onSubmit={handleSubmit} onCancel={() => setEditingTable(null)} />
        </SectionCard>

        <SectionCard title="QR Preview" subtitle="Generate and print secure QR codes for tables or delivery.">
          {selectedQr ? (
            <div className="qr-preview">
              <img src={selectedQr.qrCodeUrl} alt={selectedQr.tableName} />
              <h4>
                {selectedQr.tableName} / #{selectedQr.tableNumber}
              </h4>
              <p>{selectedQr.tableUrl}</p>
            </div>
          ) : (
            <p className="empty-state">Choose a table below to preview its QR code.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Home Delivery QR" subtitle="Use this QR outside the restaurant for direct delivery ordering.">
        {deliveryQr ? (
          <div className="qr-preview qr-preview--delivery">
            <img src={deliveryQr.qrCodeUrl} alt="Home Delivery QR" />
            <h4>{deliveryQr.entryLabel}</h4>
            <p>{deliveryQr.accessUrl}</p>
          </div>
        ) : (
          <p className="empty-state">Delivery QR is not available yet.</p>
        )}
      </SectionCard>

      <SectionCard title="Tables" subtitle="Edit seating, activation, and secure guest entry links.">
        <div className="table-card-grid">
          {tables.map((table) => (
            <article key={table._id} className="table-card">
              <div>
                <h4>{table.name}</h4>
                <p>Table #{table.tableNumber}</p>
                <span>{table.seats} seats</span>
                <small className="token-copy">Token: {table.accessToken?.slice(0, 10)}...</small>
              </div>
              <div className="action-row">
                <button type="button" className="ghost-button" onClick={() => setEditingTable(table)}>
                  Edit
                </button>
                <button type="button" className="ghost-button" onClick={() => openQr(table._id)}>
                  QR Code
                </button>
                <button
                  type="button"
                  className="ghost-button danger"
                  onClick={async () => {
                    await api.deleteTable(table._id);
                    await loadTables();
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default TablesPage;
