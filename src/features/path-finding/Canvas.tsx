import { useRef, useEffect, useState } from 'react'
import { STATES } from './constants'

type CanvasProps = {
    width?: number
    height?: number
    cellSize?: number
    selection?: string
}

function Canvas({
    width = 50,
    height = 50,
    cellSize = 16,
    selection = STATES.WALL,
}: CanvasProps) {
    // canvas element
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    // selection state
    const [isSelecting, setIsSelecting] = useState(false)
    // cell states
    const [cells, setCells] = useState<string[][]>(
        Array.from({ length: height }, () => Array(width).fill(STATES.EMPTY))
    )

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

    const updateCell = (x: number, y: number) => {
        if (cells[y][x] === selection) {
            return
        }

        setCells(
            cells.map((row, r) => {
                if (r === y) {
                    return row.map((cell, c) => {
                        return c === x ? selection : cell
                    })
                } else {
                    return [...row]
                }
            })
        )
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
