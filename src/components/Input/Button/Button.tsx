import { type IconProps } from '@phosphor-icons/react'
import { IconPos, type IconWeight } from '@/components/Input/Button/constants'

type IconComponent = React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
>

type ButtonProps = {
    text?: string
    btnClass?: string
    icon?: IconComponent
    iconSize?: number
    iconWeight?: IconWeight
    iconPos?: IconPos
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function Button({
    text,
    btnClass,
    icon: Icon,
    iconSize,
    iconWeight = 'regular',
    iconPos,
    ...btnAttrs
}: ButtonProps) {
    return (
        <>
            <button
                {...btnAttrs}
                className={`flex flex-row gap-2 items-center rounded p-2 bg-blue-100 hover:bg-blue-200 active:bg-blue-400 disabled:bg-gray-300 ${btnClass}`}
            >
                {Icon &&
                    (!iconPos ||
                        iconPos === IconPos.BEFORE ||
                        iconPos === IconPos.BOTH) && (
                        <Icon size={iconSize} weight={iconWeight} />
                    )}
                {text && <span>{text}</span>}
                {Icon &&
                    (iconPos === IconPos.AFTER || iconPos === IconPos.BOTH) && (
                        <Icon size={iconSize} weight={iconWeight} />
                    )}
            </button>
        </>
    )
}

export default Button
