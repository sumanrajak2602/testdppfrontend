import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface LifecycleEvent {
  event: string;
  ipfsHash: string;
  timestamp: string;
}

interface DPPData {
  productId: string;
  name: string;
  manufacturer: string;
  ipfsHash: string;
  productionDate: string;
  materials: { name: string; weight: number; recycled: boolean }[];
  certifications: string[];
  lifecycleEvents: LifecycleEvent[];
  supplyChainActors: { name: string; role: string; address: string }[];
}

const EventsPage = () => {
  const [dpp, setDpp] = useState<DPPData | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { productId } = router.query;

  useEffect(() => {
    if (!productId) return;
    axios.get(`https://testdpp-n1un945ra-suman-rajaks-projects.vercel.app/api/dpp/${productId}`)
      .then(res => setDpp(res.data))
      .catch(err => setError('Failed to fetch DPP data'));
  }, [productId]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!dpp) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DPP Details</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <p><strong>Product ID:</strong> {dpp.productId}</p>
        <p><strong>Name:</strong> {dpp.name}</p>
        <p><strong>Manufacturer:</strong> {dpp.manufacturer}</p>
        <p><strong>Production Date:</strong> {new Date(dpp.productionDate).toLocaleString()}</p>
        <p><strong>IPFS Hash:</strong> {dpp.ipfsHash}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Lifecycle Events</h2>
      <div className="space-y-4">
        {dpp.lifecycleEvents.length === 0 && (
          <p className="text-gray-500">No lifecycle events found.</p>
        )}
        {dpp.lifecycleEvents.map((event, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm bg-gray-50">
            <p><strong>Event:</strong> {event.event}</p>
            <p><strong>IPFS Hash:</strong> {event.ipfsHash}</p>
            <p><strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
