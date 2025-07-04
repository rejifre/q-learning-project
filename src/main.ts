import { QLearningAgent } from "./core/qLearningAgent";
import { MOVES, Vector2D } from "./core/helpers";
import { ProjectMap } from "./core/projectMap";
import { TableLearning } from "./core/tableLearning";

class QLearningApp {
  #qlearningAgent: QLearningAgent;
  #projectMap: ProjectMap;
  isTraining = false;
  trainingInterval: number = 0;
  episodeCounter: number = 0;
  trainButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  startPoint = new Vector2D(9, 4); // Ponto de partida fixo
  table: TableLearning;
  agentPositionElement: HTMLElement;
  agentNextPositionElement: HTMLElement;
  agentRewardElement: HTMLElement;
  directionElement: HTMLElement;

  constructor() {
    // Inicializa o mapa do projeto
    this.#projectMap = new ProjectMap();
    // Inicializa o agente de Q-Learning com o mapa do projeto
    this.#qlearningAgent = new QLearningAgent(this.#projectMap);
    this.trainButton = document.getElementById(
      "trainButton"
    ) as HTMLButtonElement;
    this.resetButton = document.getElementById(
      "resetButton"
    ) as HTMLButtonElement;
    this.agentPositionElement = document.getElementById("agent-position")!;
    this.agentNextPositionElement = document.getElementById("agent-next-position")!;
    this.agentRewardElement = document.getElementById("agent-reward")!;
    this.directionElement = document.getElementById("agent-direction")!;

    this.#setupEventListeners();

    this.#projectMap.renderMap(this.startPoint);
    this.table = new TableLearning(this.#projectMap.getTableList());
    this.table.createTable(); // Cria a tabela Q no DOM
  }

  /**
   * Configura os ouvintes de eventos para os botões de treinamento e reinicialização.
   */
  #setupEventListeners() {
    this.trainButton.addEventListener("click", () => this.startTraining());
    this.resetButton.addEventListener("click", () => this.pauseTraining());
  }

  /**
   * Inicializa a tabela Q e os parâmetros de treinamento.
   */
  startTraining() {
    if (this.isTraining) return;

    this.#qlearningAgent.init(); // Reinicializa a tabela Q
    this.#initializeTraining();
    this.trainingInterval = setInterval(() => this.#runEpisode(), 10);
  }

  pauseTraining() {
    if (this.trainingInterval) {
      clearInterval(this.trainingInterval);
    }
    this.isTraining = false;
    this.trainButton.textContent = "Iniciar Treinamento";
    this.trainButton.disabled = false;
    this.#projectMap.renderMap(this.startPoint);
    this.episodeCounter = 0;
  }

  resetTraining() {
    if (this.trainingInterval) {
      clearInterval(this.trainingInterval);
    }
    this.isTraining = false;
    this.trainButton.textContent = "Iniciar Treinamento";
    this.trainButton.disabled = false;
    this.resetButton.disabled = true;
    this.#qlearningAgent.init(); // Reinicializa a tabela Q
    this.#projectMap.renderMap(this.startPoint);
    this.episodeCounter = 0;
  }

  /**
   * Inicializa o treinamento, renderizando o mapa e configurando o estado inicial.
   */
  #initializeTraining() {
    this.#projectMap.renderMap(this.startPoint);
    this.episodeCounter = 0;
    this.isTraining = true;

    this.trainButton.textContent = "Treinando...";
    this.trainButton.disabled = true;
  }

  /**
   * Executa um episódio de treinamento.
   * @returns Retorna o agente de Q-Learning.
   */
  #runEpisode() {
    if (this.episodeCounter >= this.#qlearningAgent.episodes) {
      this.#finishTraining();
      return;
    }
    // Reinicia o episódio com o ponto de partida fixo
    this.#executeEpisode(this.startPoint);
    this.episodeCounter++;
  }

  /**
   * Renderiza a tabela Q no DOM.
   */
  #finishTraining() {
    if (this.trainingInterval) {
      clearInterval(this.trainingInterval);
    }
    this.isTraining = false;
    this.trainButton.textContent = "Treinamento Concluído!";
    this.trainButton.disabled = false;
    this.resetButton.disabled = false;
    console.log("Treinamento Q-learning concluído!");

    const learnedPath = this.#getLearnedPath(this.startPoint);
    this.#projectMap.renderMap(this.startPoint, learnedPath);
  }

  /**
   * Executa um episódio de treinamento.
   */
  #executeEpisode(pos: Vector2D) {
    let current: Vector2D = pos.clone();
    let steps = 0;
    const maxSteps = this.#projectMap.getMapRows() * this.#projectMap.getMapCols() * 2;

    while (!this.#projectMap.isTerminal(current) && steps < maxSteps) {
      const actionIndex = this.#qlearningAgent.chooseAction(current);
      const nextPos = this.#getNextPosition(current, actionIndex);
      const reward = this.#qlearningAgent.getReward(nextPos);

      this.#qlearningAgent.updateQValue(current, actionIndex, reward, nextPos);
      this.table.updateTableByPosition(current, this.#qlearningAgent.getQValueAt(current, actionIndex), actionIndex);

      this.#updateInfo(current, nextPos, reward, actionIndex);

       this.#projectMap.renderMap(this.startPoint, [current]); // Atualiza o mapa com a posição atual

      // Se bateu em obstáculo ou saiu do mapa, termina o episódio
      if (
        reward === this.#projectMap.REWARD_OBSTACLE ||
        reward === this.#projectMap.REWARD_OUT_OF_BOUNDS
      ) {
        break;
      }

      // Se chegou ao objetivo, termina o episódio
      if (reward === this.#projectMap.REWARD_TERMINAL) {
        break;
      }

      current = nextPos.clone();
      steps++;
    }
  }

  #getNextPosition(current: Vector2D, actionIndex: number): Vector2D {
    const [dr, dc] = MOVES[actionIndex];
    return new Vector2D(current.x + dr, current.y + dc);
  }


  #getLearnedPath(start: Vector2D): Vector2D[] {
    let path: Vector2D[] = [start.clone()];
    let current = start.clone();
    let steps = 0;
    const maxSteps = 100;

    while (!this.#projectMap.isTerminal(current) && steps < maxSteps) {
      // Usa o método já existente para encontrar a melhor ação
      const bestActionIndex = this.#qlearningAgent.getMaxQActionIndex(current);
      const next = this.#getNextPosition(current, bestActionIndex);

      // Se a próxima posição é terminal, verifica se é o objetivo
      if (this.#projectMap.isTerminal(next)) {
        if (this.#projectMap.getValueAt(next) === this.#projectMap.REWARD_TERMINAL) {
          path.push(next.clone()); // Adiciona o objetivo ao caminho
        }
        break;
      }

      current = next.clone();
      path.push(current.clone());
      steps++;
    }

    return path;
  }

  #updateInfo(current: Vector2D, next: Vector2D, reward: number, direction: number = 0) {
    this.agentPositionElement.textContent = `(${current.x}, ${current.y})`;
    this.agentNextPositionElement.textContent = `(${next.x}, ${next.y})`;
    this.agentRewardElement.textContent = `${reward}`;
    this.directionElement.textContent = `Direção: ${MOVES[direction].join(", ")}`;
    const value = `Ação: ${direction}, Posição Atual: (${current.x}, ${current.y}), Próxima Posição: (${next.x}, ${next.y}), Recompensa: ${reward}`;
    console.log(value); // Log para depuração
  }
}

// Inicialização da aplicação
new QLearningApp();
