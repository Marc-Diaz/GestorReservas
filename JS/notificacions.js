//Importa les biblioteques necessàries
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

//Crea l'objecte de l'aplicació
const app = express();
app.use(bodyParser.json());

//Llegeix les dades del fitxer
const readData = () => {
    try {
        const data = fs.readFileSync("JSON/Notificaciones.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("JSON/Notificaciones.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};


app.get("/", (req,res)=>{
    res.send("Welcome to my first API with Node.js");
});

//GET
app.get("/Notificaciones", (req,res)=>{
    const data = readData();
    res.json(data.notificaciones);
});

//GET per id
app.get("/Notificaciones/:id",(req,res)=>{
    const data=readData();
    const id = parseInt(req.params.id);
    const notificacion = data.notificaciones.find((notificacion)=>notificacion.idNotificacion === id);
    if(!notificacion) res.status(404).json({message : "Notificacion not found"})
    res.json(notificacion);
});

//POST
app.post("/Notificaciones",(req,res)=>{
    const data=readData();
    const body=req.body;
    const newNotificacion={
        idNotificacion:data.notificaciones.length+1,
        ...body,
    };
    data.notificaciones.push(newNotificacion);
    writeData(data);
    res.json(newNotificacion);
});

//PUT
app.put("/Notificaciones/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.idNotificacio);
    const notificacionIndex = data.notificaciones.findIndex((notificacion) => notificacion.idNotificacion === id);
    data.notificaciones[notificacionIndex] = {
        ...data.notificaciones[notificacionIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Notificacion updated successfully" });
});
    
//DELETE
app.delete("/Notificaciones/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const notificacionIndex = data.notificaciones.findIndex((notificacion) => notificacion.idNotificacion === id);
    data.notificaciones.splice(notificacionIndex, 1);
    writeData(data);
    res.json({message: "Notificacion deleted successfully"});
})

//Funció per escoltar
app.listen(3001,() => {
    console.log("Server listening on port 3001");
});