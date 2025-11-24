'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { redirect } from 'next/navigation';

interface AppData {
  id: number;
  name: string;
  url?: string;
}

export default function Dashboard() {
  const { status } = useSession();
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', url: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/login');
    if (status === 'authenticated') fetchApps();
  }, [status]);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      setApps(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewApp({ name: '', url: '' });
        fetchApps();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
        await fetch(`/api/apps/${id}`, { method: 'DELETE' });
        fetchApps();
    } catch (e) {
        console.error(e);
    }
  };

  if (status === 'loading' || loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your applications</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Add Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-3 rounded-lg">
                    <span className="text-xl font-bold text-primary">{app.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => handleDelete(app.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                     </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{app.name}</h3>
              {app.url && (
                <a href={app.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-4 truncate">
                  <ExternalLink size={14} />
                  {app.url}
                </a>
              )}
              <Link href={`/app/${app.id}`}>
                <Button variant="secondary" className="w-full mt-4">
                  View Credentials
                </Button>
              </Link>
            </div>
          ))}

          {apps.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                <p>No applications found. Create one to get started.</p>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Application">
        <form onSubmit={handleCreate}>
          <Input
            label="Application Name"
            value={newApp.name}
            onChange={(e) => setNewApp({...newApp, name: e.target.value})}
            required
            placeholder="e.g. Netflix"
          />
          <Input
            label="URL (Optional)"
            value={newApp.url}
            onChange={(e) => setNewApp({...newApp, url: e.target.value})}
            placeholder="https://netflix.com"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>Create App</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
