'use client';
import { useState } from 'react';

export default function Home() {
  const initialEndpoint = 'https://swapi.dev/api/films'
  const [apiEndpoint, setApiEndpoint] = useState(initialEndpoint)

  return (
    <main className="text-center align-center">
      <p className="text-4xl">To be continued...</p>
    </main>
  )
}
