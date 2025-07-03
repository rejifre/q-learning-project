export class TableLearning {
  #table: HTMLElement;
  #originalList: string[];
  #mapList: Map<string, string>[];
  #divided: number = 0;

  constructor(mapList: string[]) {
    this.#table = document.getElementById("q-table-learning") as HTMLElement;
    if (!this.#table) {
      throw new Error("Elemento com id 'q-table-learning' não encontrado.");
    }

    this.#table.classList.add("styled-table");

    this.#originalList = [...mapList];
    this.#divided = Math.ceil(this.#originalList.length / 10);

    // Cria uma lista de Mapas com rótulo "Mapa N"
    this.#mapList = this.#originalList.map((value, index) => {
      return new Map([[`Mapa ${index + 1}`, value]]);
    });
  }

  createTable() {
    this.#table.innerHTML = ""; // Limpa conteúdo anterior

    for (let i = 0; i < this.#divided; i++) {
      const startIndex = i * 10;
      this.#createTableHeader(i + 1, startIndex);
    }
  }

  #createTableHeader(index: number, startIndex: number) {
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

  #createTableBody(table: HTMLTableElement, startIndex: number) {
    const tbody = document.createElement("tbody");

    for (let i = 0; i < 10; i++) {
      const globalIndex = startIndex + i;
      if (globalIndex >= this.#mapList.length) break;

      const row = document.createElement("tr");

      const cellMap = document.createElement("td");
      const key = `Mapa ${globalIndex + 1}`;
      const map = this.#mapList[globalIndex];
      cellMap.textContent = map.get(key) ?? "";
      row.appendChild(cellMap);

      const cellReward = document.createElement("td");
      cellReward.textContent = "0"; // Placeholder
      row.appendChild(cellReward);

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
  }
}
