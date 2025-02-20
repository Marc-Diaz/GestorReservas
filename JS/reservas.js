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
        const data = fs.readFileSync("./JSON/Reservas.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("./JSON/Reservas.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};


app.get("/", (req,res)=>{
    res.send("Welcome to my first API with Node.js");
});

//GET
app.get("/Reservas", (req,res)=>{
    const data = readData();
    res.json(data.reservas);
});

//GET per id
app.get("/Reservas/:id",(req,res)=>{
    const data=readData();
    const id = parseInt(req.params.id);
    const notificacion = data.reservas.find((reserva)=>reserva.idReserva === id);

    if(!notificacion) res.status(404).json({message : "Reserva not found"})
    res.json(notificacion);
});

//POST
app.post("/Reservas",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newReserva={
        idReserva:data.reservas.length+1,
        ...body,
    };
    data.reservas.push(newReserva);
    writeData(data);
    res.json(newReserva);
});

//PUT
app.put("/Reservas/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.idReserva);
    const ReservaIndex = data.reservas.findIndex((reserva) => reserva.idReserva === id);
    data.reservas[ReservaIndex] = {
        ...data.reservas[ReservaIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Reserva updated successfully" });
});
    
//DELETE
app.delete("/Reservas/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const reservaIndex = data.reservas.findIndex((reserva) => reserva.idReserva === id);
    data.reservas.splice(reservaIndex, 1);
    writeData(data);
    res.json({message: "Reserva deleted successfully"});
})

//Funció per escoltar
app.listen(3001,() => {
    console.log("Server listening on port 3001");
});