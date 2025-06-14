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
import { RUN_STATE, SPEED_LABELS, STATES } from './constants'

type PanelProps = {
    stateSelection: string
    setStateSelection: React.Dispatch<React.SetStateAction<string>>
    algorithmSelection: string | null
    setAlgorithmSelection: React.Dispatch<React.SetStateAction<string | null>>
    speed: string | null
    setSpeed: React.Dispatch<React.SetStateAction<string | null>>
    runState: string
    onReset: () => void
    onPlay: () => void
    onPause: () => void
    onStop: () => void
}

export default function Panel({
    stateSelection,
    setStateSelection,
    algorithmSelection,
    setAlgorithmSelection,
    speed,
    setSpeed,
    runState,
    onReset,
    onPlay,
    onPause,
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
                            disabled={runState === RUN_STATE.STARTED}
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
                            disabled={runState === RUN_STATE.STARTED}
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
                            disabled={runState === RUN_STATE.STARTED}
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
                            disabled={runState === RUN_STATE.STARTED}
                        />
                    </div>
                    <div>
                        <Button
                            title="Reset Board"
                            icon={ArrowsCounterClockwiseIcon}
                            iconWeight="regular"
                            iconSize={32}
                            btnClass="border-4 border-blue-100 disabled:border-gray-300"
                            disabled={runState === RUN_STATE.STARTED}
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
                            disabled={runState === RUN_STATE.STARTED}
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
                            disabled={runState === RUN_STATE.STARTED}
                        />
                    </div>
                    <div>
                        <Dropdown
                            title="Speed"
                            placeholder="Select an algorithm"
                            options={SPEED_LABELS}
                            value={speed}
                            onChange={setSpeed}
                            disabled={runState === RUN_STATE.STARTED}
                        />
                    </div>
                    <div>
                        <Button
                            title={
                                runState === RUN_STATE.STARTED ? 'Pause' : 'Run'
                            }
                            icon={
                                runState === RUN_STATE.STARTED
                                    ? PauseIcon
                                    : PlayIcon
                            }
                            iconWeight="fill"
                            iconSize={32}
                            btnClass={
                                runState === RUN_STATE.STARTED
                                    ? 'text-amber-500 border-4 border-blue-100 disabled:border-gray-300'
                                    : 'text-emerald-500 border-4 border-blue-100 disabled:border-gray-300'
                            }
                            onClick={() => {
                                if (runState === RUN_STATE.STARTED) {
                                    onPause()
                                } else {
                                    onPlay()
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Button
                            title="Stop"
                            icon={StopIcon}
                            iconWeight="fill"
                            iconSize={32}
                            btnClass="border-4 border-blue-100 disabled:border-gray-300 text-red-500"
                            onClick={onStop}
                            disabled={runState === RUN_STATE.NONE}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
