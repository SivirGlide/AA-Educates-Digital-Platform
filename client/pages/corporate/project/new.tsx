import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';

interface ProjectForm {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED';
  skills_required: number[];
}

const defaultForm: ProjectForm = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'DRAFT',
  skills_required: [],
};

const CorporateNewProjectPage: NextPage = () => {
  const [form, setForm] = useState<ProjectForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const profileId = parseInt(localStorage.getItem('profileId') || '0', 10);
      if (!profileId) {
        setError('Please log in again to create a project.');
        setSubmitting(false);
        return;
      }
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        created_by: profileId,
        status: form.status,
        skills_required: form.skills_required,
        ...(form.start_date && { start_date: form.start_date }),
        ...(form.end_date && { end_date: form.end_date }),
      };

      const response = await api.createProject(payload);
      if (response.error) {
        setError(response.error);
      } else {
        setMessage('Project created successfully. View it within your dashboard.');
        setForm(defaultForm);
      }
    } catch (err) {
      setError('Unable to create project right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Project | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Create a project</h1>
            <p className="text-muted-foreground max-w-3xl">Share a brief with AA Educates learners. You can edit details in your dashboard after submission.</p>
          </header>

          <Card className="border-primary/20">
            <CardContent className="p-8 space-y-6">
              {message && (
                <Card className="border-secondary/50 bg-secondary/10">
                  <CardContent className="p-4">
                    <p className="text-secondary">{message}</p>
                  </CardContent>
                </Card>
              )}
              {error && (
                <Card className="border-destructive">
                  <CardContent className="p-4">
                    <p className="text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="title">Project title</Label>
                    <Input
                      id="title"
                      type="text"
                      value={form.title}
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                      rows={6}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="start_date">Start date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={form.start_date}
                        onChange={(event) => setForm((prev) => ({ ...prev, start_date: event.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">End date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={form.end_date}
                        onChange={(event) => setForm((prev) => ({ ...prev, end_date: event.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={form.status}
                      onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ProjectForm['status'] }))}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating project...' : 'Create project'}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/corporate/projects">
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateNewProjectPage;
