const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");

const dbConnection = require("../database/config");
const { socketController } = require("../socket/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = require("socket.io")(this.server);

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      find: "/api/find",
      products: "/api/products",
      users: "/api/users",
      uploads: "/api/uploads",
    };

    // conectar con la base de datos
    this.conectarDB();

    // middlewares
    this.middlewares();

    // routes
    this.routes();

    // sockets events
    this.socketEvents();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // cors
    this.app.use(cors());

    // lectura y parseo del body
    this.app.use(express.json());

    // directorio publico
    this.app.use(express.static("public"));

    // express-fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.find, require("../routes/find"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor en el puerto", this.port);
    });
  }

  socketEvents() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }
}

module.exports = Server;
