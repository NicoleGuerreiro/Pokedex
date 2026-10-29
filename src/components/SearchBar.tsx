import { useState, type FormEvent } from "react";

interface SearchBarProps {
  onBuscar: (termo: string) => void;
}

export default function SearchBar({ onBuscar }: SearchBarProps) {
  const [valor, setValor] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (valor.trim()) {
      onBuscar(valor.toLowerCase().trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite o nome do Pokémon..."
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}