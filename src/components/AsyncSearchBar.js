import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { makeHeader } from "../actions/TripActions";

const AsyncSearchBar = ({ setCollabs, collabs }) => {
  //set default query terms
  const [query, setQuery] = useState("");

  //get animated components wrapper
  const animatedComponents = makeAnimated();

  const loadOptions = () => {
    const headers = makeHeader();
    return fetch(`http://localhost:3000/collabs?q=${query}`, {
      method: "GET",
      headers,
    }).then((res) => res.json());
  };

  // handle input change event
  const handleInputChange = (value) => {
    setQuery(value);
  };

  return (
    <>
      <AsyncSelect
        cacheOptions
        value={collabs}
        isMulti
        components={animatedComponents}
        getOptionLabel={(e) => e.user_name}
        getOptionValue={(e) => e.id}
        loadOptions={loadOptions}
        defualtOptions
        onInputChange={(value) => setQuery(value)}
        onChange={(value) => setCollabs(value)}
      />
    </>
  );
};

export default AsyncSearchBar;
