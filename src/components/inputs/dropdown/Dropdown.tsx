import { useState, useRef, useEffect } from 'react'
import Button from '@/components/inputs/button/Button'
import { XIcon } from '@phosphor-icons/react'

type DropdownProps = {
    options?: string[]
    defaultOption?: string
    title?: string
    titleClass?: string
    mainClass?: string
    dropdownClass?: string
    placeholder?: string
    clear?: boolean
    disabled?: boolean
}

export default function Dropdown({
    options = [],
    defaultOption,
    title,
    titleClass = '',
    mainClass = '',
    dropdownClass = '',
    placeholder,
    clear,
    disabled,
}: DropdownProps) {
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const isDisabledRef = useRef<boolean>(disabled)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [highlightIndex, setHighlightIndex] = useState<number>(0)
    const [selection, setSelection] = useState<string | null>(
        defaultOption && options.includes(defaultOption) ? defaultOption : null
    )

    // close on click outside component
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!isDisabledRef) {
                return
            }

            if (
                dropdownRef.current &&
                e.target instanceof Node &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // detect and handle changes to component being disabled
    useEffect(() => {
        // changed to false
        if (isDisabledRef.current && !disabled) {
            setIsOpen(false)
        }

        isDisabledRef.current = disabled
    }, [disabled])

    // handles keyboard inputs
    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (!isOpen || disabled) {
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                setHighlightIndex((highlightIndex + 1) % options.length)
                break
            case 'ArrowUp':
                setHighlightIndex(
                    (highlightIndex - 1 + options.length) % options.length
                )
                break
            case 'Enter':
                setSelection(options[highlightIndex])
                setIsOpen(false)
                break
            case 'Escape':
                setIsOpen(false)
                break
        }
    }

    return (
        <>
            <div className="m-0.5">
                {title && (
                    <div
                        className={`text-xs px-1 uppercase font-bold ${titleClass}`}
                    >
                        {title}
                    </div>
                )}
                <div
                    ref={dropdownRef}
                    className="relative w-48 text-md"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                >
                    <div
                        className={`flex flex-row justify-between p-1 ${disabled ? 'bg-gray-300' : 'bg-blue-100 hover:bg-blue-200'}  ${isOpen ? 'rounded-t bg-white' : 'rounded'} shadow`}
                    >
                        <button
                            className={`w-full text-left ${selection ? 'text-black' : 'text-slate-500'} ${mainClass}`}
                            onClick={() => {
                                setIsOpen(options.length > 0 ? !isOpen : false)
                            }}
                            disabled={disabled}
                        >
                            {selection ||
                                (placeholder
                                    ? placeholder
                                    : 'Select an option')}
                        </button>
                        {clear && (
                            <Button
                                icon={XIcon}
                                btnClass="rounded-full shadow"
                                bgClassOverride="bg-white hover:bg-blue-300 active:bg-blue-400 disabled:bg-gray-200"
                                onClick={() => setSelection(null)}
                                disabled={disabled}
                            />
                        )}
                    </div>
                    {isOpen && !disabled && (
                        <ul className="absolute w-full z-10 max-h-40 overflow-y-auto bg-blue-100 rounded-b">
                            {options.map((option, ix) => {
                                return (
                                    <li
                                        key={option}
                                        className={`p-0.5 cursor-pointer ${ix === highlightIndex ? 'bg-blue-200' : ''} ${option === selection ? 'bg-blue-400 hover:bg-blue-500' : ''} ${dropdownClass}`}
                                        onMouseEnter={() =>
                                            setHighlightIndex(ix)
                                        }
                                        onClick={() => {
                                            setSelection(option)
                                            setIsOpen(false)
                                        }}
                                    >
                                        {option}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}
