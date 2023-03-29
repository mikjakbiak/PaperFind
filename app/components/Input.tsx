import styled from '@emotion/styled'
import React, { ChangeEvent, HTMLInputTypeAttribute } from 'react'

type Props = {
  label?: string
  type: HTMLInputTypeAttribute
  name: string
  value?: string
  placeholder?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  full?: boolean
}

export default function Input({ label, type, name, value, onChange, placeholder, full }: Props) {
  return (
    <Default full={full}>
      {label && label}
      <input {...{ type, name, value, onChange, placeholder }} />
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
