const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-fher.herokuapp.com/api/auth/";

// Login con usuario propio de la app

const formulario = document.querySelector("form");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {};

  for (let elem of formulario.elements) {
    if (elem.name.length > 0) {
      formData[elem.name] = elem.value;
    }
  }

  fetch(url + "login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) return console.log(msg);

      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((err) => {
      console.log(err);
    });
});

// Login de Google

function handleCredentialResponse(response) {
  // console.log("id token", response.credential);
  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      // console.log(resp.token);
      // localStorage.setItem("email", resp.user.mail);
      localStorage.setItem("token", resp.token);
      window.location = "chat.html";
    })
    .catch(console.warn);
}
const button = document.getElementById("google_signout");

button.onclick = () => {
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
