const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-fher.herokuapp.com/api/auth/";

let usuario;
let socket = null;

// Referencia elementos del DOM

const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    console.log("Este es el token", token);
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: { "x-auth": token },
  });

  const { user: usuarioDB, token: tokenDB } = await resp.json();

  localStorage.setItem("token", token);

  usuario = usuarioDB;

  document.title = usuarioDB.name;

  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-auth": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log(`Usuario conectado`);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado`);
  });

  socket.on("recibir-mensajes", dibujarMensajes);
  socket.on("usuarios-activos", dibujarUsuarios);

  socket.on("mensaje-privado", (payload) => {
    console.log("Privado:", payload);
  });

  socket.on("uid", (uid) => {
    console.log("uid de cada uno", uid);
  });
};

const dibujarUsuarios = (usuarios = []) => {
  let usersHTML = "";
  usuarios.forEach(({ name, uid }) => {
    usersHTML += `        
        <li>
            <p class='text-success'>
                <h6> ${name} </h6>
                <h6> ${uid} </h6>
            </p>
        </li>        
        `;
  });

  ulUsuarios.innerHTML = usersHTML;
};

const dibujarMensajes = (mensajes = []) => {
  let mensajesHTML = "";
  mensajes.forEach(({ nombre, mensaje }) => {
    mensajesHTML += `        
          <li>
              <p class='text-success'>
                  <span class='text-primary'> ${nombre}: </span>
                  <span> ${mensaje} </span>
              </p>
          </li>        
          `;
  });

  ulMensajes.innerHTML = mensajesHTML;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const mensaje = txtMensaje.value;
  const uid = txtUid.value;

  if (keyCode !== 13) return;

  if (mensaje.length === 0) return;

  socket.emit("enviar-mensaje", { mensaje, uid });

  txtMensaje.value = "";
});

const main = async () => {
  // Validar JWT
  await validarJWT();
};

main();
