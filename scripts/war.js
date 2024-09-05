// war.js

document.addEventListener('DOMContentLoaded', () => {
    let game;

    // Initialize the game based on the selected mode and set up event listeners
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
        updateUI();  // Ensure UI is updated when the game is initialized
    }

    // Set up event listeners for user interactions
    function setupEventListeners() {
        document.getElementById('player-mode').addEventListener('change', () => {
            initializeGame();
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
    }

    // Update the UI to reflect the current game state
    function updateUI() {
        if (game) {
            const cardDisplay1 = document.getElementById('player1-card');
            const cardDisplay2 = document.getElementById('player2-card');
            const roundResultElement = document.getElementById('round-result');

            // Update card displays
            cardDisplay1.innerHTML = ''; // Clear previous card display
            cardDisplay2.innerHTML = ''; // Clear previous card display

            if (!game.player1.getDeck().isEmpty()) {
                const card1 = game.player1.getDeck().peekDeck();
                cardDisplay1.appendChild(card1.createCardElement());
            }

            if (!game.player2.getDeck().isEmpty()) {
                const card2 = game.player2.getDeck().peekDeck();
                cardDisplay2.appendChild(card2.createCardElement());
            }

            // Update round result
            roundResultElement.innerHTML = game.roundResult || '';
        }
    }

    // Initialize the game on page load
    initializeGame();
});
