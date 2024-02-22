const z = require("zod");

const usuarioSchema = z.object({
  email: z.string().email({
    invalid_type_error: "Usuario necesia un email valido",
    required_error: "Email es requerido",
  }),
  password: z.string().min(1).max(60),
  rol: z.enum(
    ["Full Stack Developer", "Frontend Developer", "Backend Developer"],
    {
      required_error: "Rol es requerido.",
      invalid_type_error: "El rol  no es valido",
    }
  ),
  lenguage: z.enum(["JavaScript", "Python", "Ruby"], {
    required_error: "Lenguaje es requerido.",
    invalid_type_error: "El Lenguaje  no es valido",
  }),
});

function validateUsuario(input) {
  return usuarioSchema.safeParse(input);
}

function validatePartialUsuario(input) {
  return usuarioSchema.partial().safeParse(input);
}

module.exports = {
  validateUsuario,
  validatePartialUsuario
};


