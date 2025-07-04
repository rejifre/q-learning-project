# Q-Learning Project

Um projeto educacional demonstrando o algoritmo Q-Learning implementado em TypeScript com visualização interativa.

## [Demo Online](https://rejifre.github.io/q-learning-project/)

## Características

- Implementação do algoritmo Q-Learning
- Visualização do processo de aprendizado
- Parâmetros configuráveis (α, γ, ε, episódios)
- Exibição da Q-table dinâmica
- Caminho otimizado pós-treinamento

## Tecnologias

- **Frontend**: TypeScript, HTML5, CSS3
- **Build**: Vite 6.3.5
- **Styling**: TailwindCSS 4.1.10
- **Deploy**: GitHub Pages

### Local
```bash
# Clone o repositório
git clone https://github.com/rejifre/q-learning-project.git

# Entre no diretório
cd q-learning-project

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Algoritmo Q-Learning

### Fórmula de Atualização
```
Q(s,a) = Q(s,a) + α[r + γ * max(Q(s',a')) - Q(s,a)]
```

### Parâmetros
- **α (Alpha)**: Taxa de aprendizado (0.1)
- **γ (Gamma)**: Fator de desconto (0.9)
- **ε (Epsilon)**: Taxa de exploração (0.3)
- **Episódios**: Número de iterações (1000)

## Ambiente

- **Dimensões**: Grid 10×12
- **Ponto Inicial**: (9, 4)
- **Objetivo**: Célula com valor +100
- **Obstáculos**: Células com valor -100
- **Células Livres**: Valor -1

### Sistema de Recompensas
| Tipo | Valor | Cor |
|------|-------|-----|
| Célula Livre | -1 | Branco |
| Obstáculo | -100 | Cinza |
| Fora do Mapa | -200 | Cinza Claro |
| Objetivo | +100 | Verde |
| Agente | - | Laranja |
| Caminho Aprendido | - | Roxo |

## Interface

### Controles
- **Iniciar Treinamento**: Começa o processo de aprendizado
- **Reset**: Interrompe o treinamento atual
- **Parâmetros**: Ajuste de α, γ, ε e número de episódios

### Visualizações
- **Mapa Interativo**: Grid colorido com estados
- **Informações do Agente**: Posição, direção, recompensa
- **Q-Table**: Valores de qualidade das ações
- **Progresso**: Contador de episódios

## Arquitetura

```
src/
├── main.ts                 # Controlador principal
├── core/
│   ├── qLearningAgent.ts   # Algoritmo Q-Learning
│   ├── projectMap.ts       # Gerenciamento do ambiente
│   ├── tableLearning.ts    # Visualização da Q-table
│   └── helpers.ts          # Utilitários e tipos
├── styles/
│   └── style.css          # Estilos da aplicação
└── assets/                # Recursos visuais
```

## Processo de Aprendizado

1. **Inicialização**: Agente no ponto (9,4), Q-table zerada
2. **Episódios**: Loop de 1000 iterações (configurável)
3. **Estratégia**: ε-greedy (30% exploração, 70% exploração)
4. **Atualização**: Valores Q modificados a cada ação
5. **Convergência**: Política otimizada para alcançar objetivo
6. **Resultado**: Caminho eficiente visualizado

## Contexto Acadêmico

**Disciplina**: Fundamentos de Inteligência Artificial  
**Instituição**: Universidade de Caxias do Sul (UCS)  
**Ano**: 2025  

## Licença

Este projeto é desenvolvido para fins educacionais como parte do curso de Fundamentos de Inteligência Artificial.

## Contribuições

Este é um projeto acadêmico. Sugestões e melhorias são bem-vindas via Issues.
