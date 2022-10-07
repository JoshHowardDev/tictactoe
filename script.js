// Functionality relating to the playersController
const playersController = (() => {

    const players = [];

    const createPlayer = (name, icon) => {
        if (players.length > 1) players.length = 0;
        players.push({name, icon})
    }

    return {createPlayer, players};

})();

// Functionality related to the playing of the game
const gamePlay = (() => {

    const gameBoardArray = []
    gameBoardArray.length = 9;

    let gameOver = false;

    let playerTurn = 1;
    const iteratePlayerTurn = () => {
        playerTurn === 0 ? playerTurn = 1 : playerTurn = 0;
        return playerTurn;
    }

    //Each icon set elements = player 0 icon, player 1 icon, theme
    const iconSets = [
        ['X.svg', 'O.svg', 'standard'],
        ['batman.png', 'joker.png', 'gotham'],
        ['male.svg', 'female.svg', 'gender'],
    ]

    const initializeNewGame = () => {
        
        //Empty gameboard
        gameBoardArray.fill('', 0, 9);

        //Create players
        name0 = document.querySelector('#player0Name').value || 'Player 1';
        name1 = document.querySelector('#player1Name').value || 'Player 2';
        if (document.querySelector('.iconSelection')) {
            iconDetailsArray = iconSets[Number(document.querySelector('.iconSelection').dataset.iconset)];
        } else {
            iconDetailsArray = iconSets[0];
        }
        
        playersController.createPlayer(name0, iconDetailsArray[0]);
        playersController.createPlayer(name1, iconDetailsArray[1]);

        //Display gameboard and pass in theme
        displayController.newGameDisplay(iconDetailsArray[2]);
    };

    const establishWinner = () => {
        const gameBoardTriplesArray = []
        const gameBoardTriplets = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        gameBoardTriplets.forEach(triplet => {
            let tripletTxt = ''
            triplet.forEach(gameBoardIndex => {
                tripletTxt += gameBoardArray[gameBoardIndex];
            });
            gameBoardTriplesArray.push(tripletTxt);
        });

        if (gameBoardTriplesArray.includes('000')) {
            displayController.updateBanner(`${playersController.players[0].name} is the winner!`)
            gameOver = true;
            return 0;
        } else if (gameBoardTriplesArray.includes('111')) {
            displayController.updateBanner(`${playersController.players[1].name} is the winner!`)
            gameOver = true;
            return 0;
        } else if (gameBoardArray.join('').length === 9) {
            displayController.updateBanner(`It's a tie game!`)
            gameOver = true;
            return 0;
        }
    }

    return {gameBoardArray, gameOver, iconSets, iteratePlayerTurn, initializeNewGame, establishWinner};
})();

// Functionality related to the display of the game
const displayController = (() => {

    const bodyContainer = document.querySelector('.bodyContainer');
    const playerDetailsDiv = document.querySelector('.playerDetails');
    const gameBoard = document.querySelector('.gameBoard');
    const gameTileDivs = document.querySelectorAll('.gameTile');
    const gameBoardbanner = document.querySelector('.gameBoardBanner');
    const icons = document.querySelectorAll('.iconOption');
    const newGameButton = document.querySelector('.newGameButton');

    const populateGameBoard = () => {
        
        gameTileDivs.forEach((tile, index) => {
            if (gamePlay.gameBoardArray[index] === '') {
                tile.innerHTML = '';
                tile.classList.remove('marked')
            } else {
                tile.innerHTML = `<img class="playerMark" src="images/${playersController.players[gamePlay.gameBoardArray[index]].icon}" alt="Player Mark">`;
            }
        });

        gamePlay.establishWinner();

    }

    const placeMark = (tile) => {
        if (!tile.classList.contains('marked') && !gamePlay.gameOver) {
            tile.classList.add('marked');
            gamePlay.gameBoardArray[Number(tile.dataset.tilenum)] = gamePlay.iteratePlayerTurn();
            populateGameBoard()
        }
    }

    const updateBanner = (msg) => {
        gameBoardbanner.classList.toggle('displayNone');
        gameBoardbanner.innerHTML = msg;
        newGameButton.classList.toggle('displayNone');
    }

    const makeTilesClickable = () => {
        gameTileDivs.forEach(tile => {
            tile.addEventListener('click', displayController.placeMark.bind(this, tile));
        });
    };

    const newGameDisplay = (theme) => {
        playerDetailsDiv.classList.toggle('displayNone');

        if (!(gameBoardbanner.classList.contains('displayNone'))) {
            gameBoardbanner.classList.toggle('displayNone');
            newGameButton.classList.toggle('displayNone')
        }

        gameBoard.classList.toggle("displayNone");
        if (theme) {
            bodyContainer.classList.add(theme);
        }
        populateGameBoard();
        makeTilesClickable();
    };

    const clearIconSelection = () => {
        icons.forEach(icon => {
            icon.classList.remove('iconSelection');
        });
    }

    const makeIconsClickable = () => {
        icons.forEach(icon => {
            icon.addEventListener('click', changeIconSelection.bind(this, icon)) 
        });
    }

    const changeIconSelection = (icon) => {
        clearIconSelection();
        icon.classList.add('iconSelection');
    }

    return {populateGameBoard, placeMark, updateBanner, makeTilesClickable, newGameDisplay, makeIconsClickable};

})();

//Page Initialization
(() => {
    document.querySelector('#playButton').addEventListener('click', gamePlay.initializeNewGame)
    document.querySelector('.newGameButton').addEventListener('click', gamePlay.initializeNewGame)
    displayController.makeIconsClickable();
})();