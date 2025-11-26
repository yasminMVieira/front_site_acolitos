import React, { useEffect, useState } from 'react';

const Welcome: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = "Bem-vindo(a), Acólito(a)!";

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(intervalId);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const features = [
    {
      icon: 'pi pi-user-plus',
      title: 'Cadastro',
      description: 'Registre-se como acólito'
    },
    {
      icon: 'pi pi-gift',
      title: 'Aniversários',
      description: 'Veja os aniversariantes'
    },
    {
      icon: 'pi pi-heart',
      title: 'Comunidade',
      description: 'Faça parte do grupo'
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-r from-accent/30 to-primary/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
        {/* Logo with Glow Effect */}
        <div className="mb-6 animate-pulse-glow rounded-full p-2">
          <img
            src={`${process.env.PUBLIC_URL}/logo_acolito.png`}
            alt="Logo Acólitos"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>

        {/* Typing Effect Title */}
        <div className="glass-card mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-glow">
            <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              {text}
            </span>
            <span className="animate-pulse">|</span>
          </h1>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card text-center hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-primary/20"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <i className={`${feature.icon} text-2xl md:text-3xl text-white`}></i>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Welcome;