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
    url: `/wsi_data/registration_outcome/${reference.slide_id}/${reference.slide_id}_panorama.jpeg`,
    reference: true,
    annotations,
  });
  arr = [...arr, ...registerArr];
  console.log(arr);
  return arr;
};

export const getPositionFromSpacing = (index, length) => {
  return -1 * (index - (length - 1) / 2) * SLIDE_SPACING;
};

export const degToRad = (deg) => {
  const pi = Math.PI;
  return deg * (pi / 180);
};
