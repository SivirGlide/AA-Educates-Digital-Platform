export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">AA Educates</h1>
        <p className="text-xl mb-8">Digital Learning Platform</p>
        <div className="space-y-4">
          <p className="text-gray-600">
            Welcome to the AA Educates Digital Learning Platform.
          </p>
          <div className="mt-8">
            <a
              href="/api/docs"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View API Documentation →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

