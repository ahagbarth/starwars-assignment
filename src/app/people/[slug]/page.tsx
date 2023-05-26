"use client";
import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { usePathname } from "next/navigation";
import Card from "@/components/card";
import { db,peopleTable } from "@/database/database.config";

export default function Home() {
  const pathname = usePathname();
  const initialEndpoint = "https://swapi.dev/api" + pathname;
  const [data, setData] = useState({});

  const getCachedData = (id:number) =>{
    db.table('people').where('id').equals(id).toArray().then(person =>{
      if(person.length === 0){
        getData()
      } else {
        setData(person[0])
      }
    })
  }


  async function getData() {
    const character = await fetch(initialEndpoint).then(res => res.json());
    const homeworld = fetch(character.homeworld).then(res=> res.json())
    const characterPromises = await Promise.all([homeworld])
    character.homeworld = characterPromises[0];
    const id = parseInt(pathname.split('/')[2]);

    db.table('people').put({id:id , ...character});

    setData(character);
  }
  useEffect(()=>{
    window.addEventListener('online', () => {
      getData();
    });
   
  }, [])
  useEffect(() => {
    getData();
    getCachedData(parseInt(pathname.split('/')[2]))

  }, []);
  return (
    <main className="">
      <div className="flex flex-col m-4 uppercase">
        <h1 className="text-center text-5xl">{data.name}</h1>
        <div className="flex justify-center">Gender: {data.gender}</div>
        <div className="flex justify-center">Birth Year: {data.birth_year}</div>
        <div className="flex justify-center">Height: {data.height}cm</div>
        <div className="flex justify-center">Weight: {data.mass}kg</div>
        <div className="flex justify-center">Skin Color: {data.skin_color}</div>
        <div className="flex justify-center">Hair Color: {data.hair_color}</div>
        <div className="flex justify-center">Eye Color: {data.eye_color}</div>
      </div>
      {
        data.homeworld && (
          <div className="">
            <h5 className="text-center text-xl">Homeworld</h5>
            <h3 className="text-center text-4xl">{data.homeworld.name}</h3>
            <h5 className="mt-8 text-md">Residents of the planet:</h5>
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
                {
                    data.homeworld.residents && data.homeworld.residents.map((resident, index)=> {
                        return (<Card key={index} url={resident}></Card>)
                    })
                }
            </div>
          </div>
        )
      }
     
    </main>
  );
}
