import axios from "axios";

function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

axios.interceptors.request.use(
  config => {
    const tokenStr = getCookie('token');
    console.log('token '+tokenStr)
    config.headers['Authorization'] = `Bearer ${tokenStr}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const getRegistrationData = async (data) => {
  const reference = data.reference_slide_info;
  const registerResponse = data.register_slide_info;
  const registerArr = [];
  let sType;

  //const tokenStr = getCookie('token')
  //console.log('token '+tokenStr)

  const getAnnotations = async (id) => {
    let anns = [];

    try {
      const {
        data: {
          data: { slideId },
        },
      } = await axios.get(
        `/panorama_backend/mergedGrid/viewer?slideName=${id}`
        //,{ headers: {"Authorization" : `Bearer ${tokenStr}`} }
      );
      const {
        slide: { stainType },
        annotations,
      } = (
        await axios.get(`/panorama_backend/grid-details?imageIds=${slideId}`)
        //,{ headers: {"Authorization" : `Bearer ${tokenStr}`} }
      ).data.data[0];
      anns = annotations;
      sType = stainType;
    } catch (error) {
      console.log(error);
    }
    return [sType, anns];
  };

  const annotations = await Promise.all([
    ...registerResponse.map((itm) => getAnnotations(itm.slide_id)),
    getAnnotations(reference.slide_id),
  ]);
  // }

  registerResponse.forEach((itm, index) => {
    registerArr.push({
      ...itm,
      comp_tilt: itm.tilt,
      comp_x_disp: itm.x_disp,
      comp_y_disp: itm.y_disp,
      url: `/wsi_data/registration_outcome/${itm.slide_id}/${itm.slide_id}_panorama.jpeg`,
      annotations: annotations[index][1],
      stainType: annotations[index][0],
    });
  });
  const refData = {
    slide_id: reference.slide_id,
    url: `/wsi_data/registration_outcome/${reference.slide_id}/${reference.slide_id}_panorama.jpeg`,
    reference: true,
    annotations: annotations[annotations.length - 1][1],
    stainType: annotations[annotations.length - 1][0],
  };
  return [refData, ...registerArr];
};

export const getPositionFromSpacing = (index, length, spacing) => {
  return -1 * (index - (length - 1) / 2) * spacing;
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
