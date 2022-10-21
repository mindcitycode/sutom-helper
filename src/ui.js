import './style.css'
const el = (tagName, className, textContent, attributes) => {
    //console.log({ tagName, className, attributes, textContent })
    const $e = document.createElement(tagName)
    if (className) $e.classList.add(className)
    if (attributes) Object.entries(attributes).forEach(([n, v]) => $e.setAttribute(n, v))
    if (textContent) $e.textContent = textContent
    return $e
}
export const Ui = (letters, nCols, minWordLength, maxWordLength, solve) => {
    //letters, defaultWordLength, minWordLength, maxWordLength, solve

    const updateResults = () => {
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
        console.log('pattern', pattern)
        console.log('extra', extra)
        console.log('forbidden', forbidden)
        const results = solve(pattern,extra,forbidden) 
        $c.querySelector('.results').textContent = ( results.length?results:(['no result'])).join("\n")
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
    const Results = () => {
        const $e = el('pre', 'results')
        return $e
    }

    const $c = el('div', 'container')
    document.body.appendChild($c)
    for (let i = 0; i < maxWordLength; i++) {
        const $letterCol = LetterCol(i)
        $c.appendChild($letterCol)
    }
    updateColsVisibility()
    $c.appendChild(AddCol())
    $c.appendChild(RemoveCol())
    $c.appendChild(Results())


}
