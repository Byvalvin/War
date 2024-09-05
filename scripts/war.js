// war.js

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
    }

    function updateUI() {
        if (!game) return;

        const cardDisplay1 = document.getElementById('player1-card');
        const cardDisplay2 = document.getElementById('player2-card');
        const roundResultElement = document.getElementById('round-result');
        const player1DeckDisplay = document.getElementById('player1-deck');
        const player2DeckDisplay = document.getElementById('player2-deck');
        const warCardsDisplay = document.getElementById('war-cards');

        if (cardDisplay1 && cardDisplay2 && roundResultElement && player1DeckDisplay && player2DeckDisplay && warCardsDisplay) {
            const player1DrawnCard = game.player1.getDrawnCard();
            const player2DrawnCard = game.player2.getDrawnCard();

            cardDisplay1.innerHTML = player1DrawnCard ? player1DrawnCard.createCardElement().outerHTML : 'No Card';
            cardDisplay2.innerHTML = player2DrawnCard ? player2DrawnCard.createCardElement().outerHTML : 'No Card';

            roundResultElement.innerHTML = game.roundResult;

            player1DeckDisplay.innerHTML = `Deck (${game.player1.getDeck().sizeDeck()} cards)`;
            player2DeckDisplay.innerHTML = `Deck (${game.player2.getDeck().sizeDeck()} cards)`;

            if (game.warCards.length > 0) {
                warCardsDisplay.innerHTML = 'War Cards: ' + game.warCards.map(card => card.createCardElement().outerHTML).join(' ');
            } else {
                warCardsDisplay.innerHTML = '';
            }
        }
    }

    initializeGame();
});


