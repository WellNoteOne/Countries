import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

  useEffect(() => {
    axios.get(baseUrl).then((response) => {
      console.log("Answer from server: ", response.status);
      console.log("All data :", response.data);
      setCountries(response.data);
    });
  }, []);

  const handleGettingData = (event) => {
    event.preventDefault();
    setShowFiltered(true);
  };

  const check = () => {
    if (setSearch("")) {
      setShowFiltered(!showFiltered);
    }
  };
  const handleShowAll = () => {
    setSearch("");
    setShowFiltered(true);
    countries.map((country) => (
      <li key={country.name.common}>
        {country.name.common} - {country.name.official}
      </li>
    ));
  };

  const CountryMaps = ({ country }) => {
    if (!country.latlng || country.latlng.length < 2)
      return <p>No location data available</p>;

    const lat = country.capitalInfo.latlng[0];
    const lng = country.capitalInfo.latlng[1];
    const delta = 0.1;

    const bbox = {
      left: lng - delta,
      bottom: lat - delta,
      right: lng + delta,
      top: lat + delta,
    };

    console.log("lat:", lat, "lng:", lng);
    return (
      <div>
        <iframe
          className="map"
          width="400"
          height="300"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}&layer=mapnik&marker=${lat},${lng}`}
        />
      </div>
    );
  };

  const filteredCountries = countries
    .filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.common.localeCompare(b.name.common));

  const CountriesList = ({ countries }) => {
    if (filteredCountries.length === 0) {
      return <li>No matches found.</li>;
    } else if (filteredCountries.length === 1) {
      console.log("-----------------------");
      console.log("Name of country:", countries[0].name.common);
      console.log("Capital:", countries[0].capital[0]);
      return (
        <div className="countryCard">
          <p className="nameOfCountry">{countries[0].name.common}</p>
          <p>Capital of country: {countries[0].capital}</p>
          <p>
            <strong>Flag of country:</strong>
            <br />
            <img
              src={countries[0].flags.svg}
              alt={`Flag of ${countries[0].name.common}`}
              width="300"
            />
          </p>{" "}
          <p>Weather : {countries[0]}</p>
          <p>
            Language(s): {Object.values(countries[0].languages).join(", ")}
          </p>{" "}
          <h3>Mini Map (OpenStreetMap)</h3>
          <CountryMaps country={countries[0]} />
        </div>
      );
    } else {
      return (
        console.log("Value of data: ", filteredCountries.length),
        (
          <>
            {countries.map((country) => (
              <li key={country.name.common}>
                {country.name.common} - {country.name.official}
              </li>
            ))}
          </>
        )
      );
    }
  };

  return (
    <>
      <h1>Countries</h1>
      <form onSubmit={handleGettingData}>
        <div className="card">Start typing for finding country</div>
        <br />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            handleGettingData;
            setSearch(e.target.value);
            setShowFiltered(true);
          }}
          placeholder="Write name of country"
        />
        <button
          className="buttonhide"
          type="button"
          onClick={() => {
            setShowFiltered(!showFiltered);

            handleShowAll;
          }}
        >
          {showFiltered ? "Hide" : "Show"} all
        </button>
      </form>
      <ul>{showFiltered && <CountriesList countries={filteredCountries} />}</ul>
    </>
  );
}

export default App;
