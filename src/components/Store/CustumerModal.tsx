import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerFormData) => void;
}

interface CustomerFormData {
  name: string;
  phone: string;
  group: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  gender?: string;
  birthday?: string;
  taxCode?: string;
  companyName?: string;
  notes?: string;
  loyaltyPoints?: number;
  membershipLevel?: string;
  preferredContact?: string;
  allowMarketing?: boolean;
}

export default function CustomerModal({
  open,
  onClose,
  onSave,
}: CustomerModalProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  // Tab 1: Thông tin cơ bản
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [group, setGroup] = React.useState("");
  const [email, setEmail] = React.useState("");

  // Tab 2: Chi tiết
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [ward, setWard] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [birthday, setBirthday] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Tab 3: Thông tin nâng cao
  const [taxCode, setTaxCode] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [loyaltyPoints, setLoyaltyPoints] = React.useState(0);
  const [membershipLevel, setMembershipLevel] = React.useState("");
  const [preferredContact, setPreferredContact] = React.useState("phone");
  const [allowMarketing, setAllowMarketing] = React.useState(true);

  const handleSave = () => {
    if (!name || !phone) {
      alert("Vui lòng nhập tên và số điện thoại khách hàng");
      return;
    }

    const formData: CustomerFormData = {
      name,
      phone,
      group,
      email,
      address,
      city,
      district,
      ward,
      gender,
      birthday,
      taxCode,
      companyName,
      notes,
      loyaltyPoints,
      membershipLevel,
      preferredContact,
      allowMarketing,
    };

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    // Reset all fields
    setName("");
    setPhone("");
    setGroup("");
    setEmail("");
    setAddress("");
    setCity("");
    setDistrict("");
    setWard("");
    setGender("");
    setBirthday("");
    setNotes("");
    setTaxCode("");
    setCompanyName("");
    setLoyaltyPoints(0);
    setMembershipLevel("");
    setPreferredContact("phone");
    setAllowMarketing(true);
    setActiveTab(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Thêm mới khách hàng
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
            },
            "& . Mui-selected": {
              color: "#f06292 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#f06292",
            },
          }}
        >
          <Tab label="Thông tin" />
          <Tab label="Chi tiết" />
          <Tab label="Thông tin nâng cao" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 3, minHeight: 400 }}>
        {/* Tab 1: Thông tin cơ bản */}
        {activeTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Tên khách hàng <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tên khách hàng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Số điện thoại <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Nhóm khách hàng
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Chọn nhóm khách hàng</em>
                    </MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                    <MenuItem value="regular">Thường xuyên</MenuItem>
                    <MenuItem value="new">Khách mới</MenuItem>
                    <MenuItem value="corporate">Doanh nghiệp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 2: Chi tiết */}
        {activeTab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Địa chỉ
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Số nhà, tên đường..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Tỉnh/Thành phố
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Chọn tỉnh/thành phố</em>
                    </MenuItem>
                    <MenuItem value="hanoi">Hà Nội</MenuItem>
                    <MenuItem value="hcm">TP. Hồ Chí Minh</MenuItem>
                    <MenuItem value="danang">Đà Nẵng</MenuItem>
                    <MenuItem value="haiphong">Hải Phòng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Quận/Huyện
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Chọn quận/huyện</em>
                    </MenuItem>
                    <MenuItem value="district1">Quận 1</MenuItem>
                    <MenuItem value="district2">Quận 2</MenuItem>
                    <MenuItem value="district3">Quận 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Phường/Xã
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Chọn phường/xã</em>
                    </MenuItem>
                    <MenuItem value="ward1">Phường 1</MenuItem>
                    <MenuItem value="ward2">Phường 2</MenuItem>
                    <MenuItem value="ward3">Phường 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormLabel
                  component="legend"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: 500 }}
                >
                  Giới tính
                </FormLabel>
                <RadioGroup
                  row
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Khác"
                  />
                </RadioGroup>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Ngày sinh
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Ghi chú
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  placeholder="Ghi chú về khách hàng..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 3: Thông tin nâng cao */}
        {activeTab === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Mã số thuế
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập mã số thuế"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Tên công ty
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tên công ty"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Điểm tích lũy
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="0"
                  value={loyaltyPoints}
                  onChange={(e) => setLoyaltyPoints(Number(e.target.value))}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>
                  Hạng thành viên
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={membershipLevel}
                    onChange={(e) => setMembershipLevel(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Chọn hạng thành viên</em>
                    </MenuItem>
                    <MenuItem value="bronze">Đồng</MenuItem>
                    <MenuItem value="silver">Bạc</MenuItem>
                    <MenuItem value="gold">Vàng</MenuItem>
                    <MenuItem value="platinum">Bạch kim</MenuItem>
                    <MenuItem value="diamond">Kim cương</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormLabel
                  component="legend"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: 500 }}
                >
                  Phương thức liên hệ ưu tiên
                </FormLabel>
                <RadioGroup
                  row
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value)}
                >
                  <FormControlLabel
                    value="phone"
                    control={<Radio />}
                    label="Điện thoại"
                  />
                  <FormControlLabel
                    value="email"
                    control={<Radio />}
                    label="Email"
                  />
                  <FormControlLabel
                    value="sms"
                    control={<Radio />}
                    label="SMS"
                  />
                  <FormControlLabel
                    value="zalo"
                    control={<Radio />}
                    label="Zalo"
                  />
                </RadioGroup>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allowMarketing}
                      onChange={(e) => setAllowMarketing(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Cho phép nhận thông tin khuyến mãi và marketing"
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, borderTop: "1px solid #e0e0e0" }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Thoát
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: "#f06292",
            "&:hover": { bgcolor: "#ec407a" },
          }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
