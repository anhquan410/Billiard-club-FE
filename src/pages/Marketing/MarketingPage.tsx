import { Box, Typography, Grid, Paper, Avatar, Stack } from "@mui/material";

export default function MarketingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: -15,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, md: 5 },
          borderRadius: 4,
          maxWidth: 1200,
          width: "100%",
          mx: 2,
          background: "white",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Avatar
              alt="CLB Bi-a"
              src="/public/iball_logo.png"
              sx={{
                width: { xs: 140, md: 180 },
                height: { xs: 140, md: 180 },
                mx: "auto",
                boxShadow: 3,
                overflow: "hidden",
                "& img": {
                  objectFit: "contain", // hoặc "contain" nếu muốn zoom ít lại
                  width: "100%",
                  height: "100%",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#004aad",
                mb: 1,
                fontSize: { xs: 28, md: 34 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              CÂU LẠC BỘ BI-A IBALL
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: "#558",
                mb: 2,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Kết nối đam mê – Thăng hoa kỹ năng!
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                color: "#234",
                mb: 3,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Chào mừng bạn đến với CLB Bi-a IBall! <br />
              Đây là mái nhà chung của những người yêu thích bộ môn bi-a mọi
              trình độ. Chúng tôi thường xuyên tổ chức giao lưu, giải đấu, huấn
              luyện bài bản, chia sẻ tips kỹ thuật từ cơ bản đến nâng cao. Là
              thành viên, bạn sẽ được trải nghiệm môi trường vui vẻ, phát triển
              bản thân, kết nối bạn bè có cùng đam mê.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
            ></Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mb: 2, color: "#1769aa" }}
          >
            Một số hoạt động tiêu biểu của CLB
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 110,
                  textAlign: "center",
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1976d2" }}
                >
                  🎱 Giao lưu, học hỏi
                </Typography>
                <Typography sx={{ color: "#555", mt: 1, fontSize: 15 }}>
                  Chia sẻ kinh nghiệm, luyện tập nâng cao kỹ năng bi-a cùng
                  nhau.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 110,
                  textAlign: "center",
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#ff7600" }}
                >
                  🏆 Tổ chức giải đấu
                </Typography>
                <Typography sx={{ color: "#555", mt: 1, fontSize: 15 }}>
                  Cơ hội tranh tài và nhận thưởng từ các giải đấu nội bộ và mở
                  rộng.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 110,
                  textAlign: "center",
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#2196f3" }}
                >
                  🤝 Kết nối cộng đồng
                </Typography>
                <Typography sx={{ color: "#555", mt: 1, fontSize: 15 }}>
                  Làm quen nhiều bạn mới cùng sở thích và xây dựng mạng lưới
                  rộng khắp.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
