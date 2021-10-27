const { checkJWT } = require("../helpers/generateJWT");

const Chat = require("../models/chat");

const chat = new Chat();

const socketController = async (socket, io) => {
  const token = socket.handshake.headers["x-auth"];

  const user = await checkJWT(token);

  console.log("USER FROM DB", user);

  if (!user) return socket.disconnect();

  // Agregar el usuario conectado
  chat.conectarUsuario(user);
  io.emit("usuarios-activos", chat.usuariosArr);
  socket.emit("recibir-mensajes", chat.ultimos10);

  // Conectarlo a una sala especial

  socket.emit("uid", user._id.toString()); // --> to string el id porque viene como new ObjectId

  socket.join(user._id.toString()); // global --> socket.id, privada --> usuario._id

  console.log("room", io.sockets.adapter.rooms);
  // limpiar cuando alguien se desconecta
  socket.on("disconnect", () => {
    chat.desconectarUsuario(user._id);
    io.emit("usuarios-activos", chat.usuariosArr);
  });

  socket.on("enviar-mensaje", ({ uid, mensaje }) => {
    if (uid) {
      // mensaje privado
      console.log("viene a enviar el privado con el uid:", uid);
      socket.to(uid).emit("mensaje-privado", { de: user.name, mensaje });
    } else {
      console.log("viene a enviar para todos");
      chat.enviarMensaje(user.uid, user.name, mensaje);
      io.emit("recibir-mensajes", chat.ultimos10);
    }
  });
};

module.exports = { socketController };
