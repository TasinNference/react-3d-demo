import { Tooltip } from "@mui/material";
import React, { forwardRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  CollapsedContainer,
  CollapsedImg,
  CollapsedItem,
  CollapsedItems,
  CollapsedMain,
} from "./styles";
import { HiOutlineArrowsExpand } from "react-icons/hi";

const DraggableItem = forwardRef(
  ({ img, draggableProps, dragHandleProps }, ref) => {
    return (
      <CollapsedItem
        {...draggableProps}
        {...dragHandleProps}
        ref={ref}
        hidden={img.hidden}
      >
        <Tooltip title={img.slide_id} placement="right">
          <CollapsedImg src={img.url} />
        </Tooltip>
      </CollapsedItem>
    );
  }
);

const CollapsedSidebar = ({ open, setOpen, data, handleDragEnd }) => {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "10px",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CollapsedContainer>
          <CollapsedMain>
            <HiOutlineArrowsExpand
              onClick={() => setOpen(!open)}
              style={{ cursor: "pointer" }}
              size={20}
            />
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <CollapsedItems
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
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                              ref={provided.innerRef}
                              img={img}
                            />
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CollapsedItems>
                )}
              </Droppable>
            </DragDropContext>
          </CollapsedMain>
        </CollapsedContainer>
      </div>
    </div>
  );
};

export default CollapsedSidebar;
