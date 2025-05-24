import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'manufacturer' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('https://testdpp.vercel.app/api/users/register', form);
      setMessage('✅ Registered successfully. Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setMessage('❌ Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="manufacturer">Manufacturer</option>
          <option value="supplier">Supplier</option>
          <option value="retailer">Retailer</option>
        </select>
        <button onClick={handleRegister} className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default RegisterPage;
