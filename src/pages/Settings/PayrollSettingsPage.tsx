import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import PageLoader from "../../components/common/PageLoader";
import { usePayrollSettings } from "../../libs/hooks/usePayroll";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";

type FormState = {
  dayShiftRate: number;
  eveningShiftRate: number;
  nightShiftRate: number;
};

const defaultForm: FormState = {
  dayShiftRate: 150000,
  eveningShiftRate: 180000,
  nightShiftRate: 200000,
};

export default function PayrollSettingsPage() {
  const { data, isLoading, isError, error, updateSettings, isSaving } =
    usePayrollSettings();
  const { showSuccess, showError } = useSnackbar();
  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    if (data) {
      setForm({
        dayShiftRate: data.dayShiftRate,
        eveningShiftRate: data.eveningShiftRate,
        nightShiftRate: data.nightShiftRate,
      });
    }
  }, [data]);

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }));
    };

  const handleSave = async () => {
    try {
      await updateSettings(form);
      showSuccess("Đã cập nhật mức lương ca");
    } catch (e) {
      showError(getApiErrorMessage(e));
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <SettingsIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Cài đặt mức lương ca
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error)}
        </Alert>
      )}

      <Paper sx={{ p: 3, maxWidth: 560 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mức lương cho mỗi ca đã duyệt. Tách biệt với hệ thống điểm thưởng
          khách hàng.
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              label="Ca ngày (9h–17h) — VNĐ"
              value={form.dayShiftRate}
              onChange={handleChange("dayShiftRate")}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              label="Ca tối (17h–1h) — VNĐ"
              value={form.eveningShiftRate}
              onChange={handleChange("eveningShiftRate")}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="number"
              label="Ca đêm (1h–9h) — VNĐ"
              value={form.nightShiftRate}
              onChange={handleChange("nightShiftRate")}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={isSaving}
          sx={{ mt: 3 }}
        >
          Lưu cài đặt
        </Button>
      </Paper>
    </Box>
  );
}
