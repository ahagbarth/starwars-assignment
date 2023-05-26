'use client';
import "nprogress/nprogress.css";
import Catalogue from '@/components/catalogue'
import { useState } from 'react';
import dynamic from "next/dynamic";

const TopProgressBar = dynamic(
  () => {
    return import("../components/topProgressBar");
  },
  { ssr: false },
);

export default function Home() {
  const initialEndpoint = 'https://swapi.dev/api/people'
  const [apiEndpoint, setApiEndpoint] = useState(initialEndpoint)

  return (
    <main className="">
    <TopProgressBar />
     <Catalogue apiUrl={apiEndpoint} cacheTable="people"></Catalogue>
    </main>
  )
}
