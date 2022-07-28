import React from 'react'
import { InputBtn, InputContainer, InputField } from './styles'
import {FiChevronLeft, FiChevronRight} from "react-icons/fi"

const CustomInput = ({min, max, value, setValue}) => {
  return (
    <InputContainer>
      <InputBtn><FiChevronLeft/></InputBtn>
      <InputField value={value} onChange={(e) => setValue(e.target.value)} type="number" min={min} max={max} />
      <InputBtn><FiChevronRight/></InputBtn>
    </InputContainer>
  )
}

export default CustomInput