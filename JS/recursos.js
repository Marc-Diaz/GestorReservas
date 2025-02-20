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


app.get("/", (req,res)=>{
    res.send("Welcome to my first API with Node.js");
});

//GET
app.get("/Recursos", (req,res)=>{
    const data = readData();
    res.json(data.recursos);
});

//GET per id
app.get("/Recursos/:id",(req,res)=>{
    const data=readData();
    const id = parseInt(req.params.id);
    const recurs = data.recursos.find((recurs)=>recurs.idRecurso === id);
    console.log(recurs)
    console.log(req.params.id)
    console.log(id)
    if(!recurs) res.status(404).json({message : "Recurso not found"})
    res.json(recurs);
});

//POST
app.post("/Recursos",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newRecurs={
        idRecurso:data.recursos.length+1,
        ...body,
    };
    data.recursos.push(newRecurs);
    writeData(data);
    res.json(newRecurs);
});

//PUT
app.put("/Recursos/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.idRecurso);
    const recursIndex = data.recursos.findIndex((recurs) => recurs.idRecurso === id);
    data.recursos[recursIndex] = {
        ...data.recurs[recursIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Recurso updated successfully" });
});
    
//DELETE
app.delete("/Recursos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const recursosIndex = data.recursos.findIndex((recurs) => recurs.idRecurso === id);
    data.recursos.splice(recursosIndex, 1);
    writeData(data);
    res.json({message: "Recurso deleted successfully"});
})

//Funció per escoltar
app.listen(3001,() => {
    console.log("Server listening on port 3001");
});