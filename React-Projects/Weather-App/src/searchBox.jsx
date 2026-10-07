import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import "./SearchBox.css";

export default function SearchBox({ updateInfo }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState(false);

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "190f7291e9c75b6d8584d843e03e2f03";

  const getWheatherInfo = async () => {
    const response = await fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const jsonResponse = await response.json();

    return {
      city: city,
      temp: jsonResponse.main.temp,
      tempMin: jsonResponse.main.temp_min,
      tempMax: jsonResponse.main.temp_max,
      humidity: jsonResponse.main.humidity,
      feelsLike: jsonResponse.main.feels_like,
      Wheather: jsonResponse.weather[0].description,
    };
  };

  const handleChange = (e) => {
    setCity(e.target.value);
    if (error) setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      const newinfo = await getWheatherInfo();
      updateInfo(newinfo);
      setCity("");
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <section className="search-area">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrap">
          <SearchIcon className="search-icon" />
          <TextField
            className="city-input"
            fullWidth
            id="City"
            placeholder="Search city..."
            variant="standard"
            value={city}
            onChange={handleChange}
            InputProps={{ disableUnderline: true }}
          />
        </div>
        <Button
          className="search-button"
          variant="contained"
          type="submit"
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </form>
      {error && <p className="search-error">We couldn't find that city. Try another name.</p>}
    </section>
  );
}
