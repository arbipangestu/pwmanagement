'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import AppCard from '@/components/AppCard';
import { redirect } from 'next/navigation';

interface AppData {
  id: string;
  name: string;
  url: string;
  type: 'website' | 'desktop' | 'mobile';
}

export default function Dashboard() {
  const { status } = useSession();
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', url: '', type: 'website' as 'website' | 'desktop' | 'mobile' });
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
        setNewApp({ name: '', url: '', type: 'website' });
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
    <div className="flex min-h-screen bg-background pt-16"> {/* Added pt-16 for fixed header */}
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
            <p className="text-secondary-charcoal mt-1">Manage your applications</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Add Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}

          {apps.length === 0 && (
            <div className="col-span-full text-center py-12 text-secondary-charcoal bg-highlight-white rounded-xl border border-dashed border-secondary-charcoal/30">
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
            label="URL"
            value={newApp.url}
            onChange={(e) => setNewApp({...newApp, url: e.target.value})}
            required
            placeholder="https://netflix.com"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-charcoal mb-2">Application Type</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
              value={newApp.type}
              onChange={(e) => setNewApp({...newApp, type: e.target.value as 'website' | 'desktop' | 'mobile'})}
              required
            >
              <option value="">Select Type</option>
              <option value="website">Website</option>
              <option value="desktop">Desktop App</option>
              <option value="mobile">Mobile App</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>Create App</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
