import { NextFunction, Request, Response } from "express";
import { stripHtml } from "string-strip-html";
import cardActivationSchema from "../schemas/cardActivationSchema.js";
import cardSchema from "../schemas/cardSchema.js";

function sanitizeString(string: string) {
  return (stripHtml(string).result).trim();
}

const schemas = {
  "/card": cardSchema,
  "/card/activation": cardActivationSchema
}

export default async function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction) {
  const { body } = req;

  let schema;
  if(req.path.includes("activation")){
    schema = schemas[req.path.substring(0, req.path.length - 2)];
  }else{
    schema = schemas["/" + req.path.split("/")[1]];
  }

  Object.keys(body).forEach(key => {
    if (typeof (body[key]) === "string") body[key] = sanitizeString(body[key])
  });

  const validation = schema.validate(body, { abortEarly: false });
  if (validation.error) return res.status(422).send(validation.error.message);

  next();
}