import { SLIDE_SPACING } from "./variables";

export const getRegistrationData = (data) => {
  const reference = data.reference_slide_info;
  const registerResponse = data.register_slide_info;
  const registerArr = registerResponse.map((itm) => {
    return {
      ...itm,
      url: `/wsi_data/registration_outcome/${itm.slide_id}/${itm.slide_id}_panorama.jpeg`,
    };
  });

  let arr = [];
  arr.push({
    slide_id: reference.slide_id,
    url: `/wsi_data/registration_outcome/${reference.slide_id}/${reference.slide_id}_panorama.jpeg`,
    reference: true,
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
