import { MOVES, Vector2D } from "./helpers";
import type { ProjectMap } from "./projectMap";

export class QLearningAgent {
  // Parâmetros do Q-Learning
  alpha = 0.1; // Taxa de aprendizado
  gamma = 0.9; // Fator de desconto
  explorationRate = 0.3; // Probabilidade de explorar (escolher ação aleatória) - Taxa de exploração - epsilon-greedy
  episodes = 1000; // Número de episódios para treinamento

  // Elementos do DOM para controle
  alphaInput: HTMLInputElement | null = document.getElementById(
    "alphaInput"
  ) as HTMLInputElement | null;
  gammaInput: HTMLInputElement | null = document.getElementById(
    "gammaInput"
  ) as HTMLInputElement | null;
  explorationRateInput: HTMLInputElement | null = document.getElementById(
    "epsilonInput"
  ) as HTMLInputElement | null;
  episodesInput: HTMLInputElement | null = document.getElementById(
    "episodesInput"
  ) as HTMLInputElement | null;

  // Estado do treinamento
  // Tabela Q: armazena o valor de cada ação em cada estado (linha, coluna, ação)
  qTable: number[][][] = [];
  mapRows: number;
  mapCols: number;
  currentMap: number[][] = [];
  projectMap: ProjectMap;

  // Inicializa a tabela Q com zeros para um grid 4x4 e 4 ações possíveis
  constructor(projectMap: ProjectMap) {
    this.mapRows = projectMap.getMapRows();
    this.mapCols = projectMap.getMapCols();
    this.currentMap = projectMap.getMapData();
    this.projectMap = projectMap;
    // Inicializa a tabela Q com zeros
    this.qTable = [];
    for (let row = 0; row < this.mapRows; row++) {
      this.qTable[row] = [];
      for (let col = 0; col < this.mapCols; col++) {
        this.qTable[row][col] = [0, 0, 0, 0]; // [cima, baixo, esquerda, direita]
      }
    }
  }

  init() {
    this.qTable = Array(this.mapRows)
      .fill(0)
      .map(() => Array(this.mapCols).fill(0).map(() => Array(4).fill(0)));
    this.updateTrainingParameters();
  }

  /**
   * Atualiza os parâmetros de treinamento com base nos valores dos inputs.
   */ 
  updateTrainingParameters() {
    if (this.episodesInput && this.episodesInput.value) {
      this.episodes = parseInt(this.episodesInput.value);
    }
    if (this.explorationRateInput && this.explorationRateInput.value) {
      this.explorationRate = parseFloat(this.explorationRateInput.value);
    }
    if (this.alphaInput && this.alphaInput.value) {
      this.alpha = parseFloat(this.alphaInput.value);
    }
    if (this.gammaInput && this.gammaInput.value) {
      this.gamma = parseFloat(this.gammaInput.value);
    }
  }

  /**
   * Obtém a recompensa para uma célula específica do mapa.
   * @param row A linha da célula
   * @param col A coluna da célula
   * @returns O valor da recompensa
   */
  getReward(pos: Vector2D): number {
    if (pos.x < 0 || pos.x >= this.mapRows || pos.y < 0 || pos.y >= this.mapCols) {
      return this.projectMap.REWARD_OUT_OF_BOUNDS;
    }
    const cellValue = this.currentMap[pos.x][pos.y];

    if (cellValue === -1) {
      return this.projectMap.REWARD_OUT_OF_BOUNDS;
    }
    if (cellValue === 100) {
      return this.projectMap.REWARD_TERMINAL;
    } else if (cellValue === -100 || cellValue === -1) {
      return this.projectMap.REWARD_OBSTACLE;
    } else {
      return this.projectMap.REWARD_FREE;
    }
  }

  /**
   * Escolhe uma ação com base na política epsilon-greedy -  Taxa de exploração.
   * @param current A posição atual do agente
   * @returns O índice da ação escolhida
   */
  chooseAction(current: Vector2D): number {
    // Se a ação for aleatória, escolhe uma ação aleatória
    // Caso contrário, escolhe a ação com o maior valor Q
    const random = Math.random();
    if (random < this.explorationRate) {
      return Math.floor(random * MOVES.length);
    } else {
      return this.getMaxQActionIndex(current);
    }
  }

  /**
   * Encontra o índice da ação com maior valor Q para um estado específico.
   * @param current A posição atual do agente
   * @returns O índice da ação com maior valor Q
   */
  getMaxQActionIndex(current: Vector2D): number {
    const qValues = this.qTable[current.x][current.y];
    let maxQ = -Infinity;
    let bestAction = 0;

    for (let i = 0; i < qValues.length; i++) {
      if (qValues[i] > maxQ) {
        maxQ = qValues[i];
        bestAction = i;
      }
    }

    return bestAction;
  }

  /**
   * Atualiza o valor Q para um estado e ação específicos.
   * @param current A posição atual do agente
   * @param actionIndex O índice da ação tomada
   * @param reward A recompensa recebida
   * @param next A posição do próximo estado
   */
  updateQValue(
    current: Vector2D,
    actionIndex: number,
    reward: number,
    next: Vector2D
  ) {
    let maxQNext = 0;
    if (!this.projectMap.isTerminal(next)) {
      maxQNext = Math.max(...this.qTable[next.x][next.y]);
    }

    const currentQValue = this.qTable[current.x][current.y][actionIndex];

    // Fórmula do Q-Learning: Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
    const newQValue = currentQValue +     
      this.alpha * (reward + this.gamma * maxQNext - currentQValue);

    // Salva o novo valor Q na tabela
    this.qTable[current.x][current.y][actionIndex] = newQValue;

    //console.log(`Q[${current.x}, ${current.y}, ${actionIndex}] atualizado: ${currentQValue} → ${newQValue}`);
  }

  getQValueAt(pos: Vector2D, actionIndex: number): number {
    if (pos.x < 0 || pos.x >= this.mapRows || pos.y < 0 || pos.y >= this.mapCols) {
      return 0; // Fora dos limites do mapa
    }
    return this.qTable[pos.x][pos.y][actionIndex];
  }
}
