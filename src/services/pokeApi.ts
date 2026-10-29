import type { Pokemon, Evolucao } from "../types/pokemon";

interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  species: { url: string };
}

interface SpeciesApiResponse {
  evolution_chain: { url: string };
}

interface ChainLink {
  species: { name: string; url: string };
  evolves_to: ChainLink[];
}

interface EvolutionChainApiResponse {
  chain: ChainLink;
}

export async function buscarPokemon(nome: string): Promise<Pokemon> {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`);
  if (!resposta.ok) {
    throw new Error("Pokémon não encontrado.");
  }

  const dados = (await resposta.json()) as PokemonApiResponse;

  // Busca dados da espécie para obter a cadeia de evolução
  const respostaEspecie = await fetch(dados.species.url);
  const dadosEspecie = (await respostaEspecie.json()) as SpeciesApiResponse;

  // Busca a cadeia de evolução
  const respostaEvolucao = await fetch(dadosEspecie.evolution_chain.url);
  const dadosEvolucao = (await respostaEvolucao.json()) as EvolutionChainApiResponse;

  // Percorre a cadeia de evolução (limitado à primeira ramificação)
  const nomesEvolucoes: string[] = [];
  let atual: ChainLink | undefined = dadosEvolucao.chain;

  while (atual) {
    nomesEvolucoes.push(atual.species.name);
    atual = atual.evolves_to[0];
  }

  // Busca detalhes de cada evolução em paralelo
  const evolucoes: Evolucao[] = await Promise.all(
    nomesEvolucoes.map(async (nomeEvo) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeEvo}`);
      const data = (await res.json()) as PokemonApiResponse;
      return {
        id: data.id,
        nome: data.name,
        imagem: data.sprites.front_default,
      };
    })
  );

  return {
    id: dados.id,
    nome: dados.name,
    imagem: dados.sprites.front_default,
    altura: dados.height,
    peso: dados.weight,
    evolucoes,
  };
}