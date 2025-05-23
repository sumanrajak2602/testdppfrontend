import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateLifecyclePage = () => {
  const [productId, setProductId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [event, setEvent] = useState('');
  const [actor, setActor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      setToken(savedToken);
    }
  }, []);

  const handleProductIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('❌ You must be logged in.');
      return;
    }
    if (!productId.trim()) {
      setMessage('❌ Product ID cannot be empty.');
      return;
    }
    setSubmitted(true);
    setMessage('');
  };

  const handleLifecycleSubmit = async () => {
    if (!productId || !event || !actor) {
      setMessage('❌ All fields are required.');
      return;
    }
    if (!token) {
      setMessage('❌ You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('event', event);
    formData.append('actor', actor);
    if (file) {
      formData.append('document', file);
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await axios.patch(
        `https://testdpp-n1un945ra-suman-rajaks-projects.vercel.app/api/dpp/${productId.trim()}/lifecycle`,
        formData,
        config
      );

      setMessage('✅ Lifecycle event added successfully.');
      setEvent('');
      setActor('');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add lifecycle event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Lifecycle Event</h1>

      {!submitted ? (
        <form onSubmit={handleProductIdSubmit}>
          <input
            type="text"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Proceed
          </button>
        </form>
      ) : (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1">Product ID:</label>
            <input
              type="text"
              value={productId}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <input
            type="text"
            placeholder="Event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            placeholder="Actor"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0]);
            }}
            className="mb-4"
          />

          <button
            onClick={handleLifecycleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Add Lifecycle Event'}
          </button>
        </>
      )}

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default UpdateLifecyclePage;
