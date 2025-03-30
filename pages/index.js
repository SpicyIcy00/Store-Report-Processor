
import React, { useState } from 'react';
import axios from 'axios';

const defaultStores = [
  { name: 'Rockwell', tab: 'Rockwell' },
  { name: 'Greenhills', tab: 'Greenhills' },
  { name: 'Magnolia', tab: 'Magnolia' },
  { name: 'North Edsa', tab: 'North Edsa' },
  { name: 'Fairview', tab: 'Fairview' },
];

export default function Home() {
  const [stores, setStores] = useState(defaultStores);
  const [statuses, setStatuses] = useState({});
  const [autoUpdate, setAutoUpdate] = useState(true);

  const handleFileChange = (index, file) => {
    const updated = [...stores];
    updated[index].file = file;
    setStores(updated);
    setStatuses((prev) => ({ ...prev, [index]: 'Ready' }));
  };

  const processAll = async () => {
    for (let i = 0; i < stores.length; i++) {
      const store = stores[i];
      if (!store.file) continue;

      setStatuses((prev) => ({ ...prev, [i]: 'Uploading...' }));
      const formData = new FormData();
      formData.append('store', store.name);
      formData.append('file', store.file);

      try {
        await axios.post('/api/upload', formData);
        setStatuses((prev) => ({ ...prev, [i]: '✅ Success' }));
      } catch (err) {
        setStatuses((prev) => ({ ...prev, [i]: '❌ Failed' }));
      }
    }
  };

  const addStore = () => {
    const name = prompt('Store name?');
    const tab = prompt('Google Sheets tab name?');
    if (name && tab) {
      setStores([...stores, { name, tab }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Sales Data Processor</h1>

      <div className="bg-blue-900 text-blue-100 p-4 rounded mb-6">
        <p>📂 Upload sales data files for each store. The processed data will be automatically updated in the corresponding Google Sheet tab.</p>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={autoUpdate}
            onChange={() => setAutoUpdate(!autoUpdate)}
            className="mr-2"
          />
          Update Google Sheets after processing
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border">Store</th>
              <th className="p-2 border">Sheet Tab</th>
              <th className="p-2 border">Upload File</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, index) => (
              <tr key={index} className="even:bg-gray-700 odd:bg-gray-800">
                <td className="p-2 border">{store.name}</td>
                <td className="p-2 border">{store.tab}</td>
                <td className="p-2 border">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                  />
                </td>
                <td className="p-2 border">{statuses[index] || 'No file selected'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={processAll}
          className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded text-white"
        >
          ⚙️ Process All Files
        </button>
        <button
          onClick={addStore}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          ➕ Add Store
        </button>
      </div>

      <footer className="mt-10 text-sm text-center text-gray-500">
        Sales Data Processor © 2025
      </footer>
    </div>
  );
}
