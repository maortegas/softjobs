const { validateUsuario } = require("../schemas/usuario");
const { pool } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createUser = async (req, res, next) => {
  const result = req.body
  const { email, password, rol, lenguage } = result;
  const passwordHash = bcrypt.hashSync(password);

  try {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (email, password, rol, lenguage) VALUES($1, $2, $3, $4) ",
      [email, passwordHash, rol, lenguage]
    );

    res.status(201).json(rows);

  } catch (e) {
    next(e)
};
}

const loginUser = async (req, res, next) => {
  const result = req.body;
  const { email } = result;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email= $1 ",
      [email]
    );
   const token = jwt.sign({ email }, process.env.SECRET, {
     expiresIn: "1m",
   });
    res.status(200).json({ rows, token });
  } catch (e) {
    next(e);
  }
};

const selectUser = async (req, res, next) => {
  const { email} = req.body;;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email= $1",
      [email]
    );
   return res.status(200).json(rows);
  } catch (e) {
    next(e);
  }
};

module.exports = { createUser, loginUser, selectUser };
