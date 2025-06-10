// import { useRef, useEffect, useState } from 'react'
import Button from '@/components/Input/Button/Button'
import {
    WallIcon,
    EraserIcon,
    FlagIcon,
    BlueprintIcon,
    PlayIcon,
    PauseIcon,
    StopIcon,
    ArrowsCounterClockwiseIcon,
} from '@phosphor-icons/react'
import { STATES } from './constants'

type PanelProps = {
    setSelection: React.Dispatch<React.SetStateAction<string>>
    isRunning: boolean
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
    onReset: () => void
}

function Panel({ setSelection, isRunning, setIsRunning, onReset }: PanelProps) {
    return (
        <>
            <div className="rounded-xl shadow bg-white w-min">
                <div className="flex justify-center items-center font-bold text-slate-800 py-1">
                    <h2>Tool Panel</h2>
                </div>
                <div className="flex flex-row gap-1 justify-center p-2 pt-0">
                    <div>
                        <Button
                            title="Place Walls"
                            icon={WallIcon}
                            iconWeight="fill"
                            onClick={() => setSelection(STATES.WALL)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Eraser"
                            icon={EraserIcon}
                            iconWeight="duotone"
                            onClick={() => setSelection(STATES.EMPTY)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Place Start Position"
                            icon={FlagIcon}
                            iconWeight="fill"
                            btnClass="text-emerald-400"
                            onClick={() => setSelection(STATES.START)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Place Goal"
                            icon={FlagIcon}
                            iconWeight="fill"
                            btnClass="text-red-400"
                            onClick={() => setSelection(STATES.GOAL)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Reset Board"
                            icon={ArrowsCounterClockwiseIcon}
                            iconWeight="regular"
                            disabled={isRunning}
                            onClick={onReset}
                        />
                    </div>
                    <div>
                        <Button
                            title="Create Maze"
                            icon={BlueprintIcon}
                            iconWeight="regular"
                            disabled
                        />
                    </div>
                    <div>
                        <Button
                            title="Run"
                            icon={isRunning ? PauseIcon : PlayIcon}
                            iconWeight="fill"
                            btnClass={
                                isRunning
                                    ? 'text-amber-400'
                                    : 'text-emerald-400'
                            }
                            onClick={() => setIsRunning(!isRunning)}
                        />
                    </div>
                    <div>
                        <Button
                            title="Stop"
                            icon={StopIcon}
                            iconWeight="fill"
                            disabled
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Panel
