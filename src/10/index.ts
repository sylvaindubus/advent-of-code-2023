import { readFileSync } from "node:fs"

type Maze = string[][]

type Pos = [number, number]

const parseMaze = (input: string) => {
  return input.split("\n").reduce<Maze>((acc, line) => [...acc, line.split("")], [])
}

const getMazeTile = (maze: Maze, pos: Pos) => {
  const [x, y] = pos
  if (x < 0 || x >= maze.length) {
    return ""
  }
  const row = maze[x]
  if (y < 0 || y >= row.length) {
    return ""
  }
  return row[y]
}

const computeLoop = (maze: Maze) => {
  const findStart = () => {
    let startPos: Pos | undefined
    maze.some((row, rowIndex) =>
      row.some((tile, colIndex) => {
        if (tile === "S") {
          startPos = [rowIndex, colIndex]
          return true
        }
        return false
      })
    )
    if (!startPos) throw new Error("Cannot find S")

    return startPos
  }

  const getTile = (pos: Pos) => getMazeTile(maze, pos)

  const walk = (pos: Pos, prevPos: Pos): Pos => {
    const [x, y] = pos
    const [prevX, prevY] = prevPos
    const tile = getTile([x, y])
    switch (tile) {
      case "S": {
        const top: Pos = [x - 1, y]
        if ("|7F".includes(getTile(top))) {
          return top
        }
        const bottom: Pos = [x + 1, y]
        if ("|JL".includes(getTile(bottom))) {
          return [x + 1, y]
        }
        const left: Pos = [x, y - 1]
        if ("-LF".includes(getTile(left))) {
          return left
        }
        const right: Pos = [x, y + 1]
        if ("-7J".includes(getTile(right))) {
          return right
        }
        throw new Error("Blocked starting position")
      }
      case "|":
        return x > prevX ? [x + 1, y] : [x - 1, y]
      case "-":
        return y > prevY ? [x, y + 1] : [x, y - 1]
      case "L":
        return x > prevX ? [x, y + 1] : [x - 1, y]
      case "J":
        return x > prevX ? [x, y - 1] : [x - 1, y]
      case "F":
        return x < prevX ? [x, y + 1] : [x + 1, y]
      case "7":
        return x < prevX ? [x, y - 1] : [x + 1, y]
      default:
        throw new Error("Got lost")
    }
  }

  const startPoint = findStart()
  const loop: Pos[] = [startPoint]
  do {
    loop.push(walk(loop.at(-1)!, loop.at(-2) || loop.at(-1)!))
  } while (getTile(loop[loop.length - 1]) !== "S")
  return loop
}

const first = (input: string) => {
  const maze = parseMaze(input)
  const loop = computeLoop(maze)
  return Math.floor(loop.length / 2)
}

const second = (input: string) => {
  const maze = parseMaze(input)
  const loop = computeLoop(maze)

  const getTile = (pos: Pos) => getMazeTile(maze, pos)

  const loopMap = loop.reduce((map, pos) => {
    const [x, y] = pos
    return {
      ...map,
      [`${x}-${y}`]: getTile(pos) === "S" ? "J" : getTile(pos),
    }
  }, {})

  const isOutsideTop = (pos: Pos) => {
    let count = 0
    const [posX, posY] = pos
    for (let x = posX; x >= 0; x--) {
      const tile = loopMap[`${x}-${posY}`]
      if (tile) {
        if ("JF".includes(tile)) {
          count += 0.5
        } else if ("L7".includes(tile)) {
          count -= 0.5
        } else if (tile === "-") {
          count++
        }
      }
    }
    return count % 2 === 0
  }

  const isOutsideBottom = (pos: Pos) => {
    let count = 0
    const [posX, posY] = pos
    for (let x = posX + 1; x < maze.length; x++) {
      const tile = loopMap[`${x}-${posY}`]
      if (tile) {
        if ("JF".includes(tile)) {
          count += 0.5
        } else if ("L7".includes(tile)) {
          count -= 0.5
        } else if (tile === "-") {
          count++
        }
      }
    }
    return count % 2 === 0
  }

  const isOutsideLeft = (pos: Pos) => {
    let count = 0
    const [posX, posY] = pos
    for (let y = posY; y >= 0; y--) {
      const tile = loopMap[`${posX}-${y}`]
      if ("JF".includes(tile)) {
        count += 0.5
      } else if ("L7".includes(tile)) {
        count -= 0.5
      } else if (tile === "|") {
        count++
      }
    }
    return count % 2 === 0
  }

  const isOutsideRight = (pos: Pos) => {
    let count = 0
    const [posX, posY] = pos
    for (let y = posY; y < maze[0].length; y++) {
      const tile = loopMap[`${posX}-${y}`]
      if ("JF".includes(tile)) {
        count += 0.5
      } else if ("L7".includes(tile)) {
        count -= 0.5
      } else if (tile === "|") {
        count++
      }
    }
    return count % 2 === 0
  }

  let count = 0
  maze.forEach((row, x) => {
    row.forEach((_, y) => {
      if (x === 0 || x === maze.length - 1 || y === 0 || y === row.length - 1) return
      if (loopMap[`${x}-${y}`]) return
      if (isOutsideTop([x, y]) || isOutsideBottom([x, y]) || isOutsideLeft([x, y]) || isOutsideRight([x, y])) return
      count++
    })
  })

  return count
}

const input = readFileSync("src/10/input.txt", "utf8")

console.log("🎅 firstResult", first(input))
console.log("🎅 secondResult", second(input))
