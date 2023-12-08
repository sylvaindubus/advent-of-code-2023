import { readFileSync } from "node:fs"

const input = readFileSync("src/06/input.txt", "utf8")

const spaceRegex = /\s+/g

const parse = (input: string) => {
  const [timeLine, distanceLine] = input.split("\n")
  const matchTime = /Time:\s+([\d+\s+]+)/.exec(timeLine)
  const matchDistance = /Distance:\s+([\d+\s+]+)/.exec(distanceLine)
  if (!matchTime || !matchDistance) {
    throw new Error("Bad input")
  }

  return [matchTime[1], matchDistance[1]]
}

const first = (input: string) => {
  const [rawTime, rawDistance] = parse(input)

  const times = rawTime.split(spaceRegex).map(Number)
  const distances = rawDistance.split(spaceRegex).map(Number)

  const games: number[][] = []
  for (let i = 0; i < Math.min(times.length, distances.length); i++) {
    games.push([times[i], distances[i]])
  }

  return games.reduce((score, [time, distance]) => {
    let wins = 0
    for (let i = 1; i < time; i++) {
      const thisDistance = i * (time - i)
      if (thisDistance > distance) {
        wins++
      }
    }
    return score * wins
  }, 1)
}

const second = (input: string) => {
  const [rawTime, rawDistance] = parse(input)

  const time = Number(rawTime.replace(spaceRegex, ""))
  const distance = Number(rawDistance.replace(spaceRegex, ""))

  // Well, quite bruteforcing method, could be better with bisection
  let wins = 0
  for (let i = 1; i < time; i++) {
    const thisDistance = i * (time - i)
    if (thisDistance > distance) {
      wins++
    }
  }
  return wins
}

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
