import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageLoader from "../../components/common/PageLoader";
import { useAccount } from "../../libs/hooks/useAccount";
import { useBonusHistory, useBonusProfile } from "../../libs/hooks/useBonus";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import {
  BONUS_TX_TYPE_LABELS,
  getTierLabel,
  TIER_COLORS,
} from "../../libs/utils/bonusLabels";

export default function CustomerBonusPage() {
  const { user } = useAccount();
  const userId = user?.id;

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErr,
    refetch: refetchProfile,
    isFetching: profileFetching,
  } = useBonusProfile(userId);

  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
    error: historyErr,
    refetch: refetchHistory,
    isFetching: historyFetching,
  } = useBonusHistory(userId);

  const isLoading = profileLoading || historyLoading;
  const isFetching = profileFetching || historyFetching;

  if (isLoading) {
    return <PageLoader color="#e91e63" />;
  }

  if (profileError || historyError || !profile) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(
            profileErr ?? historyErr,
            "Không thể tải thông tin điểm thưởng",
          )}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => {
            refetchProfile();
            refetchHistory();
          }}
          sx={{ textTransform: "none" }}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  const tierColor = TIER_COLORS[profile.membershipTier] ?? "#9e9e9e";
  const progressPercent =
    profile.nextTierThreshold && profile.nextTierThreshold > 0
      ? Math.min(
          100,
          (profile.bonusPoints / profile.nextTierThreshold) * 100,
        )
      : 100;

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <StarsIcon sx={{ color: "#e91e63", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>
            Điểm thưởng & Hạng thành viên
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => {
            refetchProfile();
            refetchHistory();
          }}
          disabled={isFetching}
          sx={{ textTransform: "none" }}
        >
          Làm mới
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Điểm hiện tại
            </Typography>
            <Typography variant="h3" fontWeight={700} color="#e91e63">
              {profile.bonusPoints.toLocaleString("vi-VN")}
            </Typography>
          </Box>
          <Box textAlign={{ xs: "left", sm: "right" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Hạng thành viên
            </Typography>
            <Chip
              label={getTierLabel(profile.membershipTier)}
              sx={{
                bgcolor: tierColor,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                px: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Giảm giá hạng: {profile.tierDiscountPercentage}%
            </Typography>
          </Box>
        </Box>

        {profile.pointsToNextTier != null && profile.nextTierThreshold != null && (
          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Tiến độ lên hạng tiếp theo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Còn {profile.pointsToNextTier.toLocaleString("vi-VN")} điểm
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#f5f5f5",
                "& .MuiLinearProgress-bar": { bgcolor: tierColor },
              }}
            />
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Lịch sử giao dịch điểm
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell align="right">Điểm</TableCell>
                <TableCell>Mô tả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!history?.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      Chưa có giao dịch điểm nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={BONUS_TX_TYPE_LABELS[tx.type] ?? tx.type}
                        color={
                          tx.type === "EARNED"
                            ? "success"
                            : tx.type === "REDEEMED"
                              ? "warning"
                              : "default"
                        }
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: tx.points >= 0 ? "#2e7d32" : "#d32f2f",
                        fontWeight: 600,
                      }}
                    >
                      {tx.points >= 0 ? "+" : ""}
                      {tx.points.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
