import { solver } from 'sutom-solve-cli/src/solver.js'
import { getWordList, Dictionaries } from 'sutom-solve-cli/src/dict.js'
import { Ui } from './ui'
const start = async () => {

    const readProjectFile = async name => (await fetch(name)).text()
    const words = await getWordList(Dictionaries.french, readProjectFile)

    const letters = words.join('').split('')
        .reduce((list, l) => {
            if (!list.includes(l))
                list.push(l)
            return list
        }, [])
        .filter(l => l.match(/\p{L}/u))
        .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))


    const minWordLength = words.reduce((min, l) => Math.min(min, l.length), Number.POSITIVE_INFINITY)
    const maxWordLength = words.reduce((min, l) => Math.max(min, l.length), Number.NEGATIVE_INFINITY)
    
    const solve = solver(words)
    const defaultWordLength = 5
    const ui = Ui(letters, defaultWordLength, minWordLength, maxWordLength, solve )


    const pattern = ['m', '.', '.', '.', '.', '.']
    const extra = ['e']
    const solutions = solve(pattern, extra, [])

    console.log(solutions)
}
start()

