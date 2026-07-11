/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import PageLoader from "../../components/common/PageLoader";
import { useBonusSettings } from "../../libs/hooks/useBonus";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import type { BonusSettings } from "../../libs/api/bonus";

type FormState = Omit<BonusSettings, "id" | "updatedAt">;

const defaultForm: FormState = {
  pointsPerVnd: 10000,
  vndPerPoint: 1000,
  maxDiscountPercent: 30,
  silverThreshold: 1000,
  goldThreshold: 2000,
  platinumThreshold: 5000,
  diamondThreshold: 10000,
  bronzeDiscount: 5,
  silverDiscount: 10,
  goldDiscount: 15,
  platinumDiscount: 20,
  diamondDiscount: 25,
};

export default function BonusSettingsPage() {
  const { data, isLoading, isError, error, updateSettings, isSaving } =
    useBonusSettings();
  const { showSuccess, showError } = useSnackbar();
  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    if (data) {
      const { id: _id, updatedAt: _updatedAt, ...rest } = data;
      setForm(rest);
    }
  }, [data]);

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: Number(e.target.value),
      }));
    };

  const handleSave = () => {
    updateSettings(form, {
      onSuccess: () => showSuccess("Đã lưu cài đặt điểm thưởng"),
      onError: (err) =>
        showError(getApiErrorMessage(err, "Lưu cài đặt thất bại")),
    });
  };

  if (isLoading) {
    return <PageLoader color="#607d8b" />;
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          {getApiErrorMessage(error, "Không thể tải cài đặt")}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <SettingsIcon sx={{ color: "#607d8b" }} />
        <Typography variant="h6" fontWeight={700}>
          Cài đặt điểm thưởng
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Quy đổi điểm
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="VNĐ tích 1 điểm"
              type="number"
              value={form.pointsPerVnd}
              onChange={handleChange("pointsPerVnd")}
              helperText="VD: 10.000 VNĐ = 1 điểm"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="VNĐ giảm / 1 điểm đổi"
              type="number"
              value={form.vndPerPoint}
              onChange={handleChange("vndPerPoint")}
              helperText="VD: 1 điểm = 1.000 VNĐ"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="% tối đa đổi điểm / hóa đơn"
              type="number"
              value={form.maxDiscountPercent}
              onChange={handleChange("maxDiscountPercent")}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Ngưỡng hạng (điểm tích lũy)
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Bạc (Silver)"
              type="number"
              value={form.silverThreshold}
              onChange={handleChange("silverThreshold")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Vàng (Gold)"
              type="number"
              value={form.goldThreshold}
              onChange={handleChange("goldThreshold")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Bạch kim (Platinum)"
              type="number"
              value={form.platinumThreshold}
              onChange={handleChange("platinumThreshold")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Kim cương (Diamond)"
              type="number"
              value={form.diamondThreshold}
              onChange={handleChange("diamondThreshold")}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          % giảm giá theo hạng
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Đồng (Bronze) %"
              type="number"
              value={form.bronzeDiscount}
              onChange={handleChange("bronzeDiscount")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Bạc (Silver) %"
              type="number"
              value={form.silverDiscount}
              onChange={handleChange("silverDiscount")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Vàng (Gold) %"
              type="number"
              value={form.goldDiscount}
              onChange={handleChange("goldDiscount")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Bạch kim (Platinum) %"
              type="number"
              value={form.platinumDiscount}
              onChange={handleChange("platinumDiscount")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Kim cương (Diamond) %"
              type="number"
              value={form.diamondDiscount}
              onChange={handleChange("diamondDiscount")}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving}
            sx={{ bgcolor: "#607d8b" }}
          >
            Lưu cài đặt
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
