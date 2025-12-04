'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Copy, Eye, EyeOff, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { Application, Credential } from '@/lib/types';

interface AppDetailsData {
    application: Application;
    credentials: Credential[];
}

export default function AppDetails() {
  const { status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AppDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCred, setNewCred] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});

  const fetchData = useCallback(async () => {
    try {
      if (!params?.id) return;
      const res = await fetch(`/api/apps/${params.id}/details`);
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [params?.id, router]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchData();
  }, [status, fetchData, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCred, applicationId: params!.id }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewCred({ username: '', password: '' });
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this credential?')) return;
    await fetch(`/api/credentials/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleVisibility = (id: number) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading || !data) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-background pt-16"> {/* Added pt-16 for fixed header */}
      <Sidebar />
      <main className="flex-1 p-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-secondary-charcoal hover:text-primary-accent mb-6 transition-colors">
            <ArrowLeft size={18} />
            Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">{data.application.name}</h1>
            <p className="text-secondary-charcoal mt-1">Manage credentials for this application</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Add Credential
          </Button>
        </div>

        <div className="bg-highlight-white rounded-xl shadow-lg shadow-secondary/10 border border-secondary-charcoal/20 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-secondary/5 border-b border-secondary-charcoal/20">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-secondary">Username</th>
                        <th className="px-6 py-4 font-semibold text-secondary">Password</th>
                        <th className="px-6 py-4 font-semibold text-secondary text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-secondary-charcoal/10">
                    {data.credentials.map((cred) => (
                        <tr key={cred.id} className="hover:bg-secondary/5">
                            <td className="px-6 py-4 font-medium text-secondary">
                                <div className="flex items-center gap-2">
                                    {cred.username}
                                    <button onClick={() => copyToClipboard(cred.username)} className="text-secondary-charcoal hover:text-primary-accent" title="Copy Username">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-secondary-charcoal font-mono">
                                <div className="flex items-center gap-2">
                                    {visiblePasswords[cred.id] ? cred.password : '••••••••••••'}
                                    <button onClick={() => toggleVisibility(cred.id)} className="text-secondary-charcoal hover:text-primary-accent">
                                        {visiblePasswords[cred.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button onClick={() => copyToClipboard(cred.password)} className="text-secondary-charcoal hover:text-primary-accent" title="Copy Password">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDelete(cred.id)} className="text-secondary-charcoal hover:text-primary-accent transition-colors p-2">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {data.credentials.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-secondary-charcoal">
                                No credentials found. Add one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Credential">
        <form onSubmit={handleCreate}>
          <Input
            label="Username / Email"
            value={newCred.username}
            onChange={(e) => setNewCred({...newCred, username: e.target.value})}
            required
            placeholder="john@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={newCred.password}
            onChange={(e) => setNewCred({...newCred, password: e.target.value})}
            required
            placeholder="SecurePassword123"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
