import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './PokemonDetail.css';

function PokemonDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Check if we received a shiny state from navigation
  const initialShinyState = location.state?.pokemon?.isShiny || false;
  const [isShiny, setIsShiny] = useState(initialShinyState);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        
        if (!response.ok) {
          throw new Error('Pokémon not found');
        }
        
        const data = await response.json();
        
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        
        // Find English flavor text avoiding duplicate pokemans 
        const englishFlavorText = speciesData.flavor_text_entries.find(
          entry => entry.language.name === 'en'
        )?.flavor_text || 'No description available';
        
        setPokemon({
          id: data.id,
          name: data.name,
          regularImage: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          shinyImage: data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny,
          types: data.types.map(typeInfo => typeInfo.type.name),
          height: data.height / 10, // Convert to meters 
          weight: data.weight / 10, // Convert to kg
          abilities: data.abilities.map(ability => ability.ability.name),
          stats: data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat
          })),
          description: englishFlavorText.replace(/\f/g, ' ')
        });
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        setError('Failed to load Pokémon details');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  // Toggle between regular and shiny forms
  const toggleShiny = () => {
    setIsShiny(prev => !prev);
  };

  if (loading) {
    return <div className="pokemon-detail-loading">Loading Pokémon data...</div>;
  }

  if (error) {
    return <div className="pokemon-detail-error">{error}</div>;
  }

  if (!pokemon) {
    return <div className="pokemon-detail-error">Pokémon not found</div>;
  }

  // Helper function to get type color ( yes i know this is a duplicate but i am lazy )
  // and i am not going to refactor this code to use a context or something like that (funny suggested line from copilot << imagine the training data >>)
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
    <div className="pokemon-detail-container">
      <Link to="/" className="back-button">← Back to Pokémon List</Link>
      
      <div className={`pokemon-detail-card ${isShiny ? 'shiny-detail' : ''}`}>
        <div className="pokemon-detail-header">
          <h1>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            {isShiny && <span className="detail-shiny-badge">★ Shiny</span>}
          </h1>
          <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>
        
        <div className="pokemon-detail-content">
          <div className="pokemon-detail-image-container">
            <img 
              src={isShiny ? pokemon.shinyImage : pokemon.regularImage} 
              alt={`${isShiny ? 'Shiny ' : ''}${pokemon.name}`} 
              className="pokemon-detail-image"
            />
            
            <button 
              className={`toggle-shiny-button ${isShiny ? 'active' : ''}`} 
              onClick={toggleShiny}
            >
              {isShiny ? 'View Regular Form' : 'View Shiny Form'}
            </button>
            
            <div className="pokemon-types">
              {pokemon.types.map(type => (
                <span 
                  key={type} 
                  className="pokemon-type"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pokemon-detail-info">
            <p className="pokemon-description">{pokemon.description}</p>
            
            <div className="pokemon-attributes">
              <div className="pokemon-attribute">
                <h3>Height</h3>
                <p>{pokemon.height} m</p>
              </div>
              
              <div className="pokemon-attribute">
                <h3>Weight</h3>
                <p>{pokemon.weight} kg</p>
              </div>
            </div>
            
            <div className="pokemon-abilities">
              <h3>Abilities</h3>
              <ul>
                {pokemon.abilities.map(ability => (
                  <li key={ability}>
                    {ability.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pokemon-stats">
              <h3>Base Stats</h3>
              {pokemon.stats.map(stat => (
                <div key={stat.name} className="stat-row">
                  <span className="stat-name">
                    {stat.name === 'hp' ? 'HP' : 
                     stat.name === 'attack' ? 'Attack' :
                     stat.name === 'defense' ? 'Defense' :
                     stat.name === 'special-attack' ? 'Sp. Atk' :
                     stat.name === 'special-defense' ? 'Sp. Def' :
                     stat.name === 'speed' ? 'Speed' : stat.name}
                  </span>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar" 
                      style={{ 
                        width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                        backgroundColor: stat.value < 50 ? '#ff7675' : 
                                         stat.value < 100 ? '#fdcb6e' : '#00b894'
                      }}
                    ></div>
                  </div>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
            
            <div className="pokemon-rarity">
              <h3>Shiny Rarity</h3>
              <p>The chance of encountering a shiny Pokémon is 1/4096 (0.024%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;