// import React, { useState } from 'react';
// import FileUploader from '../components/FileUploader';
// import axios from 'axios';

// const IndexPage = () => {
//   const [form, setForm] = useState({ name: '', description: '' });
//   const [file, setFile] = useState<File | null>(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append('name', form.name);
//     formData.append('description', form.description);
//     if (file) formData.append('document', file);

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       };

//       const res = await axios.post('http://localhost:5000/api/dpp', formData, config);

//       setMessage(`✅ DPP Created: ${res.data.productId}`);
//     } catch (err) {
//       setMessage('❌ Error creating DPP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-center">Register Passport</h1>
//       <input
//         name="name"
//         value={form.name}
//         onChange={handleChange}
//         placeholder="Name"
//         className="w-full border p-2 mb-2 rounded"
//       />
//       <input
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Description"
//         className="w-full border p-2 mb-2 rounded"
//       />
//       <FileUploader onFileSelect={setFile} />
//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 text-white p-2 mt-3 w-full rounded"
//         disabled={loading}
//       >
//         {loading ? 'Submitting...' : 'Submit'}
//       </button>
//       <p className="mt-4 text-center">{message}</p>
//     </div>
//   );
// };

// export default IndexPage;

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [dpps, setDpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDPPs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dpp');
        setDpps(res.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch DPPs.');
      } finally {
        setLoading(false);
      }
    };

    fetchDPPs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Digital Product Passports</h1>

      {loading && <p>🔄 Loading DPPs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dpps.map((dpp) => (
          <div key={dpp._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold">{dpp.name}</h2>
            <p className="text-sm text-gray-600">Product ID: {dpp.productId}</p>
            <p className="text-sm">Manufacturer: {dpp.manufacturer}</p>
            <p className="text-sm">Production Date: {new Date(dpp.productionDate).toLocaleDateString()}</p>
            {dpp.lifecycleEvents?.length > 0 && (
              <p className="text-sm mt-1 text-green-600">Lifecycle Events: {dpp.lifecycleEvents.length}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
