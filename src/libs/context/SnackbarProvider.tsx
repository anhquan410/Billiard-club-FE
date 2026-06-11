import { Alert, Snackbar, type AlertColor } from "@mui/material";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { SnackbarContext } from "./SnackbarContext";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = "success") => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  const showSuccess = useCallback(
    (message: string) => showSnackbar(message, "success"),
    [showSnackbar],
  );

  const showError = useCallback(
    (message: string) => showSnackbar(message, "error"),
    [showSnackbar],
  );

  const value = useMemo(
    () => ({ showSnackbar, showSuccess, showError }),
    [showSnackbar, showSuccess, showError],
  );

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={handleClose}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
