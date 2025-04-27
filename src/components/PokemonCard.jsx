import React from 'react';
import { Link } from 'react-router-dom';
import './PokemonCard.css';

function PokemonCard({ pokemon }) {// chatgpt suggested colors 
  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    
    return typeColors[type] || '#777777';
  };

  return (
    <Link to={`/pokemon/${pokemon.id}`} state={{ pokemon }} className="pokemon-card-link">
      <div className={`pokemon-card ${pokemon.isShiny ? 'shiny-pokemon' : ''}`}>
        <div className="pokemon-number">#{pokemon.id.toString().padStart(3, '0')}</div>
        
        {pokemon.isShiny && (
          <div className="shiny-badge">
            <span className="shiny-star">★</span>
            <span className="shiny-text">Shiny</span>
          </div>
        )}
        
        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          className="pokemon-image"
          loading="lazy" // Lazy loading for lighthouse improvement
        />
        <h2 className="pokemon-name">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h2>
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span 
              key={type} 
              className="type-badge"
              style={{ backgroundColor: getTypeColor(type) }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default PokemonCard;