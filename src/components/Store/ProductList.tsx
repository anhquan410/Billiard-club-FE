import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import type { Product } from "../../libs/types/store.type";

type ProductListProps = {
  products: Product[];
  searchText: string;
  onSearchChange: (text: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  onAddProduct: (product: Product) => void;
};

export default function ProductList({
  products,
  searchText,
  onSearchChange,
  category,
  onCategoryChange,
  onAddProduct,
}: ProductListProps) {
  const categories = [
    "Tất cả",
    "Sản phẩm",
    "Food",
    "Beer",
    "Thuốc lá",
    "Khác",
    "Nước ngọt",
    "Coffe",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Tìm kiếm"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => onCategoryChange(cat)}
            color={category === cat ? "primary" : "default"}
            sx={{
              bgcolor: cat === "Tất cả" ? "#ff5252" : undefined,
              color: cat === "Tất cả" ? "white" : undefined,
            }}
          />
        ))}
      </Box>

      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {products.map((product) => (
          <ListItem
            key={product.id}
            sx={{
              mb: 1,
              bgcolor: "white",
              borderRadius: 1,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#f0f0f0",
              },
            }}
            onClick={() => onAddProduct(product)}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "#e0e0e0" }}>{product.image}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={product.name}
              secondary={
                <Box>
                  <Typography
                    variant="body2"
                    color="warning.main"
                    fontWeight="500"
                  >
                    {product.price.toLocaleString("vi-VN")} ₫
                  </Typography>
                  <Typography
                    variant="caption"
                    color={
                      product.stock.includes("Còn")
                        ? "success. main"
                        : "error.main"
                    }
                  >
                    {product.stock}
                  </Typography>
                </Box>
              }
            />
            <IconButton
              sx={{
                bgcolor: "#ff5252",
                color: "white",
                "&: hover": { bgcolor: "#f44336" },
              }}
            >
              <AddIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ mt: 2, borderStyle: "dashed" }}
      >
        Tạo sản phẩm mới
      </Button>
    </Box>
  );
}
