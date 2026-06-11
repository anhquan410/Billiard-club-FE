import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type DeleteProductDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteProductDialog({
  open,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} disableScrollLock>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa sản phẩm này không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
