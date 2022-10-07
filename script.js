// Functionality relating to the playersController
const playersController = (() => {

    const players = [];

    const createPlayer = (name, icon) => {
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
        gameBoardArray.fill('', 0, 9);
        name0 = document.querySelector('#player0Name').value || 'Player 1';
        name1 = document.querySelector('#player1Name').value || 'Player 2';
        iconSelection = iconSets[document.querySelector('.iconSelection').dataset.iconset || 0];

        playersController.createPlayer(name0, iconSelection[0]);
        playersController.createPlayer(name1, iconSelection[1]);
        displayController.makeTilesClickable();
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

        if (gameBoardTriplesArray.includes('XXX')) {
            displayController.updateBanner('player 1 wins')
            gameOver = true;
            return 0;
        } else if (gameBoardTriplesArray.includes('OOO')) {
            displayController.updateBanner('player 2 wins')
            gameOver = true;
            return 0;
        } else if (gameBoardArray.join('').length === 9) {
            displayController.updateBanner('tie game!')
            gameOver = true;
            return 0;
        }
    }

    return {gameBoardArray, gameOver, iteratePlayerTurn, initializeNewGame, establishWinner};
})();

// Functionality related to the display of the game
const displayController = (() => {
    
    gameTileDivs = document.querySelectorAll('.gameTile');

    const populateGameBoard = () => {
        
        gameTileDivs.forEach((tile, index) => {
            if (gamePlay.gameBoardArray[index]) {
                if (!tile.classList.contains('marked')) {
                    tile.classList.add('marked')
                }
                tile.innerHTML = `<img class="playerMark" src="images/${gamePlay.gameBoardArray[index]}.svg" alt="Player Mark">`;
            }
        });

        gamePlay.establishWinner();

    }

    const placeMark = (tile) => {
        if (!tile.classList.contains('marked') && !gamePlay.gameOver) {
            gamePlay.gameBoardArray[Number(tile.dataset.tilenum)] = gamePlay.iteratePlayerTurn();
            populateGameBoard()
        }
    }

    const updateBanner = (msg) => {
        banner = document.querySelector('.gameBoardBanner');
        banner.innerHTML = msg;
    }

    const makeTilesClickable = () => {
        const gameTileDivs = document.querySelectorAll('.gameTile');
        gameTileDivs.forEach(tile => {
            tile.addEventListener('click', displayController.placeMark.bind(this, tile))
        });
    };

    return {populateGameBoard, placeMark, updateBanner, makeTilesClickable};

})();

//Page Initialization

(() => {
    document.querySelector('#playButton').addEventListener('click', gamePlay.initializeNewGame)
})();