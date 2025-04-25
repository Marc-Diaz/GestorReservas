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
        const data = fs.readFileSync("JSON/Recursos.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("JSON/Recursos.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

//GET
route.get("/", (req,res)=>{
    const data = readData();
    res.render("recursos", {data, htmlNav})
    //res.json(data.recursos);
});

//Get pagina crear Recurso
route.get("/crearRecurso", (req,res)=>{
    res.render("recursoCrear", {htmlNav})
    //res.json(data.recursos);
});

//Get pagina editar Recurso
route.get("/editarRecurso/:id", (req,res)=>{
    const data=readData();
    const id = parseInt(req.params.id);
    const recurs = data.recursos.find((recurs)=>recurs.idRecurso === id);
    console.log(recurs)
    if(!recurs) res.status(404).json({message : "Recurs no trobat"})
    else {
        let textArea = `<textarea rows="10" cols="50" name="descripcion" id="descripcion" required style="resize: none;">
                    ${recurs.descripcio}
                </textarea>`
        res.render("recursoEditar", {recurs, textArea, htmlNav})
    } 
});

//GET per id
route.get("/:id",(req,res)=>{
    const data=readData();
    const id = parseInt(req.params.id);
    const recurs = data.recursos.find((recurs)=>recurs.idRecurso === id);
    if(!recurs) res.status(404).json({message : "Recurs no trobat"})
    else res.render("recursoDetall", {recurs, htmlNav})
    //res.json(recurs);
});

//POST
route.post("/",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newRecurs={
        idRecurso:data.recursos.length+1,
        ...body,
    };
    if(data.recursos.some(recurso => recurso.idRecurso == newRecurs.idRecurso)){
        res.status(409).json({message : "Recurs duplicat"})
    }
    else{
        data.recursos.push(newRecurs);
        writeData(data);
        res.json(newRecurs);
    }
});

//PUT
route.put("/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.idRecurso);
    const recursIndex = data.recursos.findIndex((recurs) => recurs.idRecurso === id);
    if(recursIndex == -1){
        res.status(404).json({message : "Recurso no trobat"})
    }
    else{
        data.recursos[recursIndex] = {
            ...data.recurs[recursIndex],
            ...body,
        };
        writeData(data);
        res.json({ message: "Recurso updated successfully" });
    }
});
    
//DELETE
route.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const recursosIndex = data.recursos.findIndex((recurs) => recurs.idRecurso === id);
    if(recursosIndex == -1){
        res.status(404).json({message : "Recurso no trobat"})
    }
    else{
        data.recursos.splice(recursosIndex, 1);
        writeData(data);
        res.json({message: "Recurso deleted successfully"});
    }
})

export default route