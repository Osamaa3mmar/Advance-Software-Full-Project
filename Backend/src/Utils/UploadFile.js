import multer from "multer";

export const fileUpload = () => {
  const storage = multer.diskStorage({
  });
  const upload = multer({ storage });
  return upload;
};