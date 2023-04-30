const express = require("express");
const eventsController = require("../controller/eventsController");

const router = express.Router();

router.get("/:student_id", eventsController.getEvents);
router.put("/event/:student_id", eventsController.updateEvent);
router.put("/assignment/:student_id", eventsController.updateAssignment);
router.post("/", eventsController.addEvent);
// router.post("/:student_id", eventsController.updateEvent);
// router.delete("/member_items", itemsController.deleteAllItem);
// router.delete("/:item_id", itemsController.deleteItem);

module.exports = router;
