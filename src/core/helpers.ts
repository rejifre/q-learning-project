export class Vector2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector2D {
    return new Vector2D(this.x, this.y); 
  }

  equals(other: Vector2D): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

// Definindo as ações (convenção: 0=cima, 1=baixo, 2=esquerda, 3=direita)
export const MOVES = [
    [-1, 0], // Cima (row-1, col)
    [1, 0],  // Baixo (row+1, col)
    [0, -1], // Esquerda (row, col-1)
    [0, 1],  // Direita (row, col+1)
];
export const ACTION_NAMES = ['Cima', 'Baixo', 'Esquerda', 'Direita'];

