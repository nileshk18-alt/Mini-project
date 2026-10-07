import { useState } from "react";
import SearchBox from "./searchBox";
import InfoBox from "./InfoBox";

export default function WheatherApp() {
  const [wheatherInfo, setWheatherInfo] = useState({
    city: "Delhi",
    Wheather: "few clouds",
    feelsLike: 35.93,
    humidity: 74,
    temp: 29.96,
    tempMax: 30.05,
    tempMin: 29.96,
  });

  const updateInfo = (newinfo) => {
    setWheatherInfo(newinfo);
  };

  return (
    <main className="weather-app-shell">
      <header className="app-topbar">
        <div className="app-brand">
          <span className="brand-mark">☁</span>
          <span>Weatherly</span>
        </div>
        <div className="topbar-caption">Live weather dashboard</div>
      </header>

      <section className="dashboard-heading">
        <div>
          <span className="eyebrow">TODAY'S WEATHER</span>
          <h1>Know your sky.</h1>
          <p>Search any city and get the latest conditions at a glance.</p>
        </div>
        <div className="heading-cloud" aria-hidden="true">☁︎</div>
      </section>

      <SearchBox updateInfo={updateInfo} />
      <InfoBox info={wheatherInfo} />
    </main>
  );
}
