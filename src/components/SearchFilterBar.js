import React, { useState } from "react";
import "./SearchFilterBar.css";


const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

function SearchFilterBar({ onSearchChange, onTypeFilterChange, onSortChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("");
  const [sortOption, setSortOption] = useState("id-asc");


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };


  const handleTypeFilter = (type) => {
    const newType = type === activeType ? "" : type;
    setActiveType(newType);
    onTypeFilterChange(newType);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    onSortChange(value);
  };

  const getTypeColor = (type) => {
    const typeColors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };

    return typeColors[type] || "#777777";
  };

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <input
          type="text"
          aria-label="Search Pokémon"
          placeholder="Search Pokémon by name or number..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="clear-search"
          onClick={() => {
            setSearchTerm("");
            onSearchChange("");
          }}
        >
          {searchTerm && "×"}
        </button>
      </div>

      <div className="filters-container">
        <div className="filter-section">
          <h3>Filter by Type</h3>
          <div className="type-filters">
            {POKEMON_TYPES.map((type) => (
              <button
                key={type}
                className={`type-filter-btn ${
                  activeType === type ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    activeType === type ? getTypeColor(type) : "transparent",
                  borderColor: getTypeColor(type),
                  color: activeType === type ? "white" : getTypeColor(type),
                }}
                onClick={() => handleTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-section">
          <h3>Sort By</h3>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="id-asc">ID (Lowest to Highest)</option>
            <option value="id-desc">ID (Highest to Lowest)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;
