import { useEffect, useState } from 'react';
import RelicList from './assets/RelicList';

function App() {
  const [relicData, setRelicData] = useState({});

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setRelicData(data));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Available Warframe Relics</h1>
      <RelicList relics={relicData} />
    </div>
  );
}

export default App;
