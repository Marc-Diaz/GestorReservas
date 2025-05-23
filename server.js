// Importamos las bibliotecas necesarias
import express from "express";

// Importamos las rutas
import notificacionesRoute from "./routes/notificacions.js";
import reservasRoute from "./routes/reservas.js";
import recursosRoute from "./routes/recursos.js";
import usuariosRoute from "./routes/usuarios.js";
import { PORT, htmlNav } from "./config.js";



// Creamos la aplicación
const app = express();
app.use(express.json())


//EJS
app.use(express.static("public"));//carpeta publica pel css
app.set('view engine','ejs');//Fem servir el motor ejs
app.set('views', './views'); //carpeta on desem els arxius .ejs



//Endpoints Auth

app.get("/", (req, res)=> {
    res.render("home", {htmlNav})
});

/// Usamos las rutas de la carpetea routes
app.use("/notificaciones", notificacionesRoute);
app.use("/reservas", reservasRoute);
app.use("/recursos",recursosRoute);
app.use("/usuarios", usuariosRoute);

// Iniciamos el servidor en un solo puerto
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
