import { Request, Response } from "express";
import { User } from "../../entity/User";

export default async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({ id: req.body.id });
    res.send(user);
  } catch (error: any) {
    if (error.name === "EntityNotFound") {
      return res.status(404).send("User not found");
    } else {
      console.error(error);
      return res.status(500).send("An error occurred");
    }
  }
};
