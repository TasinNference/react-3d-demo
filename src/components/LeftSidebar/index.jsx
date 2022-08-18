import { Card, IconButton, Slider, Typography } from "@mui/material";
import React, { forwardRef } from "react";
import {
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
} from "./styles";
import { GoSettings } from "react-icons/go";
import { MdDragHandle } from "react-icons/md";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CustomInput from "../CustomInput";
import CustomSlider from "../CustomSlider";

const DraggableItem = forwardRef(
  (
    {
      img,
      dragHandleProps,
      draggableProps,
      apiUrl,
      index,
      toggleImageVisibility,
      targetImageOpacityChange,
      roundNum,
      opacity,
    },
    ref
  ) => {
    return (
      <LayersItem ref={ref} {...draggableProps} hidden={img.hidden}>
        {img.reference && <ReferenceImgTxt>Reference</ReferenceImgTxt>}
        <ItemHeader>
          <ItemName>{img.name}</ItemName>
          <ItemIconsContainer>
            <IconButton
              size="small"
              onClick={() => toggleImageVisibility(index)}
            >
              {img.hidden ? <AiFillEyeInvisible /> : <AiFillEye />}
            </IconButton>
            <IconButton size="small" {...dragHandleProps}>
              <MdDragHandle />
            </IconButton>
          </ItemIconsContainer>
        </ItemHeader>
        <ItemContent>
          <ItemImg src={`${apiUrl}${img.img}`} />
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
                      defaultValue={img.opacity ? roundNum(img.opacity) : roundNum(opacity)}
                      min={1}
                      max={100}
                      onChange={(e) => targetImageOpacityChange(e.target.value, index)}
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
  apiUrl,
  toggleImageVisibility,
  targetImageOpacityChange,
  roundNum,
  opacity,
}) => {
  console.log(data);

  return (
    <SidebarContainer>
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
                <Draggable key={img.id} draggableId={`${img.id}`} index={index}>
                  {(provided) => {
                    return (
                      <DraggableItem
                        index={index}
                        toggleImageVisibility={toggleImageVisibility}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        ref={provided.innerRef}
                        apiUrl={apiUrl}
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
    </SidebarContainer>
  );
};

export default LeftSidebar;
