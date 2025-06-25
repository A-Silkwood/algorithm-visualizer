import { useState, useRef } from 'react'
import Canvas from './Canvas'
import Panel from './Panel'
import { RUN_STATE, STATES, SPEED_LABELS, SPEED_VALUES } from './constants'

type Node = {
    x: number
    y: number
    parent: Node | null
    cost: number | null
}

export default function Pathfinder() {
    // Canvas Settings
    // width of grid
    const width = 50
    // height of grid
    const height = 50
    // size of each cells width and height
    const cellSize = 20

    // Pathfinding Algorithm Variables
    // cell states
    const cells = useRef<string[][]>(
        Array.from({ length: height }, () => Array(width).fill(STATES.EMPTY))
    )
    const [runState, setRunState] = useState<string>(RUN_STATE.NONE)
    // interval reference
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    // list of nodes to check next: BFS
    const queue = useRef<Array<Node> | null>(null)
    // list of nodes to check next: BFS
    const visited = useRef<Array<Node> | null>(null)
    // current node being checked
    const node = useRef<Node | null>(null)

    // Panel Variables
    // current cell state for the user to place
    const [stateSelection, setStateSelection] = useState<string>(STATES.WALL)
    // pathfinding algorithm selected to run
    const [algorithmSelection, setAlgorithmSelection] = useState<string | null>(
        'A* Search'
    )
    // visualizer speed
    const [speed, setSpeed] = useState<string | null>(SPEED_LABELS[3])

    // Canvas Variables
    // start position
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
        null
    )
    // state of the cell before changed to start position
    const [prevStartState, setPrevStartState] = useState<string>(STATES.EMPTY)
    // goal position
    const [goalPos, setGoalPos] = useState<{ x: number; y: number } | null>(
        null
    )
    // state of the cell before changed to goal position
    const [prevGoalState, setPrevGoalState] = useState<string>(STATES.EMPTY)

    // Panel Functions

    // resets the state of all cells to empty
    const onReset = () => {
        cells.current = Array.from({ length: height }, () =>
            Array(width).fill(STATES.EMPTY)
        )
        setStartPos(null)
        setGoalPos(null)
        setPrevStartState(STATES.EMPTY)
        setPrevGoalState(STATES.EMPTY)
    }

    const onPlay = () => {
        if (!startPos || !goalPos) {
            // TODO NOTIFY USER
            return
        }

        startPathfinding()
    }
    const onPause = () => {
        setRunState(RUN_STATE.PAUSED)
        stopPathfinding()
    }
    // stops pathfinding algorithm and clears all computation that has taken place TODO
    const onStop = () => {
        resetGrid()
        stopPathfinding()
    }

    // Pathfinding Functions
    // starts pathfinding algorithm TODO create pathfinding function to use in interval
    const startPathfinding = () => {
        // notify user to place start and goal prior to running
        if (!startPos || !goalPos) {
            // TODO show error
            return
        }

        // reset if previous run was finished
        if (runState === RUN_STATE.FINISHED) {
            queue.current = null
            visited.current = null
            node.current = null
            resetGrid()
        }

        setRunState(RUN_STATE.STARTED)
        if (!intervalRef.current) {
            intervalRef.current = setInterval(
                () => pathfindStep(),
                SPEED_VALUES[SPEED_LABELS.findIndex((v) => v === speed)]
            )
        }
    }

    // pauses pathfinding algorithm
    const stopPathfinding = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    // runs a step in the selected algorithm
    function pathfindStep() {
        switch (algorithmSelection) {
            case 'Breadth-First Search':
                bfsStep()
                break
            case 'Depth-First Search':
                dfsStep()
                break
            case 'A* Search':
                aStarStep()
                break
        }
    }

    // reset all pathfinding-only states to empty
    function resetGrid() {
        // clear pathfinding variables
        queue.current = null
        visited.current = null
        node.current = null

        // change all non-wall cells to empty
        for (let y = 0; y < cells.current.length; y++) {
            for (let x = 0; x < cells.current[y].length; x++) {
                if (cells.current[y][x] !== STATES.WALL) {
                    cells.current[y][x] = STATES.EMPTY
                }
            }
        }
        // set start and goal positions
        if (startPos) {
            cells.current[startPos.y][startPos.x] = STATES.START
        }
        if (goalPos) {
            cells.current[goalPos.y][goalPos.x] = STATES.GOAL
        }

        // clear run state
        setRunState(RUN_STATE.NONE)
    }

    function randInt(max: number): number {
        return Math.floor(Math.random() * max)
    }

    // creates a grid
    function generateMaze() {
        // reset grid state and set all cells to wall
        setStartPos(null)
        setGoalPos(null)
        setPrevStartState(STATES.EMPTY)
        setPrevGoalState(STATES.EMPTY)

        // defines cell data
        type Cell = {
            x: number
            y: number
            n: boolean
            e: boolean
            s: boolean
            w: boolean
        }

        // initalize variables
        const checked: Array<Cell> = []
        const next: Array<Cell> = []
        let curr: Cell = {
            x: randInt(width),
            y: randInt(height),
            n: true,
            e: true,
            s: true,
            w: true,
        }
        // align grid on an odd grid size
        if (curr.x % 2 === 1) {
            curr.x -= 1
            if (curr.x < 0) {
                curr.x += 2
            }
        }
        if (curr.y % 2 === 1) {
            curr.y -= 1
            if (curr.y < 0) {
                curr.y += 2
            }
        }
        checked.push(curr)

        // checks if cell is valid coordinates and hasn't been checked
        const isValidCell = (x: number, y: number): boolean => {
            return (
                x >= 0 &&
                x < width &&
                y >= 0 &&
                y < height &&
                !checked.some((n) => n.x === x && n.y === y) &&
                !next.some((n) => n.x === x && n.y === y)
            )
        }

        // checks if cell is valid coordinates and hasn't been checked
        const isCheckedCell = (x: number, y: number): boolean => {
            return (
                x >= 0 &&
                x < width &&
                y >= 0 &&
                y < height &&
                checked.some((n) => n.x === x && n.y === y)
            )
        }

        // adds all neighbors to next queue
        const addNeighborsToNext = (cell: Cell) => {
            if (isValidCell(cell.x + 2, cell.y)) {
                next.push({
                    x: cell.x + 2,
                    y: cell.y,
                    n: true,
                    e: true,
                    s: true,
                    w: true,
                })
            }
            if (isValidCell(cell.x, cell.y + 2)) {
                next.push({
                    x: cell.x,
                    y: cell.y + 2,
                    n: true,
                    e: true,
                    s: true,
                    w: true,
                })
            }
            if (isValidCell(cell.x - 2, cell.y)) {
                next.push({
                    x: cell.x - 2,
                    y: cell.y,
                    n: true,
                    e: true,
                    s: true,
                    w: true,
                })
            }
            if (isValidCell(cell.x, cell.y - 2)) {
                next.push({
                    x: cell.x,
                    y: cell.y - 2,
                    n: true,
                    e: true,
                    s: true,
                    w: true,
                })
            }
        }

        // initial next cells
        addNeighborsToNext(curr)

        // main loop
        while (next.length > 0) {
            curr = next.splice(randInt(next.length), 1)[0]

            // get already checked sides
            const sides = []
            if (isCheckedCell(curr.x, curr.y - 2)) {
                sides.push('n')
            }
            if (isCheckedCell(curr.x + 2, curr.y)) {
                sides.push('e')
            }
            if (isCheckedCell(curr.x, curr.y + 2)) {
                sides.push('s')
            }
            if (isCheckedCell(curr.x - 2, curr.y)) {
                sides.push('w')
            }

            // carve to random side
            const side = sides.splice(randInt(sides.length), 1)[0]
            if (side === 'n') {
                curr.n = false
            }
            if (side === 'e') {
                curr.e = false
            }
            if (side === 's') {
                curr.s = false
            }
            if (side === 'w') {
                curr.w = false
            }

            addNeighborsToNext(curr)
            checked.push(curr)
        }

        // update cell states with maze
        cells.current = Array.from({ length: height }, () =>
            Array(width).fill(STATES.WALL)
        )
        checked.forEach((c) => {
            cells.current[c.y][c.x] = STATES.EMPTY
            if (!c.n && c.y - 1 >= 0) {
                cells.current[c.y - 1][c.x] = STATES.EMPTY
            }
            if (!c.e && c.x + 1 < width) {
                cells.current[c.y][c.x + 1] = STATES.EMPTY
            }
            if (!c.s && c.y + 1 < height) {
                cells.current[c.y + 1][c.x] = STATES.EMPTY
            }
            if (!c.w && c.x - 1 >= 0) {
                cells.current[c.y][c.x - 1] = STATES.EMPTY
            }
        })
    }

    // check if cell has not been visited or in queue, within bounds, and not a wall
    function isValidNeighbor(x: number, y: number): boolean {
        // this should never run if there is no bugs
        if (!visited.current || !queue.current) {
            //TODO ERROR
            return false
        }

        return (
            x >= 0 &&
            x < width &&
            y >= 0 &&
            y < height &&
            cells.current[y][x] !== STATES.WALL &&
            !visited.current!.some((n) => n.x === x && n.y === y) &&
            !queue.current!.some((n) => n.x === x && n.y === y)
        )
    }

    // performs next step of breadth-first search
    function bfsStep() {
        // this should never run if there is no bugs
        if (!startPos || !goalPos) {
            // TODO ERROR
            return
        }

        // initialize graph
        if (!queue.current || !visited.current) {
            queue.current = [
                {
                    x: startPos.x,
                    y: startPos.y,
                    parent: null,
                    cost: null,
                },
            ]
            visited.current = []
        }

        // next node in queue
        if (queue.current.length > 0) {
            // reset last node
            if (node.current) {
                // mark last node's path as searched
                let n: Node | null = node.current
                while (n) {
                    cells.current[n.y][n.x] = STATES.SEARCHED
                    n = n.parent
                }
                // mark node as visited
                visited.current.push(node.current)
            }

            // setup next node in queue
            node.current = queue.current.shift() ?? null // '?? null' is purely for ts and shouldn't run
            // mark current path to node; marks as found if current node is the goal
            if (node.current) {
                const state =
                    node.current.x === goalPos.x && node.current.y === goalPos.y
                        ? STATES.FOUND
                        : STATES.PATH
                cells.current[node.current.y][node.current.x] =
                    state === STATES.FOUND
                        ? STATES.FOUND
                        : STATES.PATH_SEARCHING
                let n = node.current.parent
                while (n) {
                    cells.current[n.y][n.x] = state
                    n = n.parent
                }
                // re-mark start and goal positions
                cells.current[startPos.y][startPos.x] = STATES.START
                cells.current[goalPos.y][goalPos.x] = STATES.GOAL

                // found path
                if (
                    node.current.x === goalPos.x &&
                    node.current.y === goalPos.y
                ) {
                    setRunState(RUN_STATE.FINISHED)
                    stopPathfinding()
                    return
                }

                // find non-visited neighbors
                if (isValidNeighbor(node.current.x + 1, node.current.y)) {
                    queue.current.push({
                        x: node.current.x + 1,
                        y: node.current.y,
                        parent: node.current,
                        cost: null,
                    })
                    cells.current[node.current.y][node.current.x + 1] =
                        STATES.QUEUED
                }
                if (isValidNeighbor(node.current.x, node.current.y + 1)) {
                    queue.current.push({
                        x: node.current.x,
                        y: node.current.y + 1,
                        parent: node.current,
                        cost: null,
                    })
                    cells.current[node.current.y + 1][node.current.x] =
                        STATES.QUEUED
                }
                if (isValidNeighbor(node.current.x - 1, node.current.y)) {
                    queue.current.push({
                        x: node.current.x - 1,
                        y: node.current.y,
                        parent: node.current,
                        cost: null,
                    })
                    cells.current[node.current.y][node.current.x - 1] =
                        STATES.QUEUED
                }
                if (isValidNeighbor(node.current.x, node.current.y - 1)) {
                    queue.current.push({
                        x: node.current.x,
                        y: node.current.y - 1,
                        parent: node.current,
                        cost: null,
                    })
                    cells.current[node.current.y - 1][node.current.x] =
                        STATES.QUEUED
                }
            }
        } else {
            // exhausted all paths
            setRunState(RUN_STATE.FINISHED)
            stopPathfinding()
            return
        }
    }

    // performs next step of depth-first search
    function dfsStep() {
        // this should never run if there is no bugs
        if (!startPos || !goalPos) {
            // TODO ERROR
            return
        }

        // initialize graph
        if (!node.current || !visited.current || !queue.current) {
            node.current = {
                x: startPos.x,
                y: startPos.y,
                parent: null,
                cost: null,
            }
            visited.current = [node.current]
            queue.current = [] // unecessary except for error with isValidNeighbor
        } else {
            // add current node to visited
            visited.current.push(node.current)

            // find non-visited neighbors
            if (isValidNeighbor(node.current.x + 1, node.current.y)) {
                // go right
                cells.current[node.current.y][node.current.x] = STATES.PATH
                node.current = {
                    x: node.current.x + 1,
                    y: node.current.y,
                    parent: node.current,
                    cost: null,
                }
                cells.current[node.current.y][node.current.x] =
                    STATES.PATH_SEARCHING
            } else if (isValidNeighbor(node.current.x, node.current.y + 1)) {
                // go down
                cells.current[node.current.y][node.current.x] = STATES.PATH
                node.current = {
                    x: node.current.x,
                    y: node.current.y + 1,
                    parent: node.current,
                    cost: null,
                }
                cells.current[node.current.y][node.current.x] =
                    STATES.PATH_SEARCHING
            } else if (isValidNeighbor(node.current.x - 1, node.current.y)) {
                // go left
                cells.current[node.current.y][node.current.x] = STATES.PATH
                node.current = {
                    x: node.current.x - 1,
                    y: node.current.y,
                    parent: node.current,
                    cost: null,
                }
                cells.current[node.current.y][node.current.x] =
                    STATES.PATH_SEARCHING
            } else if (isValidNeighbor(node.current.x, node.current.y - 1)) {
                // go up
                cells.current[node.current.y][node.current.x] = STATES.PATH
                node.current = {
                    x: node.current.x,
                    y: node.current.y - 1,
                    parent: node.current,
                    cost: null,
                }
                cells.current[node.current.y][node.current.x] =
                    STATES.PATH_SEARCHING
            } else {
                // exhausted current path; start backtracking
                cells.current[node.current.y][node.current.x] = STATES.SEARCHED
                node.current = node.current.parent
                if (node.current) {
                    cells.current[node.current.y][node.current.x] =
                        STATES.PATH_SEARCHING
                } else {
                    // exhausted all possible paths
                    cells.current[startPos.y][startPos.x] = STATES.START
                    setRunState(RUN_STATE.FINISHED)
                    stopPathfinding()
                    return
                }
            }

            // ensure start is not overwritten
            cells.current[startPos.y][startPos.x] = STATES.START

            // check if we are at the goal
            // found path
            if (node.current.x === goalPos.x && node.current.y === goalPos.y) {
                cells.current[goalPos.y][goalPos.x] = STATES.GOAL
                setRunState(RUN_STATE.FINISHED)
                stopPathfinding()
                return
            }
        }
    }

    // inserts node into min heap
    function minHeapInsert(node: Node) {
        if (queue.current) {
            queue.current.push(node)

            // heapify up
            let ix = queue.current.length - 1
            while (ix > 0) {
                const parent = Math.floor((ix - 1) / 2)
                if (
                    getEstimatedCost(queue.current[ix]) <=
                    getEstimatedCost(queue.current[parent])
                ) {
                    minHeapSwap(ix, parent)
                    ix = parent
                } else {
                    ix = 0
                }
            }
        }
    }

    // gets smallest cost from min heap
    function getMinHeapMinimum(): Node | null {
        if (queue.current) {
            if (queue.current.length === 0) {
                return null
            }

            // heapify down
            const min = queue.current[0]
            if (queue.current.length > 1) {
                queue.current[0] = queue.current.pop()!
                let ix = 0
                while (ix < queue.current.length) {
                    const left = ix * 2 + 1
                    const right = ix * 2 + 2
                    let smallest = ix

                    if (
                        left < queue.current.length &&
                        getEstimatedCost(queue.current[left]) <
                            getEstimatedCost(queue.current[smallest])
                    ) {
                        smallest = left
                    }
                    if (
                        right < queue.current.length &&
                        getEstimatedCost(queue.current[right]) <
                            getEstimatedCost(queue.current[smallest])
                    ) {
                        smallest = right
                    }
                    if (smallest !== ix) {
                        minHeapSwap(ix, smallest)
                        ix = smallest
                    } else {
                        ix = queue.current.length
                    }
                }
            } else {
                queue.current.pop()
            }
            return min
        }

        return null
    }

    // swap 2 values in min heap
    function minHeapSwap(a: number, b: number) {
        if (queue.current) {
            const temp = queue.current[a]
            queue.current[a] = queue.current[b]
            queue.current[b] = temp
        }
    }

    // return sum of heuristic and cost from start
    function getEstimatedCost(node: Node): number {
        if (goalPos && node.cost) {
            const h =
                Math.abs(goalPos.x - node.x) + Math.abs(goalPos.y - node.y)
            return node.cost + h
        }
        return -1
    }

    function aStarStep() {
        // this should never run if there is no bugs
        if (!startPos || !goalPos) {
            // TODO ERROR
            return
        }

        // initialize graph
        if (!queue.current || !visited.current) {
            queue.current = []
            minHeapInsert({
                x: startPos.x,
                y: startPos.y,
                parent: null,
                cost: 0,
            })
            visited.current = []
        }

        // next node in queue
        if (queue.current.length > 0) {
            // reset last node
            if (node.current) {
                // mark last node's path as searched
                let n: Node | null = node.current
                while (n) {
                    cells.current[n.y][n.x] = STATES.SEARCHED
                    n = n.parent
                }
                // mark node as visited
                visited.current.push(node.current)
            }

            // setup next node in queue
            node.current = getMinHeapMinimum()
            // mark current path to node; marks as found if current node is the goal
            if (node.current) {
                const state =
                    node.current.x === goalPos.x && node.current.y === goalPos.y
                        ? STATES.FOUND
                        : STATES.PATH
                cells.current[node.current.y][node.current.x] =
                    state === STATES.FOUND
                        ? STATES.FOUND
                        : STATES.PATH_SEARCHING
                let n = node.current.parent
                while (n) {
                    cells.current[n.y][n.x] = state
                    n = n.parent
                }
                // re-mark start and goal positions
                cells.current[startPos.y][startPos.x] = STATES.START
                cells.current[goalPos.y][goalPos.x] = STATES.GOAL

                // found path
                if (
                    node.current.x === goalPos.x &&
                    node.current.y === goalPos.y
                ) {
                    setRunState(RUN_STATE.FINISHED)
                    stopPathfinding()
                    return
                }

                // find non-visited neighbors
                if (isValidNeighbor(node.current.x + 1, node.current.y)) {
                    minHeapInsert({
                        x: node.current.x + 1,
                        y: node.current.y,
                        parent: node.current,
                        cost: node.current.cost! + 1,
                    })
                    cells.current[node.current.y][node.current.x + 1] =
                        STATES.QUEUED
                }
                if (isValidNeighbor(node.current.x, node.current.y + 1)) {
                    minHeapInsert({
                        x: node.current.x,
                        y: node.current.y + 1,
                        parent: node.current,
                        cost: node.current.cost! + 1,
                    })
                    cells.current[node.current.y + 1][node.current.x] =
                        STATES.QUEUED
                }
                if (isValidNeighbor(node.current.x - 1, node.current.y)) {
                    minHeapInsert({
                        x: node.current.x - 1,
                        y: node.current.y,
                        parent: node.current,
                        cost: node.current.cost! + 1,
                    })
                    cells.current[node.current.y][node.current.x - 1] =
                        STATES.QUEUED
                }
                if (isValidNeighbor(node.current.x, node.current.y - 1)) {
                    minHeapInsert({
                        x: node.current.x,
                        y: node.current.y - 1,
                        parent: node.current,
                        cost: node.current.cost! + 1,
                    })
                    cells.current[node.current.y - 1][node.current.x] =
                        STATES.QUEUED
                }
            }
        } else {
            // exhausted all paths
            setRunState(RUN_STATE.FINISHED)
            stopPathfinding()
            return
        }
    }

    return (
        <>
            <div className="flex flex-col items-center gap-2">
                <div>
                    <Panel
                        stateSelection={stateSelection}
                        setStateSelection={setStateSelection}
                        algorithmSelection={algorithmSelection}
                        setAlgorithmSelection={setAlgorithmSelection}
                        resetGrid={resetGrid}
                        createMaze={generateMaze}
                        speed={speed}
                        setSpeed={setSpeed}
                        runState={runState}
                        onReset={onReset}
                        onPlay={onPlay}
                        onPause={onPause}
                        onStop={onStop}
                    />
                </div>
                <div>
                    <Canvas
                        width={width}
                        height={height}
                        cellSize={cellSize}
                        cells={cells}
                        selection={stateSelection}
                        runState={runState}
                        resetGrid={resetGrid}
                        startPos={startPos}
                        setStartPos={setStartPos}
                        prevStartState={prevStartState}
                        setPrevStartState={setPrevStartState}
                        goalPos={goalPos}
                        setGoalPos={setGoalPos}
                        prevGoalState={prevGoalState}
                        setPrevGoalState={setPrevGoalState}
                    />
                </div>
            </div>
        </>
    )
}
