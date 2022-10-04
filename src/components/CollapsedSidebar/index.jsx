import { styled, Tooltip, tooltipClasses, Typography } from "@mui/material";
import React, { forwardRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  CollapsedContainer,
  CollapsedImg,
  CollapsedItem,
  CollapsedItems,
  CollapsedMain,
  TooltipContent,
  TooltipHeader,
  TooltipItem,
  TooltipName,
  TooltipStainType,
} from "./styles";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  MAX_OPACITY,
  MIN_OPACITY,
  stainColors,
} from "../../constants/variables";
import { AiFillEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CustomSlider from "../CustomSlider";
import { roundNum } from "../../constants/functions";
import { AntSwitch } from "../LeftSidebar";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 250,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    padding: "10px",
  },
}));

const DraggableItem = forwardRef(
  (
    {
      img,
      draggableProps,
      dragHandleProps,
      index,
      targetImageOpacityChange,
      syncOpacity,
      opacity,
      toggleImageVisibility,
      toggleImageProjection,
    },
    ref
  ) => {
    return img.isTumor ? (
      <CollapsedItem {...draggableProps} {...dragHandleProps} ref={ref}>
        <div style={{ position: "relative" }}>
          <CollapsedImg
            borderColor={stainColors[img.stainType]}
            src={"/3d_viewer/images/tumor.jpg"}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {img.hidden && <AiOutlineEyeInvisible color="black" size={30} />}
          </div>
        </div>
      </CollapsedItem>
    ) : (
      <CollapsedItem {...draggableProps} {...dragHandleProps} ref={ref}>
        <HtmlTooltip
          title={
            <>
              <TooltipHeader>
                <TooltipName>{img.slide_id.split("_").pop()}</TooltipName>
                <TooltipStainType color={stainColors[img.stainType]}>
                  {img.stainType}
                </TooltipStainType>
              </TooltipHeader>
              <TooltipContent>
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
                  </tbody>
                </table>
                <TooltipItem>
                  <Typography variant="caption">
                    {img.hidden ? "Hidden" : "Visible"}
                  </Typography>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleImageVisibility(index)}
                  >
                    {img.hidden ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiFillEye size={20} />
                    )}
                  </div>
                </TooltipItem>
                <TooltipItem>
                  <Typography variant="caption" style={{ marginRight: "10px" }}>
                    Project Annotations
                  </Typography>
                  <AntSwitch
                    checked={img.project ? true : false}
                    onChange={(e) =>
                      toggleImageProjection(index, e.target.checked)
                    }
                    size="small"
                  />
                </TooltipItem>
              </TooltipContent>
            </>
          }
          placement="right"
        >
          <div style={{ position: "relative" }}>
            <CollapsedImg
              borderColor={stainColors[img.stainType]}
              src={img.url}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {img.hidden && <AiOutlineEyeInvisible color="black" size={30} />}
            </div>
          </div>
        </HtmlTooltip>
      </CollapsedItem>
    );
  }
);

const CollapsedSidebar = ({
  open,
  setOpen,
  data,
  handleDragEnd,
  targetImageOpacityChange,
  syncOpacity,
  opacity,
  toggleImageProjection,
  toggleImageVisibility,
}) => {
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
                        key={img.isTumor ? "tumor" : img.slide_id}
                        draggableId={img.isTumor ? "tumor" : img.slide_id}
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
                              targetImageOpacityChange={
                                targetImageOpacityChange
                              }
                              syncOpacity={syncOpacity}
                              opacity={opacity}
                              toggleImageProjection={toggleImageProjection}
                              toggleImageVisibility={toggleImageVisibility}
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
