# Flowchart attempt

```mermaid
flowchart TD
    A[Start] --> B[You will need<br>1 empty bottle]
    B --> C{Potion quality?}
    C -->|Weak?| D[Recipe requires:<br>1 ingredient<br>1 part]
    C -->|Standard?| E[Recipe requires:<br>2 ingredients,<br>1 part<br>or<br>1 ingredient,<br>2 parts]
    C -->|Supreme?| F[Recipe requires:<br>3 ingredients,<br>1 part<br>or<br>1 ingredient,<br>3 parts<br>or<br>2 ingredients,<br>2 parts]
    
    D --> G{Known recipe?}
    E --> G
    F --> G

    G -->|yes| H[+10 bonus]
    G -->|no| I{At least one<br>exquisite component?}
    
    I -->|yes| H
    I -->|no| J[Make an Alchemy<br>skill check]
    
    H --> J
    J --> K{Success?}

    K -->|no| L["Discard components.(You can keep<br>the bottle)"]
    K -->|yes| M{Known recipe?}

    M -->|yes| N[Add new potion<br>to character sheet]
    M -->|no| O[Randomly determine<br>which potion<br>you've created]
    
    O --> P[Write down<br>your recipe<br>for future reference]
    P --> N
```