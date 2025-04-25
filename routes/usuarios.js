//Importa les biblioteques necessàries
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import { htmlNav } from "../config.js";


//Crea l'objecte de l'aplicació
const route = express.Router();

route.use(bodyParser.json());

//Llegeix les dades del fitxer
const readData = () => {
    try {
        const data = fs.readFileSync("JSON/Usuarios.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("JSON/Usuarios.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

//GET
route.get("/", (req,res)=>{
    const data = readData();
    res.render("usuarios", {data, htmlNav})
    //res.json(data.usuarios)
});

route.get("/crearUsuario", (req,res)=>{
    const data = readData();
    res.render("usuarioCrear", {htmlNav})
    //res.json(data.usuarios)
});

route.get("/editarUsuario/:id", (req,res)=>{
    const data=readData();
    const id = req.params.id;
    
    const usuario = data.usuarios.find((usuario)=>usuario.DNI == id);

    if(!usuario) res.status(404).json({message : "Usuari no trobat"});
    else {
        res.render("usuarioEditar", {usuario, htmlNav})
        //res.json(usuario);
    }
});

//GET per id
route.get("/:id",(req,res)=>{
    const data=readData();
    const id = req.params.id;
    
    const usuario = data.usuarios.find((usuario)=>usuario.DNI == id);

    if(!usuario) res.status(404).json({message : "Usuari no trobat"});
    else {
        res.render("usuarioDetalle", {usuario, htmlNav})
        //res.json(usuario);
    }
});

//POST
route.post("/",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newUsuario={
        ...body,
    };
    if(data.usuarios.some(usuario => usuario.DNI == newUsuario.DNI)){
        res.status(409).json({message : "Usuario duplicat"})
    }
    else{
        data.usuarios.push(newUsuario);
        writeData(data);
        res.json(newUsuario);
    }
    
});

//PUT
route.put("/:id", (req, res) => {
    const data = readData();
    const id = req.params.id;
    const body = req.body;
    const usuarioIndex = data.usuarios.findIndex((usuario) => usuario.DNI === id);
    if(usuarioIndex == -1){
        res.status(404).json({message : "Usuari no trobat"});
    }
    else{
        data.usuarios[usuarioIndex] = {
            ...data.usuarios[usuarioIndex],
            ...body,
        };
        writeData(data);
        res.json({ message: "Usuario updated successfully" });
    }
});
    
//DELETE
route.delete("/:id", (req, res) => {
    const data = readData();
    const id = req.params.id;
    const usuarioIndex = data.usuarios.findIndex((usuario) => usuario.DNI === id);
    if(usuarioIndex == -1){
        res.status(404).json({message : "Usuari no trobat"});
    }
    else{
        data.usuarios.splice(usuarioIndex, 1);
        writeData(data);
        res.json({message: "Usuario deleted successfully"});
    }    
});

export default route