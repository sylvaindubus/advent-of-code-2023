import { readFileSync } from "node:fs"

let jokerMode = false

const types = {
  fiveOfAKind: 7,
  fourOfAKind: 6,
  fullHouse: 5,
  threeOfAKind: 4,
  twoPair: 3,
  onePair: 2,
  highCard: 1,
}

const getCardStrength = (card: string) => {
  switch (card) {
    case "A":
      return 14
    case "K":
      return 13
    case "Q":
      return 12
    case "J":
      return jokerMode ? 1 : 11
    case "T":
      return 10
    default:
      return Number(card)
  }
}

const getHandStrength = (hand: string) => {
  let jokers = 0
  const cardMap: Record<string, number> = hand.split("").reduce((map, card) => {
    if (jokerMode && card === "J") {
      jokers++
      return map
    }
    if (card in map) {
      map[card]++
    } else {
      map[card] = 1
    }
    return map
  }, {})

  const occurences = Object.values(cardMap).sort((a, b) => b - a)
  if (jokers) {
    occurences[0] = occurences[0] ? occurences[0] + jokers : jokers
  }

  if (occurences.includes(5)) {
    return types.fiveOfAKind
  }
  if (occurences.includes(4)) {
    return types.fourOfAKind
  }
  if (occurences.includes(3) && occurences.includes(2)) {
    return types.fullHouse
  }
  if (occurences.includes(3)) {
    return types.threeOfAKind
  }
  if (occurences[0] === 2 && occurences[1] === 2) {
    return types.twoPair
  }
  if (occurences.includes(2)) {
    return types.onePair
  }
  return types.highCard
}

// const getJokerCount = (hand: string) => {
//   if (!jokerMode) return 0
//   const regex = /J/g
//   return ((hand || "").match(regex) || []).length
// }

const compareCards = (hand1: string, hand2: string) => {
  for (let i = 0; i < 5; i++) {
    const diff = getCardStrength(hand1[i]) - getCardStrength(hand2[i])
    if (diff !== 0) return diff
  }
  return 0
}

const sortHands = (hand1: string, hand2: string) => {
  const strengthDiff = getHandStrength(hand1) - getHandStrength(hand2)
  if (strengthDiff !== 0) return strengthDiff
  // Just another rule I've invented by misreading the problem :/
  // const jokerDiff = getJokerCount(hand2) - getJokerCount(hand1)
  // if (jokerDiff !== 0) return jokerDiff
  return compareCards(hand1, hand2)
}

const sortGames = (game1: string[], game2: string[]) => {
  return sortHands(game1[0], game2[0])
}

const first = (input: string) => {
  jokerMode = false
  const sortedHands = input
    .split("\n")
    .map((line) => line.split(" "))
    .sort(sortGames)

  return sortedHands.reduce((sum, [_, bid], index) => sum + Number(bid) * (index + 1), 0)
}

const second = (input: string) => {
  jokerMode = true
  const sortedHands = input
    .split("\n")
    .map((line) => line.split(" "))
    .sort(sortGames)

  return sortedHands.reduce((sum, [_, bid], index) => sum + Number(bid) * (index + 1), 0)
}

const input = readFileSync("src/07/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
