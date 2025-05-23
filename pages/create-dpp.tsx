import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUploader from '../components/FileUploader';

const CreateDPPPage = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    manufacturer: '',
    productionDate: '',
    materials: [{ name: '', weight: 0, recycled: false }],
    certifications: [''],
    supplyChainActors: [{ name: '', role: '', address: '' }]
  });
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  const handleChange = (e: any, path?: string, index?: number, key?: string) => {
    if (path) {
      const updated = [...(form as any)[path]];
      updated[index!] = {
        ...updated[index!],
        [key!]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
      };
      setForm({ ...form, [path]: updated });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addItem = (path: string, item: any) => {
    setForm({ ...form, [path]: [...(form as any)[path], item] });
  };

  const handleSubmit = async () => {
    if (!token) {
      setMessage('❌ You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('manufacturer', form.manufacturer);
    formData.append('productionDate', form.productionDate);
    formData.append('materials', JSON.stringify(form.materials));
    formData.append('certifications', JSON.stringify(form.certifications));
    formData.append('supplyChainActors', JSON.stringify(form.supplyChainActors));
    if (file) formData.append('document', file);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const res = await axios.post('https://testdpp-n1un945ra-suman-rajaks-projects.vercel.app/api/dpp', formData, config);
      setMessage(`✅ DPP Created: ${res.data.productId}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error creating DPP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create DPP</h1>

      {/* Basic Info */}
      <div className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input-field" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input-field" />
        <input name="manufacturer" value={form.manufacturer} onChange={handleChange} placeholder="Manufacturer" className="input-field" />
        <input type="date" name="productionDate" value={form.productionDate} onChange={handleChange} className="input-field" />
      </div>

      {/* Materials */}
      <h2 className="section-title">Materials</h2>
      {form.materials.map((mat, i) => (
        <div key={i} className="bg-gray-100 p-3 rounded mb-2">
          <input
            value={mat.name}
            onChange={(e) => handleChange(e, 'materials', i, 'name')}
            placeholder="Material Name"
            className="input-field mb-1"
          />
          <input
            type="number"
            value={mat.weight}
            onChange={(e) => handleChange(e, 'materials', i, 'weight')}
            placeholder="Weight"
            className="input-field mb-1"
          />
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={mat.recycled}
              onChange={(e) => handleChange(e, 'materials', i, 'recycled')}
              className="mr-2"
            />
            Recycled
          </label>
        </div>
      ))}
      <button onClick={() => addItem('materials', { name: '', weight: 0, recycled: false })} className="add-button">
        + Add Material
      </button>

      {/* Certifications */}
      <h2 className="section-title">Certifications</h2>
      {form.certifications.map((cert, i) => (
        <input
          key={i}
          value={cert}
          onChange={(e) => handleChange(e, 'certifications', i)}
          placeholder="Certification"
          className="input-field mb-2"
        />
      ))}
      <button onClick={() => addItem('certifications', '')} className="add-button">
        + Add Certification
      </button>

      {/* Supply Chain Actors */}
      <h2 className="section-title">Supply Chain Actors</h2>
      {form.supplyChainActors.map((actor, i) => (
        <div key={i} className="bg-gray-100 p-3 rounded mb-2">
          <input
            value={actor.name}
            onChange={(e) => handleChange(e, 'supplyChainActors', i, 'name')}
            placeholder="Name"
            className="input-field mb-1"
          />
          <input
            value={actor.role}
            onChange={(e) => handleChange(e, 'supplyChainActors', i, 'role')}
            placeholder="Role"
            className="input-field mb-1"
          />
          <input
            value={actor.address}
            onChange={(e) => handleChange(e, 'supplyChainActors', i, 'address')}
            placeholder="Address"
            className="input-field mb-1"
          />
        </div>
      ))}
      <button onClick={() => addItem('supplyChainActors', { name: '', role: '', address: '' })} className="add-button">
        + Add Actor
      </button>

      {/* File Upload & Submit */}
      <div className="mt-4">
        <FileUploader onFileSelect={setFile} />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 mt-3 rounded hover:bg-green-700"
        >
          {loading ? 'Creating DPP...' : 'Create DPP'}
        </button>
      </div>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default CreateDPPPage;
