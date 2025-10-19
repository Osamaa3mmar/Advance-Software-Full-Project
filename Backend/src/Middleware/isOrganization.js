export const isOrganization = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    if (user.role !== "ORGANIZATION") {
      return res
        .status(403)
        .json({ message: "Forbidden. Organizations only." });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
