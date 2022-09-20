import { Typography } from "@mui/material";
import React, { useState } from "react";
import {
  SettingsBody,
  SettingsContainer,
  SettingsContent,
  SettingsHeader,
} from "./styles";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import CustomSlider from "../CustomSlider";
import { GrPowerReset } from "react-icons/gr";
import { AntSwitch } from "../LeftSidebar";
import {
  MAX_OPACITY,
  MAX_SPACING,
  MIN_OPACITY,
  MIN_SPACING,
} from "../../constants/variables";

const SettingsWidget = ({
  opacity,
  setOpacity,
  rotation,
  setRotation,
  spacing,
  setSpacing,
  resetImages,
  composite,
  setComposite,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <SettingsContainer>
      <SettingsHeader onClick={() => setOpen(!open)}>
        <Typography variant="subtitle2">Settings</Typography>
        {open ? (
          <AiOutlineMinusSquare size={20} />
        ) : (
          <AiOutlinePlusSquare size={20} />
        )}
      </SettingsHeader>
      <SettingsBody open={open}>
        <SettingsContent>
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
                    value={opacity}
                    min={MIN_OPACITY}
                    max={MAX_OPACITY}
                    onChange={(e) => setOpacity(e.target.value)}
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
                    value={spacing}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    min={MIN_SPACING}
                    max={MAX_SPACING}
                    onChange={(e) => setSpacing(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="caption">Rotation</Typography>
                </td>
                <td>
                  <CustomSlider
                    size="small"
                    defaultValue={rotation}
                    value={rotation}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    min={-180}
                    max={180}
                    onChange={(e) => setRotation(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="caption">Reset</Typography>
                </td>
                <td style={{ display: "flex", justifyContent: "flex-end" }}>
                  <GrPowerReset
                    style={{ cursor: "pointer" }}
                    onClick={resetImages}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption">Composite View</Typography>
            <AntSwitch
              checked={composite}
              onChange={(e) => setComposite(e.target.checked)}
              size="small"
            />
          </div> */}
        </SettingsContent>
      </SettingsBody>
    </SettingsContainer>
  );
};

export default SettingsWidget;
