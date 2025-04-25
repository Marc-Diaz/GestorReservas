//Importa les biblioteques necessàries
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

//Crea l'objecte de l'aplicació
export const route = express.Router();

route.use(bodyParser.json());

//Llegeix les dades del fitxer
const readData = () => {
    try {
        const data = fs.readFileSync("JSON/Reservas.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("JSON/Reservas.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};


//GET
route.get("/", (req,res)=>{
    const data = readData();
    //res.render("reservas", {data})
    res.json(data.reservas)
});

//GET per id
route.get("/:id",(req,res)=>{
    const data=readData();
    const id = parseInt(req.params.id);
    const reserva = data.reservas.find((reserva)=>reserva.idReserva === id);

    if(!reserva) res.status(404).json({message : "Reserva no trovada"});
    else{
        //res.render("recurso", {reserva});
        res.json(reserva)
    }
    
});

//POST
route.post("/",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newReserva={
        idReserva:data.reservas.length+1,
        ...body,
    };
    if(data.reservas.some(reserva => reserva.idReserva == newReserva.id)){
        res.status(409).json({message : "Reserva duplicada"})
    }
    else{
        data.reservas.push(newReserva);
        writeData(data);
        res.json(newReserva);
    }
});

//PUT
route.put("/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.idReserva);
    const reservaIndex = data.reservas.findIndex((reserva) => reserva.idReserva === id);
    if(reservaIndex == -1){
        res.status(404).json({message : "Reserva no trovada"})
    }
    else{
        data.reservas[reservaIndex] = {
            ...data.reservas[reservaIndex],
            ...body,
        };
        writeData(data);
        res.json({ message: "Reserva updated successfully" });
    }
});
    
//DELETE
route.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const reservaIndex = data.reservas.findIndex((reserva) => reserva.idReserva === id);
    if(reservaIndex == -1){
        res.status(404).json({message : "Reserva no trovada"})
    }
    else{
        data.reservas.splice(reservaIndex, 1);
        writeData(data);
        res.json({message: "Reserva deleted successfully"});
    }
});

export default route