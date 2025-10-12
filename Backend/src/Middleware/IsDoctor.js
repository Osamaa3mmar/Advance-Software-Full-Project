export const isDoctor = (req, res, next) => {
  try {
    if(req.user.role==="DOCTOR"){
        next();
    }else{
        return res.status(400).json({ message: "Unauthorized : This user is not DOCTOR" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
