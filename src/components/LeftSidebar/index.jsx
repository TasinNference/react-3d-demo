import { Card, IconButton, Slider, Tooltip, Typography } from "@mui/material";
import React, { forwardRef, useState } from "react";
import {
  CollapseIcon,
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
            <IconButton
              size="small"
              onClick={() => toggleImageVisibility(index)}
            >
              {img.hidden ? <AiOutlineEyeInvisible /> : <AiFillEye />}
            </IconButton>
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
                    {/* <CustomInput
                      min={1}
                      max={100}
                      setValue={(value) => targetImageOpacityChange(value, index)}
                      value={
                        img.opacity ? roundNum(img.opacity) : roundNum(opacity)
                      }
                    /> */}
                    <CustomSlider
                      size="small"
                      defaultValue={opacity}
                      value={
                        img.opacity ? roundNum(img.opacity) : roundNum(opacity)
                      }
                      min={1}
                      max={100}
                      onChange={(e) =>
                        targetImageOpacityChange(e.target.value, index)
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
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
