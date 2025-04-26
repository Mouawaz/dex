import React, { useState, useEffect, useCallback, useRef } from 'react';
import PokemonCard from './PokemonCard';
import SearchFilterBar from './SearchFilterBar';
import './PokemonList.css';

function PokemonList() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('id-asc');
  
  const limit = 20;
  const loaderRef = useRef(null);
  
  //lore accurate
  const SHINY_CHANCE = 1/4096;
  
  const determineIfShiny = () => {
    return Math.random() < SHINY_CHANCE;
  };
  
  const fetchPokemon = useCallback(async (currentOffset) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`);
      const data = await response.json();


      if (data.results.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const promises = data.results.map(pokemon => 
        fetch(pokemon.url).then(res => res.json())
      );
      
      const pokemonData = await Promise.all(promises);
      
      const formattedData = pokemonData.map(pokemon => {
        const isShiny = determineIfShiny();
        
        return {
          id: pokemon.id,
          name: pokemon.name,
          // Use shiny sprite if determined to be shiny
          image: isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default,
          // Store the alternate version for the detail view
          regularImage: pokemon.sprites.front_default,
          shinyImage: pokemon.sprites.front_shiny,
          types: pokemon.types.map(typeInfo => typeInfo.type.name),
          isShiny: isShiny
        };
      });
      
      setAllPokemon(prev => {
        const newList = currentOffset === 0 ? formattedData : [...prev, ...formattedData];
        return newList;
      });
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);
  
  useEffect(() => {
    if (allPokemon.length > 0) {
      let filtered = [...allPokemon];
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(pokemon => 
          pokemon.name.toLowerCase().includes(searchLower) || 
          pokemon.id.toString().includes(searchLower)
        );
      }
      
      if (typeFilter) {
        filtered = filtered.filter(pokemon => 
          pokemon.types.includes(typeFilter)
        );
      }
      
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'id-asc':
            return a.id - b.id;
          case 'id-desc':
            return b.id - a.id;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return a.id - b.id;
        }
      });
      
      setDisplayedPokemon(filtered);
    }
  }, [allPokemon, searchTerm, typeFilter, sortOption]);
  
  useEffect(() => {
    fetchPokemon(offset);
  }, [offset, fetchPokemon]);

  const loadMorePokemon = () => {
    if (!isLoading && hasMore) {
      setOffset(prev => prev + limit);
    }
  };
  
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };
  
  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
  };
  
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        if (!searchTerm && !typeFilter) {
          loadMorePokemon();
        }
      }
    }, options);
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasMore, searchTerm, typeFilter]);
  
  // Get stats for displayed results
  const resultCount = displayedPokemon.length;
  const shinyCount = displayedPokemon.filter(pokemon => pokemon.isShiny).length;
  
  return (
    <div className="pokemon-container">
      <SearchFilterBar
        onSearchChange={handleSearchChange}
        onTypeFilterChange={handleTypeFilterChange}
        onSortChange={handleSortChange}
      />
      
      {/* Results stats */}
      <div className="results-stats">
        <p>
          Showing {resultCount} Pokémon 
          {searchTerm && <span> matching "{searchTerm}"</span>}
          {typeFilter && <span> of type "{typeFilter}"</span>}
          {shinyCount > 0 && <span> ({shinyCount} shiny)</span>}
        </p>
      </div>
      
      {displayedPokemon.length > 0 ? (
        <div className="pokemon-grid">
          {displayedPokemon.map(pokemon => (
            <PokemonCard 
              key={`${pokemon.id}-${pokemon.isShiny ? 'shiny' : 'regular'}`} 
              pokemon={pokemon}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No Pokémon found matching your criteria</p>
          <button 
            className="clear-filters-button"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('');
              handleSearchChange('');
              handleTypeFilterChange('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
      
      <div ref={loaderRef} className="loader-container">
        {isLoading ? (
          <div className="loader">
            <div className="pokeball"></div>
            <p>Loading Pokémon...</p>
          </div>
        ) : hasMore && !searchTerm && !typeFilter ? (
          <button 
            className="load-more-button"
            onClick={loadMorePokemon}
          >
            Load More Pokémon
          </button>
        ) : (
          searchTerm || typeFilter ? null : <p className="no-more-pokemon">You've caught 'em all!</p>
        )}
      </div>
    </div>
  );
}

export default PokemonList;