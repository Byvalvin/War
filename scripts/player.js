// player.js

class Player {
    constructor(name) {
        this.name = name;
        this.deck = new Deck(name + "'s Deck");
        this.drawnCard = null; // To store the card drawn in the current round
    }

    /**
     * Sets the player's deck.
     * @param {Deck} deck - The deck to set for the player.
     */
    setDeck(deck) {
        if (!(deck instanceof Deck)) {
            throw new TypeError('Argument must be an instance of Deck');
        }
        this.deck = deck;
    }

    /**
     * Returns the player's deck.
     * @returns {Deck} - The player's deck.
     */
    getDeck() {
        return this.deck;
    }

    /**
     * Draws a card from the top of the player's deck.
     * @returns {Card} - The drawn card.
     * @throws {Error} - Throws an error if the deck is empty.
     */
    drawCard() {
        if (this.deck.isEmpty()) {
            throw new Error('Deck is empty');
        }
        this.drawnCard = this.deck.popDeck();
        return this.drawnCard;
    }

    /**
     * Returns the card drawn in the current round.
     * @returns {Card} - The drawn card.
     */
    getDrawnCard() {
        return this.drawnCard;
    }

    /**
     * Shuffles the player's deck.
     */
    shuffleDeck() {
        this.deck.shuffle();
    }
}
