//Importa les biblioteques necessàries
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

//Crea l'objecte de l'aplicació
const route = express.Router();

route.use(bodyParser.json());

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



//GET
route.get("/", (req,res)=>{
    const data = readData();
    //res.render("notificaciones", {data})
    res.json(data.notificaciones)
});

//GET per id
route.get("/:id",(req,res)=>{
    const data=readData();
    const id = parseInt(req.params.id);
    const notificacion = data.notificaciones.find((notificacion)=>notificacion.idNotificacion === id);
    if(!notificacion) res.status(404).json({message : "Notificacio no trovada"})
        //res.render("notificacion", {notificacion})
        res.json(notificacion);

});

//POST
route.post("/",(req,res)=>{
    const data=readData();
    const body=req.body;
    const newNotificacion={
        idNotificacion:data.notificaciones.length+1,
        ...body,
    };
    if(data.notificaciones.some(notificacion => notificacion.idNotificacio == newNotificacion.idNotificacio)){
        res.status(409).json({ message : "Notifcacio duplicada"})
    }
    else {
        data.notificaciones.push(newNotificacion);
        writeData(data);
        res.json(newNotificacion);
    }
});

//PUT
route.put("/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.idNotificacio);
    const notificacionIndex = data.notificaciones.findIndex((notificacion) => notificacion.idNotificacion === id);
    if(notificacionIndex == -1){
        res.status(404).json({message : "Notificacio no trovada"})
    }
    else{
        data.notificaciones[notificacionIndex] = {
            ...data.notificaciones[notificacionIndex],
            ...body,
        };
        writeData(data);
        res.json({ message: "Notificacion updated successfully" });
    }
});
    
//DELETE
route.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const notificacionIndex = data.notificaciones.findIndex((notificacion) => notificacion.idNotificacion === id);
    if(notificacionIndex == -1){
        res.status(404).json({message : "Notificacio no trovada"})
    }
    else{
        data.notificaciones.splice(notificacionIndex, 1);
        writeData(data);
        res.json({message: "Notificacion deleted successfully"});
    }
})

export default route