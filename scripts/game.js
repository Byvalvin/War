// game.js

class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.roundResult = ''; // To store the result of the round
        this.warCards = []; // To store the cards put aside during a war
        this.initializeGame();
    }

    initializeGame() {
        const fullDeck = this.createDeck();
        fullDeck.shuffle();
        this.dealCards(fullDeck);
        this.updateUI();
    }

    createDeck() {
        const suits = ['s', 'h', 'd', 'c'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

        const deck = new Deck('standard');

        suits.forEach(suit => {
            ranks.forEach(rank => {
                deck.pushDeck(new Card(suit, rank));
            });
        });
        return deck;
    }

    dealCards(deck) {
        const cardsPerPlayer = Math.floor(deck.sizeDeck() / 2);
        const deck1 = new Deck('player1');
        const deck2 = new Deck('player2');

        for (let i = 0; i < cardsPerPlayer; i++) {
            deck1.pushDeck(deck.popDeck());
            deck2.pushDeck(deck.popDeck());
        }

        this.player1.setDeck(deck1);
        this.player2.setDeck(deck2);
    }

    playRound() {
        if (this.player1.getDeck().isEmpty() || this.player2.getDeck().isEmpty()) {
            this.roundResult = 'Game Over!';
            this.updateUI();
            return;
        }

        const player1Card = this.player1.drawCard();
        const player2Card = this.player2.drawCard();

        const result = this.compareCards(player1Card, player2Card);
        console.log(result);

        if (result > 0) {
            this.player1.getDeck().pushDeck(player1Card);
            this.player1.getDeck().pushDeck(player2Card);
            this.roundResult = `${this.player1.name} wins the round!`;
        } else if (result < 0) {
            this.player2.getDeck().pushDeck(player1Card);
            this.player2.getDeck().pushDeck(player2Card);
            this.roundResult = `${this.player2.name} wins the round!`;
        } else {
            this.handleWar([player1Card, player2Card]);
        }

        this.updateUI();
    }

    compareCards(card1, card2) {
        return card1.rankCard() - card2.rankCard();
    }

    handleWar(warCards) {
        if (this.player1.getDeck().sizeDeck() < 4 || this.player2.getDeck().sizeDeck() < 4) {
            this.roundResult = 'Not enough cards for war!';
            return;
        }

        const player1WarCards = [];
        const player2WarCards = [];

        for (let i = 0; i < 3; i++) {
            player1WarCards.push(this.player1.drawCard());
            player2WarCards.push(this.player2.drawCard());
        }

        const player1WarCard = this.player1.drawCard();
        const player2WarCard = this.player2.drawCard();

        warCards.push(player1WarCard, player2WarCard);

        this.roundResult = `War! ${this.player1.name} plays ${player1WarCard.toStringSymbol()} and ${this.player2.name} plays ${player2WarCard.toStringSymbol()}`;

        const result = this.compareCards(player1WarCard, player2WarCard);
        if (result === 1) {
            this.player1.getDeck().pushDeck(...warCards);
            this.roundResult += ` ${this.player1.name} wins the war!`;
        } else if (result === -1) {
            this.player2.getDeck().pushDeck(...warCards);
            this.roundResult += ` ${this.player2.name} wins the war!`;
        } else {
            this.handleWar(warCards); // Recursive call for another war if there's still a tie
        }
        this.warCards = warCards; // Save war cards for display
    }

    updateUI() {
        const cardDisplay1 = document.getElementById('player1-card');
        const cardDisplay2 = document.getElementById('player2-card');
        const roundResultElement = document.getElementById('round-result');
        const player1DeckDisplay = document.getElementById('player1-deck');
        const player2DeckDisplay = document.getElementById('player2-deck');
        const warCardsDisplay = document.getElementById('war-cards');

        if (cardDisplay1 && cardDisplay2 && roundResultElement && player1DeckDisplay && player2DeckDisplay && warCardsDisplay) {
            const player1DrawnCard = this.player1.getDrawnCard();
            const player2DrawnCard = this.player2.getDrawnCard();

            cardDisplay1.innerHTML = player1DrawnCard ? player1DrawnCard.createCardElement().outerHTML : 'No Card';
            cardDisplay2.innerHTML = player2DrawnCard ? player2DrawnCard.createCardElement().outerHTML : 'No Card';

            roundResultElement.innerHTML = this.roundResult;

            // Update deck displays
            player1DeckDisplay.innerHTML = `Deck (${this.player1.getDeck().sizeDeck()} cards)`;
            player2DeckDisplay.innerHTML = `Deck (${this.player2.getDeck().sizeDeck()} cards)`;

            // Update war cards display
            if (this.warCards.length > 0) {
                warCardsDisplay.innerHTML = 'War Cards: ' + this.warCards.map(card => card.createCardElement().outerHTML).join(' ');
            } else {
                warCardsDisplay.innerHTML = '';
            }
        }
    }
}

