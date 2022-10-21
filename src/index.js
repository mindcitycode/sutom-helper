import { solver } from 'sutom-solve-cli/src/solver.js'
import { getWordList, Dictionaries } from 'sutom-solve-cli/src/dict.js'

const start = async () => {

    const readProjectFile = async name => (await fetch(name)).text()

    const words = await getWordList(Dictionaries.french, readProjectFile)

    const solve = solver(words)
    const pattern = ['m','.','.','.','.','.']
    const extra = ['e']
    const solutions = solve(pattern, extra)

    console.log(solutions)
}
start()

