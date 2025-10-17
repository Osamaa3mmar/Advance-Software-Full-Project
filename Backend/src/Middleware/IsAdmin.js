export const isAdmin = (req, res, next) => {
  try {
    if(req.user.role==="ADMIN"){
        next();
    }else{
        return res.status(400).json({ message: 'Unauthorized : This user is not ADMIN' });
    }

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
