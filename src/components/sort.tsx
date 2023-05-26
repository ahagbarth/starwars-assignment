"use client";
import Link from "next/link";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
config.autoAddCss = false;

interface props {
  onChange: () => {};
  arr:{name:string}[];
}

export default function Sort({arr, onChange }: props) {
  const [sort, setSort] = useState("none");
  const [results, setResults] = useState(arr);

  const handleSort = () => {
    switch (sort) {
      case "asc":
        setSort("desc");
        onChange("desc")
        break;
      case "desc":
        setSort("none");
        onChange("none")
        break;
      case "none":
        setSort("asc");
        onChange("asc")
        break;
    }
  };

  return (
    <div className="flex items-center">
      {sort && sort == "none" && (
        <div className="cursor-pointer" onClick={() => handleSort()}>
          <FontAwesomeIcon icon={faSort} className="h-10 w-10" size="xl" />
        </div>
      )}
      {sort && sort == "asc" && (
        <div className="cursor-pointer" onClick={() => handleSort()}>
          <FontAwesomeIcon icon={faSortUp} className="h-10 w-10" size="xl" />
        </div>
      )}
      {sort && sort == "desc" && (
        <div className="cursor-pointer" onClick={() => handleSort()}>
          <FontAwesomeIcon icon={faSortDown} className="h-10 w-10" size="xl" />
        </div>
      )}
    </div>
  );
}
