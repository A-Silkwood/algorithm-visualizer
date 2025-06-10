import { useRef, useEffect, useState } from 'react'
import { STATES } from './constants'

type CanvasProps = {
    width: number
    height: number
    cellSize: number
    cells: string[][]
    setCells: React.Dispatch<React.SetStateAction<string[][]>>
    selection: string
    startPos: { x: number; y: number } | null
    setStartPos: React.Dispatch<
        React.SetStateAction<{ x: number; y: number } | null>
    >
    prevStartState: string
    setPrevStartState: React.Dispatch<React.SetStateAction<string>>
    goalPos: { x: number; y: number } | null
    setGoalPos: React.Dispatch<
        React.SetStateAction<{ x: number; y: number } | null>
    >
    prevGoalState: string
    setPrevGoalState: React.Dispatch<React.SetStateAction<string>>
}

function Canvas({
    cells,
    setCells,
    selection,
    width,
    height,
    cellSize,
    startPos,
    setStartPos,
    prevStartState,
    setPrevStartState,
    goalPos,
    setGoalPos,
    prevGoalState,
    setPrevGoalState,
}: CanvasProps) {
    // canvas element
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    // selection state
    const [isSelecting, setIsSelecting] = useState<boolean>(false)

    // update cells
    useEffect(() => {
        // get canvas context
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }

        // draw each cell in grid
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                ctx.fillStyle = cells[y][x]
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                ctx.strokeStyle = 'lightgray'
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
        }
    })

    // MOUSE FUNCTIONS
    // get cell coordinate from mouse position
    const getCellCoordinate = (
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ): { x: number; y: number } | null => {
        // get canvas reference
        const canvas = canvasRef.current
        if (!canvas) {
            return null
        }

        const canvasRect = canvas.getBoundingClientRect()
        const x = Math.floor((e.clientX - canvasRect.x) / cellSize)
        const y = Math.floor((e.clientY - canvasRect.y) / cellSize)
        return x < 0 || y < 0 || x >= width || y >= height ? null : { x, y }
    }

    // update cell with current selection
    const updateCell = (x: number, y: number) => {
        // skip cells that are already the current selection
        if (cells[y][x] === selection) {
            return
        }

        // copy cells' state
        let nextCells = cells.map((row) => {
            return [...row]
        })

        // special cases for start and goal positions
        if (selection === STATES.START) {
            // prevent multiple start positions
            if (startPos) {
                nextCells[startPos.y][startPos.x] = prevStartState
            }
            setStartPos({ x: x, y: y })
            if (cells[y][x] !== STATES.GOAL) {
                setPrevStartState(cells[y][x])
            } else {
                setPrevStartState(prevGoalState)
                setGoalPos(null)
            }
        } else if (selection === STATES.GOAL) {
            // prevent multiple goal positions
            if (goalPos) {
                nextCells[goalPos.y][goalPos.x] = prevGoalState
            }
            setGoalPos({ x: x, y: y })
            if (cells[y][x] !== STATES.START) {
                setPrevGoalState(cells[y][x])
            } else {
                setPrevGoalState(prevStartState)
                setStartPos(null)
            }
        }

        // update current coordinate
        nextCells[y][x] = selection
        setCells(nextCells)
    }

    // mouse click pressed
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // change current cell to selected state
        const coords = getCellCoordinate(e)
        if (coords) {
            setIsSelecting(true)
            updateCell(coords.x, coords.y)
        }
    }

    // mouse moved
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isSelecting) {
            return
        }

        // change current cell to selected state
        const coords = getCellCoordinate(e)
        if (coords) {
            updateCell(coords.x, coords.y)
        }
    }

    // mouse click released
    const handleMouseUp = () => setIsSelecting(false)

    return (
        <>
            <canvas
                ref={canvasRef}
                width={width * cellSize}
                height={height * cellSize}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </>
    )
}

export default Canvas
