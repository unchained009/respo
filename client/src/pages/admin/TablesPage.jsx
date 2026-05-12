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
        const demoUrl = `${window.location.origin}/r/demo/access/mock-delivery`;
        setDeliveryQr({
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(demoUrl)}`,
          entryLabel: 'Home Delivery Portal (Demo)',
          accessUrl: demoUrl
        });
      });
  }, []);

  const handleSubmit = async (payload) => {
    try {
      if (editingTable) {
        await api.updateTable(editingTable.id || editingTable._id, payload);
        setEditingTable(null);
      } else {
        await api.createTable(payload);
      }
      await loadTables();
    } catch (error) {
      console.error('Failed to save table:', error);
    }
  };

  const openQr = async (table) => {
    try {
      const qr = await api.getTableQr(table.id || table._id);
      setSelectedQr(qr);
    } catch (error) {
      console.warn('Failed to fetch real QR, using fallback preview.');
      const demoUrl = `${window.location.origin}/r/demo/access/${table.accessToken || 'mock-token'}`;
      setSelectedQr({
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(demoUrl)}`,
        tableName: table.name,
        tableNumber: table.tableNumber,
        tableUrl: demoUrl
      });
    }
  };

  return (
    <div className="grid gap-8">
      <header className="mb-8">
        <div>
          <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">{restaurant?.restaurantCode || 'Floor setup'}</p>
          <h2 className="text-4xl font-bold">Table Management</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionCard title={editingTable ? 'Edit Table' : 'Add Table'} subtitle="Each table gets a unique QR-ready URL.">
          <TableForm editingTable={editingTable} onSubmit={handleSubmit} onCancel={() => setEditingTable(null)} />
        </SectionCard>

        <SectionCard title="QR Preview" subtitle="Generate and print secure QR codes for tables or delivery.">
          {selectedQr ? (
            <div className="flex flex-col items-center gap-4 text-center p-8 bg-accent/5 rounded-[40px] border border-black/5">
              <img src={selectedQr.qrCodeUrl} alt={selectedQr.tableName} className="w-64 h-64 rounded-3xl shadow-lg border-8 border-white" />
              <h4 className="font-bold text-xl m-0">
                {selectedQr.tableName} / #{selectedQr.tableNumber}
              </h4>
              <p className="text-[10px] text-muted break-all">{selectedQr.tableUrl}</p>
            </div>
          ) : (
            <p className="text-muted text-center py-12 italic">Choose a table below to preview its QR code.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Home Delivery QR" subtitle="Use this QR outside the restaurant for direct delivery ordering.">
        {deliveryQr ? (
          <div className="flex flex-col items-center gap-4 text-center p-8 bg-accent/5 rounded-[40px] border border-black/5">
            <img src={deliveryQr.qrCodeUrl} alt="Home Delivery QR" className="w-64 h-64 rounded-3xl shadow-lg border-8 border-white" />
            <h4 className="font-bold text-xl m-0">{deliveryQr.entryLabel}</h4>
            <p className="text-[10px] text-muted break-all">{deliveryQr.accessUrl}</p>
          </div>
        ) : (
          <p className="text-muted text-center py-12 italic">Delivery QR is not available yet.</p>
        )}
      </SectionCard>

      <SectionCard title="Tables" subtitle="Edit seating, activation, and secure guest entry links.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => (
            <article key={table.id || table._id} className="glass p-6 rounded-3xl flex flex-col justify-between gap-6">
              <div>
                <h4 className="font-bold text-lg m-0">{table.name}</h4>
                <p className="text-muted m-0 text-sm">Table #{table.tableNumber}</p>
                <span className="text-accent font-bold text-sm">{table.seats} seats</span>
                <small className="block text-[0.6rem] text-muted font-mono mt-2">Token: {table.accessToken?.slice(0, 10)}...</small>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-ghost flex-1 text-xs px-2" onClick={() => setEditingTable(table)}>
                  Edit
                </button>
                <button type="button" className="btn-ghost flex-1 text-xs px-2" onClick={() => openQr(table)}>
                  QR Code
                </button>
                <button
                  type="button"
                  className="btn-ghost text-danger hover:bg-danger/10 hover:text-danger flex-1 text-xs px-2"
                  onClick={async () => {
                    try {
                      await api.deleteTable(table.id || table._id);
                      await loadTables();
                    } catch (error) {
                      console.error('Failed to delete table:', error);
                    }
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
