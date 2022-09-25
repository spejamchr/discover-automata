import { Translations } from '../Types';

// prettier-ignore
//
// Formatting:
// - Each key/value entry should be on the same line
// - Use "double quotes" around keys & values
// - Sort entries alphabetically
// - Use a comma on the last line
export const pt: Translations = {
  "(Clicking the rule changes the resulting state.)": "(Clicar na regra altera o estado resultante.)",
  "(First generation)": "(Primeira geração)",
  "(Next generation)": "(Próxima geração)",
  "A simple example of a neighborhood is the current cell and [...]": "Um exemplo simples de vizinhança é a célula atual e seus dois vizinhos imediatos, como:",
  "A weather simulation can be used for predictions, but [...]": "Uma simulação meteorológica pode ser usada para previsões, mas não corresponde perfeitamente à realidade.",
  "Cellular automata are a kind of zero-player game [...]": "Autômatos celulares são uma espécie de jogo de zero jogadores jogado em um \"universo\" de \"células\" ladrilhadas. Cada autômato tem sua própria configuração, e pode evoluir um universo através de muitas gerações. O autômato celular mais conhecido é provavelmente o <link>Jogo da Vida de Conway</link>.",
  "Configuration": "Configuração",
  "Discover Automata": "Descubra autômatos",
  "Displaying in color": "Exibindo em cores",
  "Displaying in grayscale": "Exibindo em escala de cinza",
  "Each cell in a cellular automata can be in one of several [...]": "Cada célula em um autômato celular pode estar em um dos vários estados, na maioria das vezes representado como um número (como 0 ou 1) ou uma cor (como preto ou branco).",
  "Emulate 1D cellular automata in the browser": "Emular autômatos celulares 1D no navegador",
  "Emulator": "Emulador",
  "Go here to use the emulator.": "Acesse aqui para usar o emulador.",
  "Hiding state labels": "Ocultando rótulos de estado",
  "I called this an \"emulator\" instead of a \"simulator,\" [...]": "Chamei isso de \"emulador\" em vez de \"simulador\", porque os simuladores tendem a aproximar a coisa que simula, enquanto o objetivo de um emulador é recriar exatamente o comportamento da coisa que eles emulam.",
  "I wanted to make some fun designs, and had just read about [...]": "Eu queria fazer alguns designs divertidos, e tinha acabado de ler sobre autômatos celulares unidimensionais, então este site nasceu.",
  "In general, there are <link>many, many types of [...]": "Em geral, existem <link>muitos, muitos tipos de vizinhanças</link> que podem ser usados para criar autômatos celulares (incluindo vizinhanças que podem mudar com o tempo). No entanto, as vizinhanças usadas neste site são limitadas a uma seleção da célula atual e vários de seus vizinhos mais próximos de cada lado.",
  "In this simulation, you can set the number of states the [...]": "Nesta simulação, você pode definir o número de estados que o autômato celular possui. Você também pode escolher se a simulação desenha os estados usando tons de cinza ou cores, e se os rótulos dos números são mostrados ou ocultados.",
  "Neighbors": "Vizinhos",
  "Once the automaton is configured, this site emulates it by [...]": "Uma vez que o autômato é configurado, este site o emula gerando uma geração inicial aleatória e então desenhando muitas gerações filhas.",
  "Once the number of states and the neighborhood [...]": "Uma vez selecionado o número de estados e a vizinhança, as regras de transição devem ser determinadas. Para cada combinação possível de estados na vizinhança dada, os estados resultantes devem ser escolhidos. Como exemplo, aqui está a regra de transição dizendo que, se todos os vizinhos de uma célula forem <tag>0</tag>, a célula deve se tornar {{nextState}}:",
  "One-dimensional Cellular Automata": "Autômatos Celulares Unidimensionais",
  "One-dimensional cellular automata (1DCA) are a kind of [...]": "Autômatos celulares unidimensionais (AC1D) são um tipo de autômatos celulares onde o ladrilho é 1D; podemos pensar nisso como uma linha de quadrados. Isso torna as muitas gerações de um AC1D fáceis de desenhar: podemos desenhar todas as linhas de geração uma após a outra para formar um retângulo.",
  "Overflow Error: please use smaller numbers": "Erro de estouro: use números menores",
  "Randomize": "Randomize",
  "Read on, or skip straight to <link>the emulator</link>.": "Continue lendo ou pule direto para <link>o emulador</link>.",
  "Rule Number": "Número da regra",
  "Showing state labels": "Mostrando rótulos de estado",
  "States": "Estados",
  "These transition rules can be encoded as a single number, [...]": "Essas regras de transição podem ser codificadas como um único número, o \"número da regra\", que também pode ser usado para alterar as regras de transição.",
  "This representation of the transition rules as a [...]": "Esta representação das regras de transição como um \"número da regra\" usa o <link>Código Wolfram</link>.",
  "To define a 1DCA we need to know three things: the number [...]": "Para definir um AC1D, precisamos saber três coisas: o número de estados a serem usados, quais vizinhos considerar ao calcular a próxima geração e as regras de transição para decidir para qual estado uma célula evoluirá (com base nos estados de seus vizinhos).",
  "Transition Rules": "Regras de Transição",
  "What's this all about?": "O que é isso tudo?",
  "When using a (good) video game emulator, the video game [...]": "Ao usar um (bom) emulador de videogame, o videogame não sabe que está sendo executado em um emulador, porque o emulador se comporta exatamente como o sistema que está emulando.",
  "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life": "https://pt.wikipedia.org/wiki/Jogo_da_vida",
  "maximum digits:": "dígitos máximos:",
  "native-locale-name": "Português",
};
