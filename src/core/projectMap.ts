import type { Vector2D } from "./helpers";

export interface IItemMap {
  id: string;
  numberId: string;
  row: number;
  col: number;
  value: number;
  actionTo?: string;
  actionToText?: string;
  qValue?: number[];
  reward?: number;
}

export interface MappedCell {
  id: string;
  numberId: string;
  row: number;
  col: number;
  value: number;
}

export class ProjectMap {
  #mapData: number[][];
  #mapList: string[] = [];
  #container: HTMLElement;

  // Constantes de recompensas
  readonly REWARD_OBSTACLE = -100;
  readonly REWARD_TERMINAL = 100;
  readonly REWARD_OUT_OF_BOUNDS = -200;
  readonly REWARD_FREE = -1;

  constructor() {
    const container = document.getElementById("map-container");

    if (!container) {
      throw new Error("Element with id 'map-container' not found.");
    }

    this.#container = container;
    this.#mapData = this.#originalMap();
  }

  #originalMap() {
    // Representação do mapa em uma matriz 2D (Array de Arrays)
    // 0: Nó livre (célula vazia)
    // 1: Obstáculo
    // 2: Estado Inicial
    // 3: Terminal
    // -1: Célula que não faz parte do mapa
    return [
      [1, 1, 1, 1, -100, 1, 1, 1, 1, 1, 1, -100],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -100],
      [-100, 1, 1, 1, 1, 1, -100, 1, -100, -100, 1, 1],
      [1, -100, 1, 1, 1, 1, 1, 1, -100, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 100],
      [-1, -1, -1, -1, 1, 1, -100, 1, -1, -1, -1, -1],
      [-1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1],
      [-1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1],
      [-1, -1, -1, -1, 1, 1, -100, 1, -1, -1, -1, -1],
      [-1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1],
    ];
  }
  getMapRows() {
    return this.#mapData.length;
  }

  getMapCols() {
    return this.#mapData[0].length;
  }

  getMapData() {
    return this.cloneMap(); // Retorna uma cópia do mapa
  }

  cloneMap() {
    return this.#mapData.map((row) => [...row]); // Clona o mapa completo
  }

  getLength() {
    return this.#mapData.length;
  }

  getValueAt(pos: Vector2D): number {
    if (
      pos.x < 0 ||
      pos.x >= this.#mapData.length ||
      pos.y < 0 ||
      pos.y >= this.#mapData[0].length
    ) {
      return this.REWARD_OUT_OF_BOUNDS; // Retorna recompensa para fora dos limites
    }

    if (this.#mapData[pos.x][pos.y] === -1) {
      return this.REWARD_OUT_OF_BOUNDS; // Retorna recompensa para células não-mapa
    }
    return this.#mapData[pos.x][pos.y];
  }

  renderMap(agentPos: Vector2D, path: Vector2D[] = []) {
    let count = 0;
    this.#container.innerHTML = ""; // Limpa a lista de IDs do mapa
    this.#container.setAttribute(
      "style",
      `grid-template-columns: repeat(${this.getMapCols()}, 1fr);`
    );

    for (let i = 0; i < this.getLength(); i++) {
      const rowData = this.#mapData[i];
      for (let j = 0; j < rowData.length; j++) {
        let cellValue = rowData[j];
        if (agentPos.x === i && agentPos.y === j) {
          cellValue = 2; // Define o estado inicial do agente
        }

        const cellElement = this.#createCellElement(i, j, cellValue, count);
        if (cellValue !== -1) {
          cellElement.id = `S${count + 1}`;
          count++;
          this.#mapList.push(cellElement.id);
        }
        if (path.some((value: Vector2D) => value.x === i && value.y === j) && cellValue !== 2 && (this.#mapData[i][j] !== this.REWARD_TERMINAL)) {

          cellElement.classList.add("path");
        }

        this.#container.appendChild(cellElement);
      }
    }
  }

  #createCellElement(
    i: number,
    j: number,
    cellValue: number,
    count: number
  ): HTMLDivElement {
    const cellElement = document.createElement("div");

    if (cellValue === -1) {
      cellElement.classList.add(`cell-R${i}-C${j}-non-map`, "non-map");
      return cellElement;
    }

    cellElement.classList.add(`cell-R${i}-C${j}`, "grid-cell");
    const text = document.createElement("p");
    text.textContent = `S${count + 1}`;
    text.classList.add("cell-text");
    cellElement.appendChild(text);
    this.#addCellTypeClass(cellElement, cellValue);

    return cellElement;
  }

  #addCellTypeClass(cellElement: HTMLDivElement, cellValue: number) {
    switch (cellValue) {
      case 1:
        cellElement.classList.add("free");
        break;
      case -100:
        cellElement.classList.add("obstacle");
        break;
      case 2:
        cellElement.classList.add("initial-state");
        break;
      case 100:
        cellElement.classList.add("terminal-state");
        break;
    }
  }

  /**
   * Verifica se uma célula é terminal (final) no mapa.
   * @param pos A posição da célula a ser verificada
   * @returns Verdadeiro se a célula for terminal, falso caso contrário
   */
  isTerminal(pos: Vector2D): boolean {
    if (
      pos.x < 0 ||
      pos.x >= this.getMapRows() ||
      pos.y < 0 ||
      pos.y >= this.getMapCols()
    ) {
      return true; // Fora dos limites é terminal
    }

    const cellValue = this.getValueAt(pos);

    // Terminal apenas se for objetivo (100) ou obstáculo/fora do mapa
    return (
      cellValue === this.REWARD_TERMINAL || // Chegou ao objetivo
      cellValue === this.REWARD_OBSTACLE || // Bateu em obstáculo
      cellValue === -1 // Saiu do mapa
    );
  }


  getMapList(): string[] {
    return this.#mapList; // Retorna a lista de IDs do mapa
  }

  /**
   * Mapeia os dados do mapa para uma estrutura plana, excluindo células não-mapa (-1)
   */
  mappedMapData(): MappedCell[] {
    let count = 1;
    return this.#mapData.flatMap((rowArr, row) =>
      rowArr
        .map((value, col) => ({ value, col }))
        .filter((cell) => cell.value !== -1)
        .map((cell) => ({
          id: `S${row + 1}_${cell.col + 1}`,
          numberId: (count++).toString(),
          row,
          col: cell.col,
          value: cell.value,
        }))
    );
  }

  /**
   * Gera a lista de tabela Q com ações e vizinhos
   */
  getTableList(qTable?: number[][][]): IItemMap[] {
    const list = this.mappedMapData();
    const result: IItemMap[] = [];

    list.forEach((item) => {
      const neighbors = this.getNeighborIds(item.row, item.col);

      neighbors.forEach((nb) => {
        const neighborItem = list.find(
          (l) => l.row === nb.row && l.col === nb.col
        );
        if (neighborItem) {
          result.push({
            ...item,
            numberId: `S${item.numberId}`,
            actionTo: neighborItem.numberId,
            actionToText: `A${item.numberId}-${neighborItem.numberId}`,
            qValue: qTable ? qTable[item.row][item.col] : undefined,
            reward: 0,
          });
        }
      });
    });

    return result;
  }

  /**
   * Obtém os vizinhos válidos de uma célula
   */
  private getNeighborIds(
    row: number,
    col: number
  ): { row: number; col: number }[] {
    const directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1],  // right
    ];

    return directions
      .map(([dRow, dCol]) => [row + dRow, col + dCol])
      .filter(
        ([r, c]) =>
          r >= 0 && 
          r < this.getMapRows() && 
          c >= 0 && 
          c < this.getMapCols() && 
          this.#mapData[r][c] !== -1
      )
      .map(([r, c]) => ({ row: r, col: c }));
  }

}
