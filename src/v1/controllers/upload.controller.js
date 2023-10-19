const { OK, ERROR } = require("../../../utils/responseHelper");

exports.uploadSingleFile = (req, res) => {
  try {
    const { file } = req;

    if (file) {
      const { fileName } = file;
      const filePath = `${process.env.BACKEND_BASE_URL}/images/${req.file.filename}`;
      OK(res, { fileName, location: filePath }, "File uploaded successfully");
    } else {
      ERROR(res, null, "Something went wrong");
    }
  } catch (error) {
    ERROR(res, error, "Something went wrong");
  }
};
