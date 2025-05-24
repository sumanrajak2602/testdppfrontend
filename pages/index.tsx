

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [dpps, setDpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDPPs = async () => {
      try {
        const res = await axios.get('https://testdpp.vercel.app/api/dpp');
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
