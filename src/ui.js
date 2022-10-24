import './style.css'
const el = (tagName, className, textContent, attributes) => {
    //console.log({ tagName, className, attributes, textContent })
    const $e = document.createElement(tagName)
    if (className) $e.classList.add(className)
    if (attributes) Object.entries(attributes).forEach(([n, v]) => $e.setAttribute(n, v))
    if (textContent) $e.textContent = textContent
    return $e
}
const resultCountText = resultCount => (resultCount > 1) ? `${resultCount} résultats` : (resultCount === 1) ? `unique résultat` : `aucun résultat`


export const Ui = (letters, nCols, minWordLength, maxWordLength, solve) => {
    //letters, defaultWordLength, minWordLength, maxWordLength, solve

    const updateResults = () => {
        const gatherInput = () => {
            const $letterCols = [...$c.querySelectorAll(".letter-col")].slice(0, nCols)
            const pattern = $letterCols.map(() => '.')
            const extra = []
            const forbidden = []
            $letterCols.forEach(($letterCol, colNum) => {
                const $never = [...$letterCol.querySelectorAll('.never-place')]
                if ($never.length) forbidden.push(...$never.map($letterCell => $letterCell.getAttribute('letter')))
                const $wrong = [...$letterCol.querySelectorAll('.wrong-place')]
                if ($wrong.length) extra.push(...$wrong.map($letterCell => $letterCell.getAttribute('letter')))
                if ($wrong.length) pattern[colNum] = '/' + $wrong.map($letterCell => $letterCell.getAttribute('letter')).join('')
                const $right = $letterCol.querySelectorAll('.right-place')[0]
                if ($right) pattern[colNum] = $right.getAttribute('letter')

            })
            return { pattern, extra, forbidden }
        }
        const { pattern, extra, forbidden } = gatherInput()
        const inputSummaryString = [
            pattern.join(' '),
            (extra.length ? (`+ ${extra.join(' ')}`) : (undefined)),
            (forbidden.length ? (`- ${forbidden.join(' ')}`) : undefined)
        ].filter(s => s !== undefined).join(' ')

        $c.querySelector('.input-summary').textContent = inputSummaryString

        console.log('pattern', pattern)
        console.log('extra', extra)
        console.log('forbidden', forbidden)

        const results = solve(pattern, extra, forbidden)
        $c.querySelector('.result-count').textContent = resultCountText(results.length)
        $c.querySelector('.results').innerHTML = ''

        const maxDisplayed = 200
        const displayList = results.slice(0,maxDisplayed)
        if (maxDisplayed < results.length){
            displayList.push('...')
        } 
        displayList.forEach( result => {
            const $e = el('span','result-word',result.toUpperCase())
            $c.querySelector('.results').append($e)
        })
       
        // update indirect forbidden
        const $letterCells = [...$c.querySelectorAll('.letter-cell')]
        $letterCells.forEach($letterCell => {
            const letter = $letterCell.getAttribute('letter')


            if (forbidden.includes(letter)) {
                $letterCell.classList.add('indirect-forbidden')
            } else {
                $letterCell.classList.remove('indirect-forbidden')
            }
        })
    }
    const letterClicked = (letter, colNum) => ({ target: $letterCol }) => {
        circulateLetterStatus(letter, colNum, $letterCol)
        updateResults()
    }
    const changeWordLength = diff => () => {
        nCols = Math.max(minWordLength, Math.min(nCols + diff, maxWordLength))
        updateColsVisibility()
        updateResults()
    }
    const updateColsVisibility = () => {
        $c.querySelectorAll(".letter-col").forEach(($letterCol) => {
            const colNum = parseInt($letterCol.getAttribute('colNum'))
            if (colNum < nCols) $letterCol.classList.remove('not-visible')
            else $letterCol.classList.add('not-visible')
        })
    }
    const circulateLetterStatus = (letter, colNum, $letterCell) => {
        const cl = $letterCell.classList
        if (cl.contains("right-place")) {
            cl.remove("right-place")
            cl.add("wrong-place")
        } else if (cl.contains("wrong-place")) {
            cl.remove("wrong-place")
            cl.add("never-place")
        } else if (cl.contains("never-place")) {
            cl.remove("never-place")
        } else {
            cl.add("right-place")
        }
    }
    const Container = (maxWordLength) => {
        const $c = el('div', 'container')
        return $c
    }
    const InputSummary = () => {
        const $e = el('pre', 'input-summary')
        return $e
    }
    const LetterCols = (maxWordLength) => {
        const $c = el('div', 'container')
        for (let i = 0; i < maxWordLength; i++) {
            const $letterCol = LetterCol(i)
            $c.appendChild($letterCol)
        }
        return $c
    }
    const LetterCol = (colNum) => {
        const $letterCol = el('div', 'letter-col', undefined, { colNum })
        letters.forEach((letter, colNum) => {
            const $letterCell = LetterCell(letter, colNum)
            $letterCol.appendChild($letterCell)
        })
        return $letterCol
    }
    const LetterCell = (letter, colNum) => {
        const $letterCell = el('button', 'letter-cell', letter, { letter, colNum })
        $letterCell.onclick = letterClicked(letter, colNum)
        return $letterCell
    }
    const AddCol = () => {
        const $b = el('button', 'change-col-size', "+")
        $b.onclick = changeWordLength(1)
        return $b
    }
    const RemoveCol = () => {
        const $b = el('button', 'change-col-size', "-")
        $b.onclick = changeWordLength(-1)
        return $b
    }
    const AddRemoveCol = () => {
        const $e = el('div', 'change-col-size-bar')
        $e.append(AddCol())
        $e.append(RemoveCol())
        return $e
    }
    const ResultCount = () => {
        const $e = el('div', 'result-count')
        return $e
    }
    const Results = () => {
        const $e = el('div', 'results')
        return $e
    }
    const $c = Container()
    $c.appendChild(InputSummary())
    $c.appendChild(LetterCols(maxWordLength))
    $c.appendChild(AddRemoveCol())
    $c.appendChild(ResultCount())
    $c.appendChild(Results())
    updateColsVisibility()
    updateResults()
    document.body.appendChild($c)


}
