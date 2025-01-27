module.exports = (req, res) => {
  res.status(201).json({ message: "User created", body: req.body });
};
