'use strict';

// this component is useful to demonstrate the meat grinding of pre-determined `hand` sets
// look into using `import`
//import {readFileSync as readSync} from 'fs';
const readSync = require('fs').readFileSync;

let CannedHamLord = function () {

    const hamSuits = ['C', 'S', 'D', 'H'];

    const hamFaces = {
        T: 10,
        J: 11,
        Q: 12,
        K: 13,
        A: 14
    };

    // rank the hand based on the following rule set
    /*
     High Card: Highest value card.
     One Pair: Two cards of the same value.
     Two Pairs: Two different pairs.
     Three of a Kind: Three cards of the same value.
     Straight: All cards are consecutive values.
     Flush: All cards of the same suit.
     Full House: Three of a kind and a pair.
     Four of a Kind: Four cards of the same value.
     Straight Flush: All cards are consecutive values of same suit.
     Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.
     */

    const hamRank ={
        highCard: 0,
        pair : 1,
        twoPair : 2,
        triple: 3,
        str8: 4,
        toiletNoise: 5,
        uncleJoey: 6,
        quad: 7,
        str8ToiletNoise: 8,
        theDonald: 9
    }

    const minCardVal = 2;
    const maxCardVal = 9;

    let evalFaces = (val) => {
        if (parseInt(val, 10) >= minCardVal || parseInt(val, 10) <= maxCardVal) {
            return true;
        } else {
            return (Object.keys(hamFaces).includes(val));
        }
    };

    let evalSuits = (val) => {
        return hamSuits.includes(val)
    };

    let hamContents = (cannedPath, options = {}) => {
        let hamsult = readSync(cannedPath);

        return hamsult.toString().split('\n').filter((line) => {
            return line.length > 0;
        });
    };

    let validateAndValueHam = (line) => {
        let playLine = line.split(' ');
        // if we have more or less than 10 "cards" then the hand set is malformed

        if (playLine.length !== 10) {
            return false;
        }
        let playSet = playLine.map((elem) => {
            let _pair = elem.split('');

            if (_pair.length < 2) {
                return false;
            }
            if (!evalFaces(_pair[0]) || !evalSuits(_pair[1])) {
                return false;
            }
            return _pair;
        });

        if (playSet.includes(false)) {
        }
        let hands = [
            playSet.slice(0, playSet.length / 2),
            playSet.slice(playSet.length / 2)
        ];
        return hands;
    };


    let determineHandComposure = (hand) => {
        let processedCards = {};
        hand.forEach(function (card) {

            if (Object.keys(processedCards).includes(card[0])) {
                processedCards[card[0]].occurance += 1;
                if (typeof processedCards[card[0]].suits[card[1]] === 'undefined') {
                    processedCards[card[0]].suits[card[1]] = {count: 1};
                } else {
                    processedCards[card[0]].suits[card[1]].count += 1;
                }
            } else {
                processedCards[card[0]] = {occurance: 1, suits: {}};
                processedCards[card[0]].suits[card[1]] = {count: 1};
            }
        });
        return processedCards;
    };

    let highCard = (hand) => {
        return hand.map((card) => {
            return cardValue(card[0]);
        }).sort(cardValueSort).pop();
    }

    // @param [String] card is the value of a dealt 'card'
    let cardValue = (card) => {
        return !Number.isNaN(parseInt(card, 10)) ? parseInt(card, 10) : hamFaces[card];
    }

    //Determine the Type of Hand

    let cardValueSort = (a, b) => {
        if (cardValue(a) < cardValue(b)) return -1;
        if (cardValue(b) < cardValue(a)) return 1;
        return 0;
    }

    let determinePairType = (hand, occuranceFilter) => {
        // hand == { cardNumber : { occurance : <int>, suits: { cardSuit : <int> } } }

        let filteredValues =  Object.keys(hand).filter((cardVal) => {
                return hand[cardVal].occurance === occuranceFilter;
        });

        let sortedVals = filteredValues.map((cardVal) => {
            return cardValue(cardVal);
        }).sort(cardValueSort);
        return (sortedVals.length === 0)? false : sortedVals;
    };


    let examineForFlush = (hand) => {
        let targetSuit = true;
        Object.keys(hand).forEach((card) => {
            if (!targetSuit) {
                return false;
            }
            if (Object.keys(hand[card].suits).length == 1) {
                if (targetSuit === true) {
                    targetSuit = Object.keys(hand[card].suits).pop();
                }
                else {
                    if (targetSuit !== Object.keys(hand[card].suits).pop()) {
                        targetSuit = false;
                    }
                }
            } else {
                targetSuit = false;
            }
        });
        return (!targetSuit)? false :
            cardValue(Object.keys(hand).sort(cardValueSort).pop());
    };

    let examineForStraight = (hand) => {
        return Object.keys(hand).reduce((acc, nxt, index, _ary) => {
            if (!acc) {
                return false;
            }
            acc = cardValue(acc);
            nxt = cardValue(nxt);
            return (typeof hand[acc] !== 'undefined' && typeof hand[nxt] !== 'undefined' ) ? ((acc + 1 === nxt && _ary.length === 5) ? parseInt(nxt, 10) : false) : false;
        });
    };

    //@param [Array] cardGroup to be added together
    let tallyCardGroupTotal = ((cardGroup) => {
        return cardGroup.reduce((acc, nxt) => {
            return acc + nxt;
        });
    });

    let determineHandValue = (hand) => {
        let composedHand = determineHandComposure(hand);
        let hasFlush = examineForFlush(composedHand);
        let hasStraight = examineForStraight(composedHand);
        let hasPairs = determinePairType(composedHand, 2);
        let hasTripples = determinePairType(composedHand, 3);
        let hasFour = determinePairType(composedHand, 4);
        return (hasFlush === 14 && hasStraight === 14) ? [hamRank.theDonald, hamFaces.A] :
            (hasFlush && hasStraight) ? [hamRank.str8ToiletNoise, hasStraight] :
                (hasFour) ? [hamRank.quad, hasFour] :
                    (hasTripples && hasPairs) ? [hamRank.uncleJoey, [hasTripples, hasPairs]] :
                        (hasFlush) ? [hamRank.toiletNoise, hasFlush] :
                            (hasStraight) ? [hamRank.str8, hasStraight] :
                                (hasTripples) ? [hamRank.triple, hasTripples] :
                                    (hasPairs) ? ( hasPairs.length > 1) ? [hamRank.twoPair, hasPairs] : [hamRank.pair, hasPairs] :
                                        [hamRank.highCard, highCard(hand)];
    };


    let pairCompare = (gameHands) => {
        return gameHands.map((hand) => {
            return hand[1].reduce((acc, nxt) => {
                return acc + nxt;
            })
        });
    }

    // this is the publically exposed canned hamm process
    // @param [String] cannedPath is the location of the play record to parse
    // @param [Object<optional>] options contains information on how to parse the play record file
    this.fetchCannedHam = (cannedPath, options = {}) => {

        let gameLines = hamContents(cannedPath, options);
        let playerOne = 0;
        let playerTwo = 0;

        gameLines.forEach((line) => {
            let gameHands = validateAndValueHam(line);
            gameHands = gameHands.map((hand) => {
                return determineHandValue(hand);
            });
            if (gameHands[0][0] > gameHands[1][0]) { playerOne += 1; }
            else if (gameHands[0][0] < gameHands[1][0]) { playerTwo += 1; }
            else if (gameHands[0][0] === gameHands[1][0]) {
                if ( Array.isArray(gameHands[0][1])) {
                    let pairTotals = pairCompare(gameHands);
                    pairTotals[0] > pairTotals[1] ? playerOne +=1 : playerTwo += 1;

                } else {
                    gameHands[0][1] > gameHands[1][1] ? playerOne += 1 : playerTwo += 1;
                }
            }
            else {
                console.log('TIE!');
            }
        });
        let htmlLols = "<h1>Series Results:</h1><ul><li><h3>Player One Win Count " + playerOne + "</h3></li>";
        htmlLols += '<li><h3>Player Two Win Count: ' + playerTwo + '</h3></li>';
        htmlLols += '</ul>';
        return htmlLols;
    }
}

var instance = null;
CannedHamLord.getInstance = function () {
    if (!instance) {
        instance = new CannedHamLord();
    }
    return instance;
};

module.exports = CannedHamLord;
