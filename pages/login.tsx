// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://testdpp.vercel.app/api/users/login', form);
      const { token } = res.data;
      console.log('Received token:', token); // ✅ Check that token is actually being received

      localStorage.setItem('token', token);
      setMessage('✅ Login successful');
      router.push('/create-dpp'); // Redirect after login
    } catch (err) {
      console.error(err);
      setMessage('❌ Login failed');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 mb-2 block" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 mb-2 block" />
      <button onClick={handleLogin} className="bg-blue-600 text-white p-2 mt-2 rounded">Login</button>
      <p className="mt-4">{message}</p>
    </div>
  );
}
