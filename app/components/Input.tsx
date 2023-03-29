import styled from '@emotion/styled'
import React, { forwardRef } from 'react'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label?: string
  full?: boolean
}

//TODO: Errors handling

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, full } = props
  return (
    <Default full={full}>
      {label && label}
      <input {...props} ref={ref} />
    </Default>
  )
})

const Default = styled.label<{ full?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  row-gap: 0.5rem;

  width: ${({ full }) => (full ? '100%' : 'auto')};

  > input {
    border: none;
    border-radius: 12px;
    width: ${({ full }) => (full ? '100%' : '20vw')};
    height: 2rem;
    padding: 0 1rem;
    font-family: inherit;

    box-sizing: border-box;
  }
`

export default Input
