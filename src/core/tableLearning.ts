import type { IItemMap, Vector2D } from "./helpers";

export class TableLearning {
  #table: HTMLElement;
  #originalList: IItemMap[];
  #mapList: Map<string, IItemMap>[];
  #divided: number = 0;
  #dividedList: number = 0;

  constructor(mapList: IItemMap[]) {
    this.#table = document.getElementById("q-table-learning") as HTMLElement;
    if (!this.#table) {
      throw new Error("Elemento com id 'q-table-learning' não encontrado.");
    }

    this.#table.classList.add("styled-table");

    this.#originalList = [...mapList];
    this.#dividedList = this.#originalList.length / 4;
    this.#divided = Math.ceil(this.#originalList.length / this.#dividedList);

    // Cria uma lista de Mapas com rótulo "Mapa N"
    this.#mapList = this.#originalList.map((value, index) => {
      return new Map([[`Mapa ${index + 1}`, value]]);
    });
  }

  createTable(): void {
    this.#table.innerHTML = ""; // Limpa conteúdo anterior

    for (let i = 0; i < this.#divided; i++) {
      const startIndex = i * this.#dividedList;
      this.#createTableList(i + 1, startIndex);
    }
  }

  #createTableList(index: number, startIndex: number): void {
    const table = document.createElement("table");
    table.id = `table-${index}`;
    table.classList.add("item-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const thMap = document.createElement("th");
    thMap.textContent = "Q()";
    headerRow.appendChild(thMap);

    const th = document.createElement("th");
    th.textContent = "Recompensa";
    headerRow.appendChild(th);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    this.#createTableBody(table, startIndex);

    this.#table.appendChild(table);
  }

  #createTableBody(table: HTMLTableElement, startIndex: number): void {
    const tbody = document.createElement("tbody");

    for (let i = 0; i < this.#dividedList; i++) {
      const globalIndex = startIndex + i;
      if (globalIndex >= this.#mapList.length) break;

      const row = document.createElement("tr");

      const cellMap = document.createElement("td");
      const key = `Mapa ${globalIndex + 1}`;
      const map = this.#mapList[globalIndex];
      cellMap.textContent = `${map.get(key)?.numberId}, ${map.get(key)?.actionToText ?? ""}`;
      row.appendChild(cellMap);

      const cellReward = document.createElement("td");
      cellReward.id = `table-reward-${map.get(key)?.pos.x}:${map.get(key)?.pos.y}:${map.get(key)?.direction ?? ""}`;
      cellReward.textContent = `${map.get(key)?.reward?.toFixed(2) ?? 0}`; // Placeholder
      row.appendChild(cellReward);

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
  }

  updateTableByPosition(pos: Vector2D, reward: number, direction: number): void {
    const cellId = `table-reward-${pos.x}:${pos.y}:${direction ?? ""}`;
    const cell = document.getElementById(cellId);
    if (cell) {
      cell.textContent = `${reward.toFixed(2)}`; // Atualiza o texto da célula com a recompensa formatada
    } else {
      console.warn(`Célula com ID ${cellId} não encontrada.`);
    }
  }
}
