"use client";
import { FC, useEffect, useState } from "react";
import Card from "./card";
import Filter from "./filter";
import Sort from "./sort";
import { db, peopleTable } from "@/database/database.config";
import { useLiveQuery } from "dexie-react-hooks";

interface props {
  apiUrl: string;
  cacheTable: string;
}

const Catalogue: FC<props> = ({ apiUrl, cacheTable }: props) => {
  const [catalogue, setCatalogue] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [api, setApi] = useState(apiUrl);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState("none");
  const [isOffline, setOffline] = useState(false);

  //does initial call to the indexeddb
  const query = useLiveQuery(() =>
    db.table(cacheTable).offset(offset).limit(10).toArray()
  );

  //handles pagination and sort in offline mode
  function queryDbChangePage(offset: number, sort: string) {
    if (offset > 0) {
      setOffset(offset);
    }
    switch (sort) {
      case "asc":
        db.table(cacheTable)
          .orderBy("name")
          .offset(offset)
          .limit(10)
          .toArray()
          .then((res) => {
            setCatalogue(res);
          });
        break;
      case "desc":
        db.table(cacheTable)
          .orderBy("name")
          .reverse()
          .offset(offset)
          .limit(10)
          .toArray()
          .then((res) => {
            setCatalogue(res);
          });
        break;
      case "none":
        db.table(cacheTable)
          .offset(offset)
          .limit(10)
          .toArray()
          .then((res) => {
            setCatalogue(res);
          });
        break;
    }
  }
  //handles search in offline
  function queryDbSearch(filter: string) {
    let name = filter.split("=")[1];
    if (name) {
      db.table(cacheTable)
        .where("name")
        .startsWith(name)
        .limit(10)
        .toArray()
        .then((res) => {
          setCatalogue(res);
        });
    } else {
      setCatalogue(query);
    }
  }
  //fetches data from api and checks if its in indexeddb to not duplicate
  async function getData(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    setCatalogue(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    db.table(cacheTable)
      .count()
      .then((res) => {
        if (res > 0) {
          data.results.forEach((item:{name:string}) => {
            db.table(cacheTable)
              .get({ name: item.name })
              .then((res) => {
                if (!res) {
                  try {
                    db.table(cacheTable).add(item);
                  } catch (error) {
                    console.error(`Failed to add ${item.name}: ${error}`);
                  }
                }
              });
          });
        } else {
          db.table(cacheTable).bulkAdd(data.results);
        }
      });
  }
  const handlePageChange = (newUrl: string, offset: number) => {
    if (!isOffline && newUrl) {
      getData(newUrl);
    } else {
      queryDbChangePage(offset, sort);
    }
  };

  const handleSearch = (filter: string) => {
    if (!isOffline) {
      setApi(apiUrl + filter);
    } else {
      queryDbSearch(filter);
    }
  };

  const handleSort = (sort: string) => {
    switch (sort) {
      case "asc":
        setSort("asc");
        queryDbChangePage(offset, "asc");
        break;
      case "desc":
        setSort("desc");
        queryDbChangePage(offset, "desc");
        break;
      case "none":
        setSort("none");
        queryDbChangePage(offset, "none");
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("online", () => {
      getData(api);
      setOffline(false);
    });
    window.addEventListener("offline", () => {
      setOffline(true);
      queryDbChangePage(0, sort);
    });
  }, []);

  useEffect(() => {
    if (query) {
      setCatalogue(query);
    }
  }, []);

  useEffect(() => {
    getData(api);
  }, [api]);

  return (
    <section
      data-testid="catalogue"
      className="md:mx-16 lg:mx-20 2xl:mx-56 my-6"
    >
      <div className="flex flex-row justify-end">
        <div className="w-full md:w-96">
          <Filter
            onChange={(e: string) => {
              handleSearch(e);
            }}
          ></Filter>
        </div>
        <div className=" flex justify-end">
          <Sort arr={catalogue} onChange={(e: string) => handleSort(e)}></Sort>
        </div>
      </div>
      {catalogue.length > 0 && (
        <div>
          <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
            {catalogue.map((item:any, index:number) => {
              return (
                <Card
                  key={index}
                  data={item}
                  title={item.name }
                  subHeading={item.height}
                  subHeading2={item.birth_year }
                ></Card>
              );
            })}
          </div>

          <div
            className="flex justify-center space-x-8"
            data-testid="catalogue-pagination"
          >
            <button onClick={() => handlePageChange(prevUrl, offset - 10)}>
              Previous
            </button>
            <button onClick={() => handlePageChange(nextUrl, offset + 10)}>
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
export default Catalogue;
