import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 shadow">
      <Link href="/">Home</Link>
      {!loggedIn && <Link href="/register">Register</Link>}
      {!loggedIn && <Link href="/login">Login</Link>}
      {loggedIn && (
        <>
          <Link href="/create-dpp">Create DPP</Link>
          <Link href="/update-lifecycle">Update Lifecycle</Link>
          <Link href="/events">Product Events</Link>
          <button onClick={handleLogout} className="text-red-500">Logout</button>
        </>
      )}
    </nav>
  );
}
