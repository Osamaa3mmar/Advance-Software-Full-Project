export const isDonnor = (req, res, next) => {
	try {
		if (req.user.role === "DONOR") {
			next();
		} else {
			return res
				.status(400)
				.json({ message: "Unauthorized : This user is not a donor" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Server Error" });
	}
};
