import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import './App.css';

// No LLM has been hurt in the making of this app (Threatened? Different story)

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Pokédex</h1>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
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