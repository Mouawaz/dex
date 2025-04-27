import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import About from './components/About';
import './App.css';

// No LLM has been hurt in the making of this app (Threatened? Different story)

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Pokédex</h1>
          <Link to="/about" className="about-link">About</Link>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>Pokémon data from <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;