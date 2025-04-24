import React, { PropsWithChildren } from 'react'
import './styles.scss'
import classNames from 'classnames'
import { Loader } from '../Loader/Loader'

interface IButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  isLoading?: boolean
  isDisabled?: boolean
}

export const Button = ({
  children,
  className,
  isLoading,
  isDisabled,
  ...props
}: PropsWithChildren<IButtonProps>) => {
  return (
    <button
      className={classNames('custom-button', className, {
        disabled: isDisabled,
      })}
      {...props}
    >
      {isLoading ? <Loader /> : null} {children}
    </button>
  )
}
