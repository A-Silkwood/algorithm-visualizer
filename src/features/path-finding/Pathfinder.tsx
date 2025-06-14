import { useState, useRef } from 'react'
import Canvas from './Canvas'
import Panel from './Panel'
import { RUN_STATE, STATES, SPEED_LABELS, SPEED_VALUES } from './constants'

type Node = {
    x: number
    y: number
    parent: Node | null
}

export default function Pathfinder() {
    // Canvas Settings
    // width of grid
    const width = 10
    // height of grid
    const height = 10
    // size of each cells width and height
    const cellSize = 80

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
        'Depth-First Search'
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

        setRunState(RUN_STATE.STARTED)
        startPathfinding()
    }
    const onPause = () => {
        setRunState(RUN_STATE.PAUSED)
        stopPathfinding()
    }
    // stops pathfinding algorithm and clears all computation that has taken place TODO
    const onStop = () => {
        resetGrid()
        setRunState(RUN_STATE.NONE)
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
            setRunState(RUN_STATE.NONE)
        }

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
            case "Dijkstra's Algorithm":
                dijkstraStep()
                break
            case 'A* Search':
                aStarStep()
                break
        }
    }

    // reset all pathfinding-only states to empty
    function resetGrid() {
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
                    })
                }
                if (isValidNeighbor(node.current.x, node.current.y + 1)) {
                    queue.current.push({
                        x: node.current.x,
                        y: node.current.y + 1,
                        parent: node.current,
                    })
                }
                if (isValidNeighbor(node.current.x - 1, node.current.y)) {
                    queue.current.push({
                        x: node.current.x - 1,
                        y: node.current.y,
                        parent: node.current,
                    })
                }
                if (isValidNeighbor(node.current.x, node.current.y - 1)) {
                    queue.current.push({
                        x: node.current.x,
                        y: node.current.y - 1,
                        parent: node.current,
                    })
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

    function dijkstraStep() {}

    function aStarStep() {}

    return (
        <>
            <div className="flex flex-col items-center gap-2">
                <div>
                    <Panel
                        stateSelection={stateSelection}
                        setStateSelection={setStateSelection}
                        algorithmSelection={algorithmSelection}
                        setAlgorithmSelection={setAlgorithmSelection}
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
