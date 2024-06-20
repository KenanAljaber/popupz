export default (app) => {
  app.post("/popup", require("./create").default);
};
