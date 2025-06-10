import Button from '@/components/inputs/button/Button'
import Dropdown from '@/components/inputs/dropdown/Dropdown'
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
    selection: string
    setSelection: React.Dispatch<React.SetStateAction<string>>
    isRunning: boolean
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
    onReset: () => void
}

export default function Panel({
    selection,
    setSelection,
    isRunning,
    setIsRunning,
    onReset,
}: PanelProps) {
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
                            iconSize={40}
                            bgClassOverride={
                                selection === STATES.WALL
                                    ? 'bg-amber-200 hover:bg-amber-300 active:bg-amber-400 disabled:bg-gray-300'
                                    : undefined
                            }
                            onClick={() => setSelection(STATES.WALL)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Eraser"
                            icon={EraserIcon}
                            iconWeight="duotone"
                            iconSize={40}
                            bgClassOverride={
                                selection === STATES.EMPTY
                                    ? 'bg-amber-200 hover:bg-amber-300 active:bg-amber-400 disabled:bg-gray-300'
                                    : undefined
                            }
                            onClick={() => setSelection(STATES.EMPTY)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Place Start Position"
                            icon={FlagIcon}
                            iconWeight="fill"
                            iconSize={40}
                            btnClass="text-emerald-400"
                            bgClassOverride={
                                selection === STATES.START
                                    ? 'bg-amber-200 hover:bg-amber-300 active:bg-amber-400 disabled:bg-gray-300'
                                    : undefined
                            }
                            onClick={() => setSelection(STATES.START)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Place Goal"
                            icon={FlagIcon}
                            iconWeight="fill"
                            iconSize={40}
                            btnClass="text-red-400"
                            bgClassOverride={
                                selection === STATES.GOAL
                                    ? 'bg-amber-200 hover:bg-amber-300 active:bg-amber-400 disabled:bg-gray-300'
                                    : undefined
                            }
                            onClick={() => setSelection(STATES.GOAL)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Reset Board"
                            icon={ArrowsCounterClockwiseIcon}
                            iconWeight="regular"
                            iconSize={40}
                            disabled={isRunning}
                            onClick={onReset}
                        />
                    </div>
                    <div>
                        <Button
                            title="Create Maze"
                            icon={BlueprintIcon}
                            iconWeight="regular"
                            iconSize={40}
                            disabled
                        />
                    </div>
                    <div>
                        <Dropdown
                            title="Algorithm"
                            placeholder="Select an algorithm"
                            options={[
                                'Depth-First Search',
                                'Breadth-First Search',
                                "Dijkstra's Algorithm",
                                'A* Search',
                            ]}
                            defaultOption="Dijkstra's Algorithm"
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Run"
                            icon={isRunning ? PauseIcon : PlayIcon}
                            iconWeight="fill"
                            iconSize={40}
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
                            iconSize={40}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
