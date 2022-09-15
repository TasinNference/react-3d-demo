import {
  Card,
  IconButton,
  Slider,
  styled,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { forwardRef, useState } from "react";
import {
  CollapseIcon,
  HideBtn,
  ImgItem,
  ItemAdjustmentContainer,
  ItemContent,
  ItemHeader,
  ItemIconsContainer,
  ItemImg,
  ItemName,
  LayersContainer,
  LayersItem,
  ReferenceImgTxt,
  SidebarContainer,
  SidebarHeader,
  SidebarSubContainer,
} from "./styles";
import { GoSettings } from "react-icons/go";
import { MdDragHandle } from "react-icons/md";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CustomSlider from "../CustomSlider";
import { roundNum } from "../../constants/functions";
import { TbResize } from "react-icons/tb";
import {
  DISP_RANGE,
  MAX_OPACITY,
  MIN_OPACITY,
  TILT_RANGE,
} from "../../constants/variables";

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const DraggableItem = forwardRef(
  (
    {
      img,
      dragHandleProps,
      draggableProps,
      index,
      toggleImageVisibility,
      targetImageOpacityChange,
      opacity,
      syncOpacity,
      toggleImageProjection,
      composite,
      targetImageTiltChange,
      targetImageXChange,
      targetImageYChange,
    },
    ref
  ) => {
    return (
      <LayersItem ref={ref} {...draggableProps} hidden={img.hidden}>
        {img.reference && <ReferenceImgTxt>Reference</ReferenceImgTxt>}
        <ItemHeader>
          <Tooltip title={img.slide_id} placement="top-start">
            <ItemName>{img.slide_id}</ItemName>
          </Tooltip>
          <ItemIconsContainer>
            <IconButton size="small" {...dragHandleProps}>
              <MdDragHandle />
            </IconButton>
          </ItemIconsContainer>
        </ItemHeader>
        <ItemContent>
          <ItemImg src={img.url} />
          <ItemAdjustmentContainer>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Typography variant="caption">Opacity</Typography>
                  </td>
                  <td>
                    <CustomSlider
                      size="small"
                      value={
                        syncOpacity
                          ? roundNum(opacity)
                          : img.opacity
                          ? roundNum(img.opacity)
                          : roundNum(opacity)
                      }
                      min={MIN_OPACITY}
                      max={MAX_OPACITY}
                      onChange={(e) =>
                        targetImageOpacityChange(e.target.value, index)
                      }
                    />
                  </td>
                </tr>
                {!img.reference && composite && (
                  <>
                    <tr>
                      <td>
                        <Typography variant="caption">Rotate</Typography>
                      </td>
                      <td>
                        <CustomSlider
                          size="small"
                          value={roundNum(img.comp_tilt)}
                          min={roundNum(img.tilt - TILT_RANGE)}
                          max={roundNum(img.tilt + TILT_RANGE)}
                          onChange={(e) =>
                            targetImageTiltChange(e.target.value, index)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant="caption">Pan X</Typography>
                      </td>
                      <td>
                        <CustomSlider
                          size="small"
                          value={roundNum(img.comp_x_disp)}
                          min={roundNum(img.x_disp - DISP_RANGE)}
                          max={roundNum(img.x_disp + DISP_RANGE)}
                          onChange={(e) =>
                            targetImageXChange(e.target.value, index)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant="caption">Pan Y</Typography>
                      </td>
                      <td>
                        <CustomSlider
                          size="small"
                          value={roundNum(img.comp_y_disp)}
                          min={roundNum(img.y_disp - DISP_RANGE)}
                          max={roundNum(img.y_disp + DISP_RANGE)}
                          onChange={(e) =>
                            targetImageYChange(e.target.value, index)
                          }
                        />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            {!composite && (
              <>
                <ImgItem>
                  <Typography variant="caption">
                    {img.hidden ? "Hidden" : "Visible"}
                  </Typography>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleImageVisibility(index)}
                  >
                    {img.hidden ? <AiOutlineEyeInvisible /> : <AiFillEye />}
                  </div>
                </ImgItem>
                <ImgItem>
                  <Typography variant="caption">Project Annotations</Typography>
                  <AntSwitch
                    checked={img.project ? true : false}
                    onChange={(e) =>
                      toggleImageProjection(index, e.target.checked)
                    }
                    size="small"
                  />
                </ImgItem>
              </>
            )}
          </ItemAdjustmentContainer>
        </ItemContent>
      </LayersItem>
    );
  }
);

const LeftSidebar = ({
  data,
  handleDragEnd,
  toggleImageVisibility,
  targetImageOpacityChange,
  opacity,
  open,
  setOpen,
  syncOpacity,
  toggleImageProjection,
  composite,
  targetImageTiltChange,
  targetImageXChange,
  targetImageYChange,
}) => {
  return (
    <SidebarContainer open={open}>
      <CollapseIcon onClick={() => setOpen(!open)}>
        <TbResize size={25} />
      </CollapseIcon>
      <SidebarSubContainer>
        <SidebarHeader>
          <Typography variant="h6">Select and arrange slides</Typography>
          <Typography variant="caption" style={{ lineHeight: "1" }}>
            Drag the thumbnails up and down to change the order in the stack
          </Typography>
        </SidebarHeader>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <LayersContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {data.map((img, index) => (
                  <Draggable
                    key={img.slide_id}
                    draggableId={`${img.slide_id}`}
                    index={index}
                  >
                    {(provided) => {
                      return (
                        <DraggableItem
                          index={index}
                          toggleImageVisibility={toggleImageVisibility}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          ref={provided.innerRef}
                          img={img}
                          targetImageOpacityChange={targetImageOpacityChange}
                          roundNum={roundNum}
                          opacity={opacity}
                          syncOpacity={syncOpacity}
                          toggleImageProjection={toggleImageProjection}
                          composite={composite}
                          targetImageTiltChange={targetImageTiltChange}
                          targetImageXChange={targetImageXChange}
                          targetImageYChange={targetImageYChange}
                        />
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </LayersContainer>
            )}
          </Droppable>
        </DragDropContext>
      </SidebarSubContainer>
    </SidebarContainer>
  );
};

export default LeftSidebar;
