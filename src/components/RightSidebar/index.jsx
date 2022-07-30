import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { BottomContainer, RightContainer, TopContainer } from "./styles";
import CustomSlider from "../CustomSlider";
import CollapseComponent from "../CollapseComponent";

const RightSidebar = ({ mainOpacityChange, opacity, setSpacing, spacing }) => {
  const [composite, setComposite] = useState(true);
  const [settings, setSettings] = useState(true);

  return (
    <RightContainer>
      <TopContainer>
        {/* <Accordion
          expanded={composite}
          onChange={(e, isExpanded) => setComposite(isExpanded)}
          disableGutters={true}
        >
          <AccordionSummary
            expandIcon={composite ? <RemoveIcon /> : <AddIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="caption">Composite Preview</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <img src="/images/skin-tissue-1.jpg" style={{ width: "100%" }} />
          </AccordionDetails>
        </Accordion> */}
        <CollapseComponent
          value={settings}
          onClick={() => setSettings(!settings)}
          title="Composite Preview"
        >
          <img src="/images/skin-tissue-1.jpg" style={{ width: "100%" }} />
        </CollapseComponent>
      </TopContainer>
      <BottomContainer>
        <CollapseComponent
          value={composite}
          onClick={() => setComposite(!composite)}
          title="Global Settings"
        >
          <table>
            <tbody>
              <tr>
                <td>
                  <Typography variant="caption">Opacity</Typography>
                </td>
                <td>
                  <CustomSlider
                    size="small"
                    defaultValue={opacity}
                    min={1}
                    max={100}
                    onChange={(e) => mainOpacityChange(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="caption">Spacing</Typography>
                </td>
                <td>
                  <CustomSlider
                    size="small"
                    defaultValue={spacing}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    min={50}
                    max={500}
                    onChange={(e) => setSpacing(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </CollapseComponent>
      </BottomContainer>
    </RightContainer>
  );
};

export default RightSidebar;
