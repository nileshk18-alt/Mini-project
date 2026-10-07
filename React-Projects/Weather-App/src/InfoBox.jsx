import Card from "@mui/material/Card";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SunnyIcon from "@mui/icons-material/Sunny";
import CloudIcon from "@mui/icons-material/Cloud";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./infoBox.css";

const WEATHER_IMAGES = {
  clear: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85",
  clouds: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1400&q=85",
  rain: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1400&q=85",
  thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1400&q=85",
  snow: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1400&q=85",
  mist: "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1400&q=85",
  hot: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
};

const getWeatherType = (description = "") => {
  const text = description.toLowerCase();
  if (text.includes("thunder")) return "thunderstorm";
  if (text.includes("snow") || text.includes("sleet")) return "snow";
  if (text.includes("rain") || text.includes("drizzle")) return "rain";
  if (text.includes("mist") || text.includes("fog") || text.includes("haze") || text.includes("smoke")) return "mist";
  if (text.includes("cloud")) return "clouds";
  if (text.includes("clear")) return "clear";
  return "hot";
};

const getWeatherIcon = (type) => {
  if (type === "thunderstorm") return <ThunderstormIcon />;
  if (type === "snow") return <AcUnitIcon />;
  if (type === "rain") return <WaterDropIcon />;
  if (type === "clouds" || type === "mist") return <CloudIcon />;
  return <SunnyIcon />;
};

export default function InfoBox({ info }) {
  const weatherType = getWeatherType(info.Wheather);
  const image = WEATHER_IMAGES[weatherType];

  return (
    <section className={`weather-result weather-${weatherType}`}>
      <Card className="weather-card">
        <div className="weather-visual" style={{ backgroundImage: `url(${image})` }}>
          <div className="visual-overlay" />
          <div className="visual-topline">
            <span className="condition-chip">{info.Wheather}</span>
            <span className="live-chip"><span /> Live</span>
          </div>
          <div className="visual-bottom">
            <div>
              <div className="location-line">
                <LocationOnIcon />
                <span>{info.city}</span>
              </div>
              <p>Current conditions</p>
            </div>
            <div className="visual-icon">{getWeatherIcon(weatherType)}</div>
          </div>
        </div>

        <div className="weather-card-content">
          <div className="temperature-row">
            <div>
              <span className="temperature">{Math.round(info.temp)}°</span>
              <span className="temperature-unit">C</span>
            </div>
            <div className="condition-copy">
              <strong>{info.Wheather}</strong>
              <span>Feels like {info.feelsLike}°C</span>
            </div>
          </div>

          <div className="weather-divider" />

          <div className="weather-details">
            <div className="weather-detail">
              <div className="detail-icon"><ThermostatIcon /></div>
              <div><span>High</span><strong>{info.tempMax}°C</strong></div>
            </div>
            <div className="weather-detail">
              <div className="detail-icon"><ThermostatIcon /></div>
              <div><span>Low</span><strong>{info.tempMin}°C</strong></div>
            </div>
            <div className="weather-detail">
              <div className="detail-icon"><WaterDropIcon /></div>
              <div><span>Humidity</span><strong>{info.humidity}%</strong></div>
            </div>
            <div className="weather-detail">
              <div className="detail-icon"><AirIcon /></div>
              <div><span>Atmosphere</span><strong>Stable</strong></div>
            </div>
          </div>

          <div className="weather-footer">
            <span><VisibilityIcon /> Weather conditions update with your search.</span>
            <span className="weather-status">● Updated</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
