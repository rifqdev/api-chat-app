const express = require("express");
const router = express.Router();
const personsController = require("./persons.controllers");
const jwtMiddleware = require("../../middlewares/jwt");

router.post("/add", jwtMiddleware.verifyToken, personsController.addPerson);
router.get("/", jwtMiddleware.verifyToken, personsController.getPersons);

module.exports = router;
