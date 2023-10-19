exports.MESSAGE_CODES = {
  BLOG_UPDATED: "BLOG_UPDATED",
};

exports.RESPONSE = (messageCode = "", payload = null, type) => {
  return {
    code: messageCode,
    payload,
    type,
  };
};

exports.RESPONSE_TYPE = Object.freeze({
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
});
