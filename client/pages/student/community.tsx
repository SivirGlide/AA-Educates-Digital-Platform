import Head from 'next/head';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

interface Post {
  id: number;
  content: string;
  created_at: string;
  author: string;
}

const StudentCommunityPage: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load community posts');
        } else {
          const mapped = (response.data as any[]).slice(0, 5).map((item, index) => ({
            id: item.id,
            content: item.description || 'Share your latest achievement or ask the community for tips!',
            created_at: new Date(Date.now() - index * 3600000).toISOString(),
            author: ['Maya', 'Leo', 'Zara', 'Arjun', 'Isabella'][index % 5] + ' • Year ' + (10 + index)
          }));
          setPosts(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching community posts');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, []);

  return (
    <>
      <Head>
        <title>Community | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Community feed</h1>
            <p className="text-muted-foreground max-w-3xl">
              Celebrate wins, ask questions, and collaborate with peers from across the AA Educates network. This space is moderated to
              keep everyone safe and supported.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Community unavailable</CardTitle>
                  <CardDescription className="text-destructive">{error}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Share something new</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    rows={4}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="What are you working on or curious about today?"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground items-center">
                    <span>Be kind. Protect your privacy. Credit collaborators.</span>
                    <Button>
                      Post update
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {posts.map((post) => (
                <Card key={post.id} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{post.author}</span>
                      <time className="text-muted-foreground">{new Date(post.created_at).toLocaleString()}</time>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="leading-relaxed">{post.content}</p>
                    <div className="flex gap-4 text-sm">
                      <Button variant="ghost" size="sm">Like</Button>
                      <Button variant="ghost" size="sm">Comment</Button>
                      <Button variant="ghost" size="sm">Share</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default StudentCommunityPage;
