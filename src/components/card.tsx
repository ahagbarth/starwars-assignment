import Link from "next/link"
import returnPersonUrl from "@/utils/urlHandler"
import { useEffect, useState } from "react";

interface props {
    data:object,
    url?:string,
    subHeading:string,
    subHeading2:string,
    title:string
}

export default function Card({data, url, title, subHeading, subHeading2}:props) {

  const [info, setInfo] = useState(data);

  async function getData(url:string) {
    const response = await fetch(url).then(res => res.json());
    setInfo(response)
  }
  useEffect(() => {
    if(url){
      getData(url);
    }
  }, []);
  useEffect(() => {
    if(data){
      setInfo(data);
    }
  }, [data]);

  return (
    <div>
      {
        info && (
        <div className="card-container">
          <Link className=""  href={returnPersonUrl(info.url)} >
            <div className="card h-32 rounded-2xl p-4 text-center"  data-testid="card">
              <p className="text-2xl  font-bold">{title || info.name}</p>
              <p>{subHeading || info.height}</p>
              <p>{subHeading2 || info.birth_year}</p>
            </div>
        </Link>
        <div className="border-light w-64 left-16 2xl:left-28 sm:w-28 lg:w-32"></div>
        </div>
        )
      }
      
    </div>
  )
}
