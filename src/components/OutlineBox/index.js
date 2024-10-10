import React from "react"
import styled from "styled-components/native"
import { space, color, layout, flexbox, border, position } from "styled-system"
import { withTheme } from "styled-components"

const OutlineBox = styled.View`
    ${space}
    ${color}
    ${layout}
    ${flexbox}
    ${border}
    ${position}
`

export default withTheme(OutlineBox)
