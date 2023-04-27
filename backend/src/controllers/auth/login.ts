import { Request, Response } from "express";
import * as yup from "yup";
import { User } from "../../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

const schema = yup.object({
  body: yup.object({
    email: yup.string()
      .email('Invalid email')
      .test('bcoc', 'Email must be from bcoc domain', value => {
        if (!value) {
          return true; 
        }
        return value.endsWith('@bcoc.com');
      }).required(),
    password: yup.string()
      .min(8)
      .matches(/[A-Z]/)
      .matches(/^[^#^*()<>=+.]*$/)
      .required(),
  }),
});

export default async (req: Request, res: Response) => {
  let user = null;

  // throws error when the POST-ed queries are invalide (email and password)
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  // throws error if user with provided email not found
  try {
    user = await User.findOneOrFail({ email: req.body.email });
  } catch (error: any) {
    return res.status(404).send(error);
  }

  // throws error if user is not verified
  if (!user.verified) return res.status(400).send("Not verified");

  // throws error if user password doesn't match
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).send("Password doesn't match");

  // if the code reaches here then the user is authenticated
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    return res.status(500).send("server error");
  }

  const plainUserObject = {
    index: user.index,
    name: user.name,
    id: user.id,
    role: user.role,
    email: user.email,

  };
  
  const accessToken = jwt.sign(plainUserObject, accessTokenSecret, {
    expiresIn: 60,
  });
  const refreshToken = jwt.sign(plainUserObject, refreshTokenSecret, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    expires: dayjs().add(7, "days").toDate(),
  });

  return res.send({ user, accessToken });
};
