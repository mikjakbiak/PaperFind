import styled from '@emotion/styled'
import React, { forwardRef } from 'react'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  checkbox_title: string | null
}

const Checkbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { checkbox_title } = props
  return (
    <Main>
      <input {...props} ref={ref} type="checkbox" />
      <span>{checkbox_title}</span>
    </Main>
  )
})

const Main = styled.label`
  width: 100%;
  padding: 0.5rem 1rem;

  box-sizing: border-box;

  border-radius: 12px;
  background-color: #282a8f;

  display: flex;
  align-items: center;
  gap: 1rem;

  --accent-color: #e7d740;

  &:hover {
    background-color: #242580;
    --accent-color: #ccbd39;
  }

  input[type='checkbox'] {
    display: grid;
    place-content: center;
    appearance: none;
    background-color: var(--accent-color);
    margin: 0;

    font: inherit;
    color: currentColor;
    width: 1em;
    height: 1em;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
  }

  input[type='checkbox']::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #282a8f;

    transform-origin: bottom left;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  input[type='checkbox']:checked::before {
    transform: scale(1);
  }

  input[type='checkbox']:focus {
    outline: max(2px, 0.15em) solid var(--accent-color);
    outline-offset: max(2px, 0.15em);
  }

  > span {
    width: 105%;
  }
`

export default Checkbox
