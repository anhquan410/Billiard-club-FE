import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { searchCustomers } from "../../libs/api/user";

export type CustomerOption = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  bonusPoints: number;
  membershipTier: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (customer: CustomerOption) => void;
};

export default function FindCustomerDialog({ open, onClose, onSelect }: Props) {
  const [keyword, setKeyword] = useState("");
  const [applied, setApplied] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["customers", "search", applied],
    queryFn: () => searchCustomers(applied),
    enabled: open,
  });

  const handleSearch = () => {
    setApplied(keyword.trim());
    refetch();
  };

  const handleClose = () => {
    setKeyword("");
    setApplied("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tìm khách hàng</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 1, mb: 2, mt: 0.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tên, SĐT hoặc email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Tìm
          </Button>
        </Box>

        {isLoading || isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : !data?.length ? (
          <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
            Không tìm thấy khách hàng
          </Typography>
        ) : (
          <List dense sx={{ maxHeight: 320, overflow: "auto" }}>
            {data.map((customer) => (
              <ListItemButton
                key={customer.id}
                onClick={() => {
                  onSelect(customer);
                  handleClose();
                }}
              >
                <ListItemText
                  primary={customer.fullName}
                  secondary={`${customer.phone} · ${customer.email} · ${customer.bonusPoints} điểm`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
