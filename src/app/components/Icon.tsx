import styled from '@emotion/styled'
import { IconType } from 'react-icons'

const Icon = (icon: IconType) => styled(icon)`
  cursor: pointer;

  color: #14203d;
  background-color: #e6d840;

  border-radius: 50%;
  padding: 2px;
`

export default Icon
