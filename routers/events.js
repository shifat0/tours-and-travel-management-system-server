const express = require("express");
const router = express.Router();
const { Event } = require("../models/event");
const multer = require("multer");

// *** For image upload ***
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) uploadError = null;
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

// Get request
router.get("/", async (req, res) => {
  const eventList = await Event.find();
  if (!eventList) return res.status(500).json({ success: false });
  res.status(200).send(eventList);
});

// Getting with id
router.get(`/:id`, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) res.status(500).json({ success: false });
  res.send(event);
});

// Post request
router.post("/", upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "inavlid file" });

  const filename = req.file.filename; // uploaded image name
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const event = await new Event({
    eventName: req.body.eventName,
    place: req.body.place,
    description: req.body.description,
    fee: req.body.fee,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    image: `${basePath}${filename}`,
  }).save();

  if (!event)
    return res.status(400).json({ message: "Event cannnot be created" });
  return res.status(200).send(event);
});

// Update request
router.put("/:id", upload.single("image"), async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(400).send("Invalid Event");

  let imagePath;
  const file = req.file;

  if (file) {
    const filename = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${filename}`;
  } else imagePath = event.image;

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    {
      eventName: req.body.eventName,
      place: req.body.place,
      description: req.body.description,
      fee: req.body.fee,
      startingDate: req.body.startingDate,
      endDate: req.body.endDate,
      image: imagePath,
    },
    { new: true } // show the updated info on load
  );

  if (!updatedEvent)
    return res.status(400).json({ message: "Event cannot be updated" });
  res.status(200).send(updatedEvent);
});

// Delete Method
router.delete("/:id", (req, res) => {
  Event.findByIdAndRemove(req.params.id)
    .then((event) => {
      if (event)
        return res
          .status(200)
          .json({ success: true, message: "Event is deleted successfully" });
      else
        return res
          .status(404)
          .json({ success: false, message: "Event is not found" });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
