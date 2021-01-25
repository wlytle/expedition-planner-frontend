import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { makeHeader } from "../actions/TripActions";

const AsyncSearchBar = ({ setCollabs }) => {
  //set default query terms
  const [query, setQuery] = useState("");

  //get animated components wrapper
  const animatedComponents = makeAnimated();

  // fetch filteres search results for dropdown
  const loadOptions = () => {
    const headers = makeHeader();
    return fetch(`http://localhost:3000/collabs?q=${query}`, {
      method: "GET",
      headers,
    }).then((res) => res.json());
  };

  return (
    <>
      <AsyncSelect
        cacheOptions
        // value={collabs}
        isMulti
        components={animatedComponents}
        getOptionLabel={(e) => e.user_name}
        getOptionValue={(e) => e.id}
        loadOptions={loadOptions}
        onInputChange={(value) => setQuery(value)}
        onChange={(value) => setCollabs(value)}
      />
    </>
  );
};

export default AsyncSearchBar;
