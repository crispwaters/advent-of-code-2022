const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputFile = `${prefix}output.txt`
const printFile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString().split('\n')

const logs = []

const isDebug = false
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}

class Robot {
  oreCost = 0
  clayCost = 0
  obsidianCost = 0
  constructor(oreCost, clayCost, obsidianCost) {
    this.oreCost = Number(oreCost ?? 0)
    this.clayCost = Number(clayCost ?? 0)
    this.obsidianCost = Number(obsidianCost ?? 0)
  }

  canBuild ({ ore, clay, obsidian }) {
    return ore >= this.oreCost && clay >= this.clayCost && obsidian >= this.obsidianCost
  }

  build ({ ore, clay, obsidian, geode }) {
    return { 
      ore: ore - this.oreCost, 
      clay: clay - this.clayCost, 
      obsidian: obsidian - this.obsidianCost,
      geode
    }
  }
}

class Blueprint {
  static MATERIALS = ['ore','clay','obsidian','geode']
  blueprintNumber
  robots
  maxGeodeCount = 0
  maxCosts = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: Infinity
  }

  constructor(blueprintNumber, oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, obsidianRobotClayCost, geodeRobotOreCost, geodeRobotObsidianCost) {
    this.blueprintNumber = Number(blueprintNumber)
    this.robots = {
      ore: new Robot(oreRobotOreCost, 0 , 0),
      clay: new Robot(clayRobotOreCost, 0, 0),
      obsidian: new Robot(obsidianRobotOreCost, obsidianRobotClayCost, 0),
      geode: new Robot(geodeRobotOreCost, 0, geodeRobotObsidianCost)
    }
    for (const robot in this.robots) {
      this.maxCosts.ore = Math.max(this.maxCosts.ore, this.robots[robot].oreCost)
      this.maxCosts.clay = Math.max(this.maxCosts.clay, this.robots[robot].clayCost)
      this.maxCosts.obsidian = Math.max(this.maxCosts.ore, this.robots[robot].obsidianCost)
    }
  }

  calculateMaxGeodCount(nMinutes = 24) {
    const startState = {
      robots: {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0
      },
      materials: {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0
      },
      skip: {
        ore: false,
        clay: false,
        obsidian: false,
        geode: false
      }
    }
    const getCounts = ({ ore, clay, obsidian, geode }) => `${ore}-${clay}-${obsidian}-${geode}`
    const getCacheKey = ({robots, materials}) => `robots::${getCounts(robots)}_materials::${getCounts(materials)}`
    const cache_states = {
      1: {
        [getCacheKey(startState)]: startState
      }
    }
    const cache = (minute, state) => {
      const cache_key = getCacheKey(state)
      if (!cache_states[minute]) cache_states[minute] = {}
      if (!cache_states[minute][cache_key]) {
        cache_states[minute][cache_key] = state
      }
    }
    for (let minute = 1; minute <= nMinutes; minute++) {
      const states = cache_states[minute]
      for (const key of Object.keys(states)) {
        const state = states[key]
        // Robot cost calculates depend on materials at START of the round, cache the answer for use down below
        const materials = { ...state.materials }
        for (const material of Blueprint.MATERIALS) {
          state.materials[material] += state.robots[material]
        }
        if (minute === nMinutes) {
          this.maxGeodeCount = Math.max(this.maxGeodeCount, state.materials.geode)
        } else {
          for (const material of Blueprint.MATERIALS) {
            if (state.robots[material] >= this.maxCosts[material]) continue
            if (state.skip[material]) continue
            const robot = this.robots[material]
            if (robot.canBuild(materials)) {
              cache(minute + 1, {
                robots: {
                  ...state.robots,
                  [material]: state.robots[material] + 1
                },
                materials: {
                  ...robot.build(state.materials)
                },
                skip: {
                  ore: false,
                  clay: false,
                  obsidian: false,
                  geode: false
                }
              })
              state.skip[material] = true
            }
          }
          cache(minute + 1, state)
        }
      }
    }
  }

  getQualityLevel() {
    return this.blueprintNumber * this.maxGeodeCount
  }
}

/**
 * 
 * @param {string} line 
 * @returns {Blueprint}
 */
const readBlueprint = (line) => {
  debug(line)
  const [, 
    blueprintNumber, 
    oreRobotOreCost, 
    clayRobotOreCost, 
    obsidianRobotOreCost, 
    obsidianRobotClayCost, 
    geodeRobotOreCost, 
    geodeRobotObsidianCost
  ] = line.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./)
  return new Blueprint(blueprintNumber, oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, obsidianRobotClayCost, geodeRobotOreCost, geodeRobotObsidianCost)
}

/**
 * 
 * @param {string[]} input 
 * @returns {Blueprint[]}
 */
const readBlueprints = (input) => input.map(readBlueprint)
const blueprints = readBlueprints(input)
for (const blueprint of blueprints) {
  blueprint.calculateMaxGeodCount()
}
console.log(blueprints.reduce((acc, cur) => acc + cur.getQualityLevel(), 0))