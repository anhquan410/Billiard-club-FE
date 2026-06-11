import { Box, CircularProgress } from "@mui/material";

type PageLoaderProps = {
  color?: string;
  minHeight?: number | string;
  size?: number;
};

export default function PageLoader({
  color = "#607d8b",
  minHeight = 300,
  size = 40,
}: PageLoaderProps) {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
        width: "100%",
      }}
    >
      <CircularProgress size={size} sx={{ color }} />
    </Box>
  );
}
