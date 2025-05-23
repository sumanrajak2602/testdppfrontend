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

  // Get token on client-side only
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
      const res = await axios.post('http://localhost:5000/api/dpp', formData, config);
      setMessage(`✅ DPP Created: ${res.data.productId}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error creating DPP');
    } finally {
      setLoading(false);
    }
  };

  // ... JSX stays the same ...
};
