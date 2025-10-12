export const isPatient = (req, res, next) => {
  try {
    if(req.user.role==="PATIENT"){
        next();
    }else{
        return res.status(400).json({ message: 'Unauthorized : This user is not PATIENT' });
    }

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
