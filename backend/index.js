const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./routes/usuario");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/", routes);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
