const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

/**
 * @description Hooks which can interact with core functionality and flow
 */
module.exports = class hooks {
  constructor() {}

  /**
   * Boot sequence
   */
  async boot(app) {
    // Basic file uploading
    const file_upload = require("express-fileupload");
    app.use(file_upload());
    /**
     * Loading services based on configs/service.js
     */
    if (Config.service("auth"))
      app.loadService("auth", "app.services.AuthService");
    if (Config.service("mongo")) app.loadService("app.services.MongoService");
    if (Config.service("cron"))
      app.loadService("app.services.SchedulerService");
    if (Config.service("logger"))
      app.loadService("logger", "app.services.LoggerService");
    if (Config.service("mail"))
      app.loadService("mail", "app.services.MailService");

    /**
     * Presisting public media folders
     */
    if (!fs.existsSync(root_directory + "/public/images")) {
      fs.mkdirSync(root_directory + "/public/images");
    }
  }

  /**
   * Common server configs
   */
  server(app) {
    // Cross origin requests
    app.use(cors());

    // Render html
    app.engine("html", require("ejs").renderFile);

    // Response parsing & limits
    app.all(app.use(bodyParser.text({ type: "text/*" })));
    app.use(express.urlencoded({ extended: false, limit: "1000mb" }));
    app.use(express.json({ limit: "1000mb" }));
  }

  /**
   * Common routing middleware
   */
  routing(app, request, response) {
    app.routing(request, response);
  }
};
