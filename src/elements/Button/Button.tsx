import React, { PropsWithChildren } from 'react'
import "./styles.scss";

interface IButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

export const Button = ({
    children,
    ...props
}: PropsWithChildren<IButtonProps>) => {
  return (
    <button className="custom-button" {...props}>
      {children}
    </button>
  )
}
