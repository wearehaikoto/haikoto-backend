const axios = require("axios");
const FormData = require("form-data");
const { IMGBB } = require("../config");
const CustomError = require("./../utils/custom-error");

class ImgBBMethods {
    async uploadImage(imageBase64OrUrl) {
        try {
            const form = new FormData();
            form.append("image", imageBase64OrUrl);

            const { data: response } = await axios.post("https://api.imgbb.com/1/upload", form, {
                params: { key: IMGBB.API_KEY },
                headers: { ...form.getHeaders() }
            });

            if (response.success) {
                return { success: true, Location: response.data.url };
            }

            throw new CustomError("error encountered while uploading your image");
        } catch (error) {
            console.log(error.response ? error.response.data : error.message);
            throw new CustomError("error while uploading image");
        }
    }
}

module.exports = new ImgBBMethods();
