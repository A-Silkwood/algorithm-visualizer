import { useRef, useEffect, useState } from 'react'
import Canvas from '@/features/path-finding/Canvas'
import { STATES } from '@/features/path-finding/constants'

type PathfinderProps = {}

function Pathfinder({}: PathfinderProps) {
    return (
        <>
            <div>
                <Panel />
            </div>
            <div>
                <Canvas />
            </div>
        </>
    )
}

export default Pathfinder
