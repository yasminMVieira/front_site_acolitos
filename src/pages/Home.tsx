import React from 'react';
import Welcome from '../components/Welcome';

const Home: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Welcome />
    </div>
  );
}

export default Home;
