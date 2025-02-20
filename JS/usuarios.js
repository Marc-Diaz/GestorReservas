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
        const data = fs.readFileSync("./JSON/Usuarios.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("./JSON/Usuarios.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};


app.get("/", (req,res)=>{
    res.send("Welcome to my first API with Node.js");
});

//GET
app.get("/Usuarios", (req,res)=>{
    const data = readData();
    res.json(data.usuarios);
});

//GET per id
app.get("/Usuarios/:id",(req,res)=>{
    const data=readData();
    const id = req.params.id;
    console.log(id);
    const usuario = data.usuarios.find((usuario)=>usuario.DNI === id);

    if(!usuario) res.status(404).json({message : "Usuario not found"})
    res.json(usuario);
});

//POST
app.post("/Usuarios",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newUsuario={
        ...body,
    };
    data.usuarios.push(newUsuario);
    writeData(data);
    res.json(newUsuario);
});

//PUT
app.put("/Usuarios/:id", (req, res) => {
    const data = readData();
    const id = req.params.id;
    const body = req.body;
    const usuarioIndex = data.usuarios.findIndex((usuario) => usuario.DNI === id);
    data.usuarios[usuarioIndex] = {
        ...data.usuarios[usuarioIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Usuario updated successfully" });
});
    
//DELETE
app.delete("/Usuarios/:id", (req, res) => {
    const data = readData();
    const id = req.params.id;
    const usuarioIndex = data.usuarios.findIndex((usuario) => usuario.DNI === id);
    data.usuarios.splice(usuarioIndex, 1);
    writeData(data);
    res.json({message: "Usuario deleted successfully"});
})

//Funció per escoltar
app.listen(3001,() => {
    console.log("Server listening on port 3001");
});