# Documentació de l'API

Aquesta API proporciona funcionalitats per a la gestió de **recursos**, **reserves**, **usuaris** i **notificacions**. 

---

## **Endpoints de l'API**

### **1. Recursos** (`/Recursos`)

#### **Obtenir tots els recursos**
```javascript
app.get("/Recursos", (req, res) => {
    const data = readData();
    res.json(data.recursos);
});
```

#### **Obtenir un recurs per ID**
```javascript
app.get("/Recursos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const recurs = data.recursos.find((recurs) => recurs.idRecurso === id);
    if (!recurs) res.status(404).json({ message: "Recurso not found" });
    res.json(recurs);
});
```

#### **Afegir un nou recurs**
```javascript
app.post("/Recursos", (req, res) => {
    const data = readData();
    const body = req.body;
    const newRecurs = {
        idRecurso: data.recursos.length + 1,
        ...body,
    };
    data.recursos.push(newRecurs);
    writeData(data);
    res.json(newRecurs);
});
```

#### **Modificar un recurs existent**
```javascript
app.put("/Recursos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const body = req.body;
    const recursIndex = data.recursos.findIndex((recurs) => recurs.idRecurso === id);
    if (recursIndex === -1) return res.status(404).json({ message: "Recurso not found" });
    data.recursos[recursIndex] = { ...data.recursos[recursIndex], ...body };
    writeData(data);
    res.json({ message: "Recurso updated successfully" });
});
```

#### **Eliminar un recurs**
```javascript
app.delete("/Recursos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    data.recursos = data.recursos.filter((recurs) => recurs.idRecurso !== id);
    writeData(data);
    res.json({ message: "Recurso deleted successfully" });
});
```

---

### **2. Reserves** (`/Reservas`)

_(Endpoints similars als de Recursos)_

---

### **3. Usuaris** (`/Usuarios`)

_(Endpoints similars als de Recursos, però identificant usuaris per DNI)_

---

### **4. Notificacions** (`/Notificaciones`)

_(Endpoints similars als de Recursos)_

---

## **Regles de negoci a implementar**

1. Quan un usuari afegeixi una nova reserva, s'afegirà a la taula **RESERVAS**.
2. Quan una reserva arribi a la seva data de finalització, s'eliminarà de **RESERVAS** i s'afegirà a **NOTIFICACIONS**.
3. Els usuaris amb el rol **"administrador"** poden afegir nous recursos a la base de dades.
4. Sempre que un usuari cancel·li, modifiqui o completi una reserva, s'enviarà una notificació i s'afegirà la informació a **NOTIFICACIONS**.

---

## **Millores pendents**
1. Implementar **integritat referencial** per evitar inconsistències entre taules.
2. Integrar les **regles de negoci** per garantir la coherència de les operacions.
3. **Refactoritzar el codi** per evitar repeticions i millorar-ne la llegibilitat.

