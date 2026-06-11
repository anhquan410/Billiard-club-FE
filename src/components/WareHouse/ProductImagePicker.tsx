import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { getProductImageUrl } from "../../libs/utils/productImage";

type Props = {
  currentImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
};

export default function ProductImagePicker({
  currentImageUrl,
  onFileSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const displayUrl = preview ?? getProductImageUrl(currentImageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect(file);
    } else {
      setPreview(null);
      onFileSelect(null);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        src={displayUrl ?? undefined}
        variant="rounded"
        sx={{ width: 88, height: 88, bgcolor: "#f5f5f5", fontSize: 14 }}
      >
        {!displayUrl && "Ảnh"}
      </Avatar>
      <Box>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          hidden
          onChange={handleChange}
        />
        <Button
          variant="outlined"
          startIcon={<PhotoCameraIcon />}
          onClick={() => inputRef.current?.click()}
          sx={{ textTransform: "none" }}
        >
          {currentImageUrl || preview ? "Thay ảnh" : "Thêm ảnh"}
        </Button>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          JPG, PNG, WEBP — tối đa 5MB
        </Typography>
      </Box>
    </Box>
  );
}
