// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import PokemonCard from "./components/PokemonCard";
import EvolutionChain from "./components/EvolutionChain";
import { buscarPokemon } from "./services/pokeApi";
import type { Pokemon } from "./types/pokemon";
import "./App.css";

export default function App() {
  const [termo, setTermo] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!termo) return;

    let ativo = true;

    const carregarPokemon = async () => {
      setCarregando(true);
      setErro("");
      setPokemon(null);

      try {
        const dados = await buscarPokemon(termo);
        if (ativo) {
          setPokemon(dados);
        }
      } catch (err: any) {
        if (ativo) {
          setErro(err.message || "Erro ao buscar Pokémon.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarPokemon();

    return () => {
      ativo = false;
    };
  }, [termo]);

  return (
    <div className="app">
      <h1>Pokédex</h1>
      <SearchBar onBuscar={(t) => setTermo(t)} />

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {pokemon && (
        <>
          <PokemonCard pokemon={pokemon} />
          <EvolutionChain evolucoes={pokemon.evolucoes} />
        </>
      )}
    </div>
  );
}