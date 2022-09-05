import axios from "axios";
import { SLIDE_SPACING } from "./variables";

export const getRegistrationData = async (data) => {
  const reference = data.reference_slide_info;
  const registerResponse = data.register_slide_info;
  const registerArr = [];
  let annotations = undefined;

  for (let i = 0; i < registerResponse.length; i++) {
    const itm = registerResponse[i];

    try {
      const {
        data: {
          data: { slideId },
        },
      } = await axios.get(
        `/panorama_backend/mergedGrid/viewer?slideName=${itm.slide_id}`
      );
      annotations = (
        await axios.get(`/panorama_backend/grid-details?imageIds=${slideId}`)
      ).data.data[0].annotations;
    } catch (error) {
      console.log(error);
    }

    registerArr.push({
      ...itm,
      url: `/wsi_data/registration_outcome/${itm.slide_id}/${itm.slide_id}_panorama.jpeg`,
      annotations,
    });
  }

  try {
    const {
      data: {
        data: { slideId },
      },
    } = await axios.get(
      `/panorama_backend/mergedGrid/viewer?slideName=${reference.slide_id}`
    );
    annotations = (
      await axios.get(`/panorama_backend/grid-details?imageIds=${slideId}`)
    ).data.data[0].annotations;
  } catch (error) {
    console.log(error);
  }

  let arr = [];
  arr.push({
    slide_id: reference.slide_id,
    url: `/wsi_data/registration_outcome/${reference.slide_id}/${reference.slide_id}_panorama.jpeg`,
    reference: true,
    annotations,
  });
  arr = [...arr, ...registerArr];
  return arr;
};

export const getPositionFromSpacing = (index, length) => {
  return -1 * (index - (length - 1) / 2) * SLIDE_SPACING;
};

export const degToRad = (deg) => {
  const pi = Math.PI;
  return deg * (pi / 180);
};

export const calcRectPosition = (rect, index, length) => {
  const width = 400;
  const height = 534;
  const relativePosition = {
    x: (rect.max_x + rect.min_x) / 2 - width / 2,
    y: height / 2 - (rect.max_y + rect.min_y) / 2,
  };
  return [relativePosition.x, relativePosition.y];
};

export const roundNum = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
