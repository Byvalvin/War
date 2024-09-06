document.addEventListener('DOMContentLoaded', () => {
    let game;

    function initializeGame() {
        const playerMode = document.getElementById('player-mode').value;
        let player1, player2;

        switch (playerMode) {
            case 'cpu-vs-cpu':
                player1 = new Player('CPU1');
                player2 = new Player('CPU2');
                break;
            case 'human-vs-cpu':
                player1 = new Player('Human');
                player2 = new Player('CPU');
                break;
            case 'human-vs-human':
                player1 = new Player('Human1');
                player2 = new Player('Human2');
                break;
            default:
                throw new Error('Invalid game mode');
        }

        game = new Game(player1, player2);
        setupEventListeners();
        updateUI();
    }

    function setupEventListeners() {
        document.getElementById('player-mode').addEventListener('change', () => {
            if (confirm('Are you sure you want to change the game mode? This will reset the current game.')) {
                initializeGame();
            }
        });

        document.getElementById('draw-button').addEventListener('click', () => {
            if (game) {
                game.playRound();
                updateUI();
            }
        });

        document.getElementById('shuffle-button').addEventListener('click', () => {
            if (game) {
                game.player1.getDeck().shuffle();
                game.player2.getDeck().shuffle();
                updateUI();
            }
        });

        // Shuffle individual decks
        document.getElementById('shuffle-player1').addEventListener('click', () => {
            if (game) {
                game.player1.getDeck().shuffle();
                updateUI();
            }
        });

        document.getElementById('shuffle-player2').addEventListener('click', () => {
            if (game) {
                game.player2.getDeck().shuffle();
                updateUI();
            }
        });

        // Add event listener for the war button
        document.getElementById('war-button').addEventListener('click', () => {
            if (game) {
                game.handleWar(game.warCards);
                updateUI();
            }
        });
    }

    function updateUI() {
        if (!game) return;
        game.updateUI();

        const warButton = document.getElementById('war-button');
        if (game.roundResult && game.roundResult.includes('The war continues!')) {
            warButton.style.display = 'inline-block'; // Show the war button if the round result includes "The war continues!"
        } else {
            warButton.style.display = 'none'; // Hide the war button otherwise
        }
    }

    initializeGame();
});
