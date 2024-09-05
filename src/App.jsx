import React, { useState, useEffect } from "react";
import axios from "axios";


const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (!name) return;

    const fetchCountry = async () => {
      try {
        console.log(`Fetching country data for: ${name}`);
        const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`);
        console.log('API response:', response.data);
        console.log('API response name:', response.data.name);
        console.log('API response name common:', response.data.name.common);
        setCountry({ data: response.data, found: true });
      } catch (error) {
        console.error('Error fetching country data:', error);
        setCountry({ found: false });
      }
    };
    fetchCountry();
  }, [name]);
  return country;
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }
  if (!country.data) return <div>No country data...</div>

  // destructuring the needed data from country.data
  const { name, capital, population, flags } = country.data;

  return (
    <div>
      <h3>{name.common} </h3>
      <div>capital {capital} </div>
      <div>population {population}</div>
      <img
        src={flags.png}
        height="100"
        alt={`flag of ${country.data.name.common}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
