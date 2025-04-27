import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <Link to="/" className="back-button">← Back to Pokédex</Link>
      
      <div className="about-content">
        <h1>About this Pokédex</h1>
        
        <section className="about-section">
          <h2>Project Information</h2>
          <p>
            This Pokédex web application was built using React and Vite. 
            It fetches data from the PokéAPI to display information about various Pokémon species.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul>
            <li>Browse through the Pokémon catalog</li>
            <li>Search Pokémon by name or number</li>
            <li>Filter Pokémon by type</li>
            <li>View detailed information about each Pokémon</li>
            <li>Toggle between regular and shiny forms</li>
            <li>Responsive design for mobile and desktop</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Technologies Used</h2>
          <ul>
            <li>React</li>
            <li>React Router</li>
            <li>Vite</li>
            <li>CSS</li>
            <li>PokéAPI</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Credits</h2>
          <p>
            Pokémon data is provided by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a>.
          </p>
          <p>
            Pokémon and all respective names are trademark and © of Nintendo 1996-2023.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;