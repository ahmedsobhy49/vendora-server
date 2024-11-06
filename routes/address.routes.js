import { Router } from "express";
import {
  getAddressByUserId,
  postAddress,
} from "../controllers/address.controller.js";

const AddressRouter = Router();

// Route to get address by user ID
AddressRouter.get("/address/:userId", getAddressByUserId);

// Route to post address for a user
AddressRouter.post("/address", postAddress);

export default AddressRouter;
