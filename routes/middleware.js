var jwt = require("jwt-simple");
var moment = require("moment");

const checkToken = (request, response, next) => {
  if (!request.headers["authorization"]) {
    return response.json({
      error: "token is empty",
    });
  }

  const userToken = request.headers["authorization"];
  let payload = {};

  try {
    payload = jwt.decode(userToken, "secretKey");
  } catch (err) {
    return response.json({
      error: "token incorrect",
    });
  }

  if (payload.expiredAt < moment().unix()) {
    return response.json({
      error: "token has expired",
    });
  }

  next();
};

module.exports = {
  checkToken: checkToken,
};
