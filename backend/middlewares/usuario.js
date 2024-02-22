const {
  validateUsuario,
  validatePartialUsuario,
} = require("../schemas/usuario");
const {pool}= require("../db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const validatePostMiddleware = async (req, res, next) => {
  const data = req.body;
  const result = validateUsuario(data);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  try {
    const consulta = 'SELECT * FROM usuarios WHERE email = $1';
    const values = [data.email];
    const { rows } = await pool.query(consulta, values);

    if (rows.length>0){
      return res.status(400).json({ error: "email existe" });
    }
    else{
      const report = `La url consulta es ${req.originalUrl} a tráves de metodo ${req.method}
      con los siguientes parámetro `;

      console.log(report); 
      console.table(data);
      next()
    }

  } catch (error) {
    console.log(error);
  }
};

const validateLoginMiddleware = async (req, res, next) => {
  const data = req.body;
  const result = validatePartialUsuario(data);

  console.log(result);
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  try {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [data.email];
    const { rows } = await pool.query(consulta, values);

    if (rows.length < 1) {
      return res.status(400).json({ error: "email existe" });
    } else {
      
      
      if (bcrypt.compareSync(data.password, rows[0].password)) {
        const report = `La url consulta es ${req.originalUrl} a tráves de metodo ${req.method}
        con los siguientes parámetro `;

        console.log(report);
        console.table(data);
        next();
      } else {
        return res.status(400).json({ error: "Password incorrecta" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const validateGetMiddleware = async (req, res, next) => {
  const data = req.body;
  const Authorization = req.header("Authorization");
  const token = Authorization.split("Bearer ")[1];

  if (Authorization == undefined) {
    return res.status(400).json({message: "No existe token",});
  }
  
  try {

    try{
    jwt.verify(token, process.env.SECRET);
    }
    catch(e){
          return res.status(400).json({
             status: "Bad Request",
             message: "Token invalido",
           });
          
    }
    const { email } = jwt.decode(token);

    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(consulta, values);

    if (rows.length < 1) {
      return res.status(400).json({ error: "email no existe" });
    } else {
        const report = `La url consulta es ${req.originalUrl} a tráves de metodo ${req.method}
        con los siguientes parámetro `;

        console.log(report);
        console.table(rows);
        req.body=rows[0]
        next();
    }
  } catch (error) {
     res.status(400).json({
                    status: 'Bad Request',
                    message: 'Token invalido',
                });
    next(error)
  }
};

module.exports = {
  validatePostMiddleware,
  validateLoginMiddleware,
  validateGetMiddleware,
};
