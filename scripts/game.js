class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.roundResult = ''; // To store the result of the round
        this.warWinner = null; // Initialize warWinner
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
        // Reset war cards and winner for the next round
        this.warCards = [];
        this.warWinner = null;
        
        if (this.player1.getDeck().isEmpty() || this.player2.getDeck().isEmpty()) {
            this.roundResult = 'Game Over!';
            this.updateUI();
            return;
        }
    
        const player1Card = this.player1.drawCard();
        const player2Card = this.player2.drawCard();
    
        const result = this.compareCards(player1Card, player2Card);
    
        if (result > 0) {
            // Player 1 wins this round
            this.player1.getDeck().updateDeck([player1Card, player2Card]);
            this.player1.shuffleDeck();
            this.roundResult = `${this.player1.name} wins the round!`;
        } else if (result < 0) {
            // Player 2 wins this round
            this.player2.getDeck().updateDeck([player1Card, player2Card]);
            this.player2.shuffleDeck();
            this.roundResult = `${this.player2.name} wins the round!`;
        } else {
            // It's a tie, show the war button
            this.roundResult = 'It\'s a tie! Click "War" to continue.';
            this.showWarButton();
            //return; // Exit playRound as we are waiting for the war button to be clicked
        }
    
        // Always update the UI at the end of the round
        this.updateUI();
    }

    compareCards(card1, card2) {
        let card1Value = card1.rankCard();
        let card2Value = card2.rankCard();
        card1Value = card1Value === 1 ? 14 : card1Value; // Aces high
        card2Value = card2Value === 1 ? 14 : card2Value; // Aces high
        return card1Value - card2Value;
    }

    handleWar() {
        if (this.player1.getDeck().sizeDeck() < 4 || this.player2.getDeck().sizeDeck() < 4) {
            this.roundResult = 'Not enough cards for war!';
            this.updateUI();
            this.hideWarButton();
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
    
        this.warCards.push(player1WarCard, player2WarCard);
        this.warCards.push(...player1WarCards, ...player2WarCards);
    
        this.roundResult = `War! ${this.player1.name} plays ${player1WarCard.toStringSymbol()} and ${this.player2.name} plays ${player2WarCard.toStringSymbol()}`;
    
        const result = this.compareCards(player1WarCard, player2WarCard);
        let winner = null;
    
        if (result > 0) {
            this.player1.getDeck().updateDeck(this.warCards);
            this.roundResult += ` ${this.player1.name} wins the war!`;
            winner = 'player1'; // Winner is player 1
        } else if (result < 0) {
            this.player2.getDeck().updateDeck(this.warCards);
            this.roundResult += ` ${this.player2.name} wins the war!`;
            winner = 'player2'; // Winner is player 2
        } else {
            if (this.player1.getDeck().sizeDeck() > 0 && this.player2.getDeck().sizeDeck() > 0) {
                this.roundResult += ' The war continues!';
                this.updateUI();
                this.showWarButton(); // Show war button for another round
                return;
            } else {
                this.roundResult += ' The war ends as one player has run out of cards!';
            }
        }
    
        // Store winner for use in updateUI
        this.warWinner = winner;
        this.hideWarButton(); // Hide war button after the war
        this.updateUI(); // Update UI after handling the war
    }

    showWarButton() {
        document.getElementById('war-button').style.display = 'inline-block';
    }

    hideWarButton() {
        document.getElementById('war-button').style.display = 'none';
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
    
            // Display Player 1's card
            if (player1DrawnCard) {
                const player1CardElement = player1DrawnCard.createCardElement();
                player1CardElement.classList.add('player1-card');
                cardDisplay1.innerHTML = player1CardElement.outerHTML;
            } else {
                cardDisplay1.innerHTML = 'No Card';
            }
    
            // Display Player 2's card
            if (player2DrawnCard) {
                const player2CardElement = player2DrawnCard.createCardElement();
                player2CardElement.classList.add('player2-card');
                cardDisplay2.innerHTML = player2CardElement.outerHTML;
            } else {
                cardDisplay2.innerHTML = 'No Card';
            }
    
            // Display round result
            roundResultElement.innerHTML = this.roundResult;
    
            // Update deck displays
            player1DeckDisplay.innerHTML = `Deck (${this.player1.getDeck().sizeDeck()} cards)`;
            player2DeckDisplay.innerHTML = `Deck (${this.player2.getDeck().sizeDeck()} cards)`;
    
            // Update war cards display
            if (this.warCards && this.warCards.length > 0) {
                warCardsDisplay.innerHTML = 'War Cards: ' + this.warCards.map(card => {
                    const cardElement = card.createCardElement();
                    if (this.warWinner) {
                        cardElement.classList.add(this.warWinner + '-card'); // Add winner-specific class
                    } else {
                        cardElement.classList.add('war-card'); // Default war card class
                    }
                    return cardElement.outerHTML;
                }).join(' ');
            } else {
                warCardsDisplay.innerHTML = '';
            }
        }
    }
}
