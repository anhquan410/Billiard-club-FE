import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { TableData } from "../../libs/types/store.type";

interface TableCardProps {
  table: TableData;
  onOpenOrder: (table: TableData) => void;
}

export default function TableCard({ table, onOpenOrder }: TableCardProps) {
  return (
    <Card
      sx={{
        bgcolor: "#4caf50",
        color: "white",
        position: "relative",
        minHeight: 200,
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
          {table.name}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Trống
        </Typography>
        <Box sx={{ mt: 2, fontSize: "13px" }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            KH:
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Tổng tiền:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1,
              mt: 0.5,
            }}
          >
            <Typography variant="body2">Đèn: </Typography>
            <Switch
              size="small"
              checked={table.lightOn}
              sx={{
                "& .MuiSwitch-switchBase": {
                  color: "white",
                },
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "white",
                },
                "& .MuiSwitch-track": {
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                },
              }}
            />
          </Box>
        </Box>
        <IconButton
          onClick={() => onOpenOrder(table)}
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            bgcolor: "rgba(255, 255, 255, 0.3)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
