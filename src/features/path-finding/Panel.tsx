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
    stateSelection: string
    setStateSelection: React.Dispatch<React.SetStateAction<string>>
    algorithmSelection: string | null
    setAlgorithmSelection: React.Dispatch<React.SetStateAction<string | null>>
    isRunning: boolean
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
    onReset: () => void
    onStop: () => void
}

export default function Panel({
    stateSelection,
    setStateSelection,
    algorithmSelection,
    setAlgorithmSelection,
    isRunning,
    setIsRunning,
    onReset,
    onStop,
}: PanelProps) {
    return (
        <>
            <div className="rounded-xl shadow bg-white w-min">
                <div className="flex justify-center items-center font-bold text-slate-800 py-1">
                    <h2>Tool Panel</h2>
                </div>
                <div className="flex flex-row justify-center p-2 pt-0">
                    <div>
                        <Button
                            title="Place Walls"
                            icon={WallIcon}
                            iconWeight="fill"
                            iconSize={32}
                            btnClass={
                                stateSelection === STATES.WALL
                                    ? 'border-4 border-blue-600 disabled:border-gray-300'
                                    : 'border-4 border-blue-100 disabled:border-gray-300'
                            }
                            onClick={() => setStateSelection(STATES.WALL)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Eraser"
                            icon={EraserIcon}
                            iconWeight="duotone"
                            iconSize={32}
                            btnClass={
                                stateSelection === STATES.EMPTY
                                    ? 'border-4 border-blue-600 disabled:border-gray-300'
                                    : 'border-4 border-blue-100 disabled:border-gray-300'
                            }
                            onClick={() => setStateSelection(STATES.EMPTY)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Place Start Position"
                            icon={FlagIcon}
                            iconWeight="fill"
                            iconSize={32}
                            btnClass={
                                stateSelection === STATES.START
                                    ? 'border-4 border-blue-600 disabled:border-gray-300 text-emerald-400'
                                    : 'border-4 border-blue-100 disabled:border-gray-300 text-emerald-400'
                            }
                            onClick={() => setStateSelection(STATES.START)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Place Goal"
                            icon={FlagIcon}
                            iconWeight="fill"
                            iconSize={32}
                            btnClass={
                                stateSelection === STATES.GOAL
                                    ? 'border-4 border-blue-600 disabled:border-gray-300 text-red-400'
                                    : 'border-4 border-blue-100 disabled:border-gray-300 text-red-400'
                            }
                            onClick={() => setStateSelection(STATES.GOAL)}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Reset Board"
                            icon={ArrowsCounterClockwiseIcon}
                            iconWeight="regular"
                            iconSize={32}
                            btnClass="border-4 border-blue-100 disabled:border-gray-300"
                            disabled={isRunning}
                            onClick={onReset}
                        />
                    </div>
                    <div>
                        <Button
                            title="Create Maze"
                            icon={BlueprintIcon}
                            iconWeight="regular"
                            iconSize={32}
                            btnClass="border-4 border-blue-100 disabled:border-gray-300"
                            disabled
                        />
                    </div>
                    <div>
                        <Dropdown
                            title="Algorithm"
                            placeholder="Select an algorithm"
                            options={[
                                'Breadth-First Search',
                                'Depth-First Search',
                                "Dijkstra's Algorithm",
                                'A* Search',
                            ]}
                            value={algorithmSelection}
                            onChange={setAlgorithmSelection}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <Button
                            title="Run"
                            icon={isRunning ? PauseIcon : PlayIcon}
                            iconWeight="fill"
                            iconSize={32}
                            btnClass={
                                isRunning
                                    ? 'text-amber-400 border-4 border-blue-100 disabled:border-gray-300'
                                    : 'text-emerald-400 border-4 border-blue-100 disabled:border-gray-300'
                            }
                            onClick={() => setIsRunning(!isRunning)}
                        />
                    </div>
                    <div>
                        <Button
                            title="Stop"
                            icon={StopIcon}
                            iconWeight="fill"
                            iconSize={32}
                            btnClass="border-4 border-blue-100 disabled:border-gray-300"
                            onClick={onStop}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
