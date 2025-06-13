import { useState, useRef } from 'react'
import Canvas from './Canvas'
import Panel from './Panel'
import { RUN_STATE, STATES } from './constants'

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
    let queue: Array<Node> | null = null
    // list of nodes to check next: BFS
    let visited: Array<Node> | null = null
    // current node being checked
    let node: Node | null = null

    // Panel Variables
    // what state is currently selected
    const [stateSelection, setStateSelection] = useState<string>(STATES.WALL)
    // what state is currently selected
    const [algorithmSelection, setAlgorithmSelection] = useState<string | null>(
        'Breadth-First Search'
    )

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
        if (!startPos || !goalPos) {
            // TODO show error to place start and goal
            return
        }

        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => pathfindStep(), 0)
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
        if (!visited || !queue) {
            //TODO ERROR
            return false
        }

        return (
            x >= 0 &&
            x < width &&
            y >= 0 &&
            y < height &&
            cells.current[y][x] !== STATES.WALL &&
            !visited!.some((n) => n.x === x && n.y === y) &&
            !queue!.some((n) => n.x === x && n.y === y)
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
        if (!queue || !visited) {
            queue = [
                {
                    x: startPos.x,
                    y: startPos.y,
                    parent: null,
                },
            ]
            visited = []
        }

        // next node in queue
        if (queue.length > 0) {
            // reset last node
            if (node) {
                // mark last node's path as searched
                let n: Node | null = node
                while (n) {
                    cells.current[n.y][n.x] = STATES.SEARCHED
                    n = n.parent
                }
                // mark node as visited
                visited.push(node)
            }

            // setup next node in queue
            node = queue.shift() ?? null // '?? null' is purely for ts and shouldn't run
            // mark current path to node; marks as found if current node is the goal
            if (node) {
                const state =
                    node.x === goalPos.x && node.y === goalPos.y
                        ? STATES.FOUND
                        : STATES.PATH
                cells.current[node.y][node.x] =
                    state === STATES.FOUND
                        ? STATES.FOUND
                        : STATES.PATH_SEARCHING
                let n = node.parent
                while (n) {
                    cells.current[n.y][n.x] = state
                    n = n.parent
                }
                // re-mark start and goal positions
                cells.current[startPos.y][startPos.x] = STATES.START
                cells.current[goalPos.y][goalPos.x] = STATES.GOAL

                // found path
                if (node.x === goalPos.x && node.y === goalPos.y) {
                    setRunState(RUN_STATE.FINISHED)
                    stopPathfinding()
                    return
                }

                // find non-visited neighbors
                if (isValidNeighbor(node.x + 1, node.y)) {
                    queue.push({
                        x: node.x + 1,
                        y: node.y,
                        parent: node,
                    })
                }
                if (isValidNeighbor(node.x, node.y + 1)) {
                    queue.push({
                        x: node.x,
                        y: node.y + 1,
                        parent: node,
                    })
                }
                if (isValidNeighbor(node.x - 1, node.y)) {
                    queue.push({
                        x: node.x - 1,
                        y: node.y,
                        parent: node,
                    })
                }
                if (isValidNeighbor(node.x, node.y - 1)) {
                    queue.push({
                        x: node.x,
                        y: node.y - 1,
                        parent: node,
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

    function dfsStep() {}

    function dijkstraStep() {}

    function aStarStep() {}

    return (
        <>
            <div className="flex flex-col items-center gap-2">
                <div>{runState === RUN_STATE.NONE && 'NONE'}</div>
                <div>{runState === RUN_STATE.STARTED && 'STARTED'}</div>
                <div>{runState === RUN_STATE.PAUSED && 'PAUSED'}</div>
                <div>{runState === RUN_STATE.FINISHED && 'FINISHED'}</div>
                <div>
                    <Panel
                        stateSelection={stateSelection}
                        setStateSelection={setStateSelection}
                        algorithmSelection={algorithmSelection}
                        setAlgorithmSelection={setAlgorithmSelection}
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
