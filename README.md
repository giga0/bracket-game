# bracket-game

### Demo
###### CodeSandbox: https://codesandbox.io/s/github/giga0/bracket-game
###### Full screen: https://srgkq.csb.app/

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Technologies used
- Webpack
- Vue
- Vuex
- Vue Router

### Game Info & Rules
Milestones consist of three steps: 1) the game master authors a bracket, 2) a player completes the bracket, and 3) the game master fills the bracket with the final solution.

Authoring a bracket:
The game master may specify a bracket with either 4, 8, or 16 contestants. Each child node is editable with the name and image of a contestant. Each branch is a dropdown. The value of this dropdown is dictated by its children. The game master may specify a value for a parent. This limits a player’s choices for the bracket game.

Playing a bracket game:
A player completes a bracket game by selecting a value for its dropdowns. The choice of values for a dropdown is limited by its children. The player can click a submit button only once they specify a value for all the dropdowns - i.e., all intermediate branches of the bracket game.

Game Master identifies the winning bracket:
The game master uses the same interface as the player to identify the winning bracket. This is identical to a player completing the bracket game.
