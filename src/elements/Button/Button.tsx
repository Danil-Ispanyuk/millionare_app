import React, { PropsWithChildren } from 'react'
import './styles.scss'
import classNames from 'classnames'

interface IButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
}

export const Button = ({
  children,
  className,
  ...props
}: PropsWithChildren<IButtonProps>) => {
  return (
    <button className={classNames('custom-button', className)} {...props}>
      {children}
    </button>
  )
}
