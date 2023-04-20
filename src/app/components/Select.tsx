import styled from '@emotion/styled'
import React, { ChangeEvent } from 'react'
import { HiChevronDown } from 'react-icons/hi'

type Props = {
  label?: string
  options: string[]
  value?: string
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
  full?: boolean
}

export default function Select({ label, value, onChange, options, full }: Props) {
  return (
    <Default full={full}>
      {label && label}
      <select {...{ value, onChange }}>
        {options.map((option, i) => (
          <option key={option + i} value={option}>
            {option}
          </option>
        ))}
      </select>
      <HiChevronDown />
    </Default>
  )
}

const Default = styled.label<{ full?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  row-gap: 0.5rem;

  width: ${({ full }) => (full ? '100%' : 'auto')};

  > select {
    border: none;
    border-radius: 12px;
    width: ${({ full }) => (full ? '100%' : '20vw')};
    height: 2rem;
    padding: 0 1rem;

    appearance: none;
    font-family: inherit;
  }

  position: relative;

  > svg {
    position: absolute;
    right: 1.3rem;
    bottom: 13%;

    color: #14203d;
  }
`
