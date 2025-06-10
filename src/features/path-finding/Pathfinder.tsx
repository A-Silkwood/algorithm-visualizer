import { useState } from 'react'
import Canvas from './Canvas'
import Panel from './Panel'
import { STATES } from './constants'

type PathfinderProps = {}

export default function Pathfinder({}: PathfinderProps) {
    const width = 10
    const height = 10
    const cellSize = 80

    // cell states
    const [cells, setCells] = useState<string[][]>(
        Array.from({ length: height }, () => Array(width).fill(STATES.EMPTY))
    )
    // what state is currently selected
    const [selection, setSelection] = useState<string>(STATES.WALL)
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
    // if the program is running
    const [isRunning, setIsRunning] = useState<boolean>(false)

    const onReset = () => {
        setCells(
            Array.from({ length: height }, () =>
                Array(width).fill(STATES.EMPTY)
            )
        )
        setStartPos(null)
        setGoalPos(null)
        setPrevStartState(STATES.EMPTY)
        setPrevGoalState(STATES.EMPTY)
    }

    return (
        <>
            <div className="flex flex-col items-center gap-2">
                <div>
                    <Panel
                        selection={selection}
                        setSelection={setSelection}
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        onReset={onReset}
                    />
                </div>
                <div>
                    <Canvas
                        width={width}
                        height={height}
                        cellSize={cellSize}
                        cells={cells}
                        setCells={setCells}
                        selection={selection}
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
