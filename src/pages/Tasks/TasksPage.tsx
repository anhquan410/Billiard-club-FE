import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from "../../libs/utils/moduleLabels";
import type { Task, TaskStatus } from "../../libs/types/task.type";
import type { TaskQueryParams } from "../../libs/api/task";
import {
  useCreateTask,
  useStaffForAssignment,
  useTaskDashboard,
  useUpdateTaskStatus,
} from "../../libs/hooks/useTask";
import { useSnackbar } from "../../libs/context/SnackbarContext";
import { getApiErrorMessage } from "../../libs/utils/apiError";
import PageLoader from "../../components/common/PageLoader";

const statusChipColor = (status: TaskStatus) => {
  switch (status) {
    case "DONE":
      return "success";
    case "IN_PROGRESS":
      return "info";
    case "CANCELLED":
      return "default";
    default:
      return "warning";
  }
};

const priorityChipColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "HIGH":
      return "error";
    case "MEDIUM":
      return "warning";
    default:
      return "default";
  }
};

export default function TasksPage() {
  const { showSnackbar } = useSnackbar();
  const { data: staffUsers = [] } = useStaffForAssignment();
  const [activeTab, setActiveTab] = useState(0);
  const [appliedParams, setAppliedParams] = useState<TaskQueryParams>({});
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Task["priority"],
    assigneeId: "",
    dueDate: new Date().toISOString().slice(0, 10),
    tags: "",
  });

  const tabStatuses: (TaskStatus | "ALL")[] = [
    "ALL",
    "TODO",
    "IN_PROGRESS",
    "DONE",
    "CANCELLED",
  ];

  const { data, isLoading, isFetching, isError, error, refetch } =
    useTaskDashboard(appliedParams);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const status = tabStatuses[index];
    setAppliedParams(status === "ALL" ? {} : { status });
  };

  const handleCreate = () => {
    if (!form.title.trim() || !form.assigneeId) {
      showSnackbar("Vui lòng nhập tiêu đề và người thực hiện", "warning");
      return;
    }

    createTask(
      {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority,
        assigneeId: form.assigneeId,
        dueDate: form.dueDate,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
      },
      {
        onSuccess: () => {
          showSnackbar("Tạo công việc thành công", "success");
          setOpenCreate(false);
          setForm({
            title: "",
            description: "",
            priority: "MEDIUM",
            assigneeId: "",
            dueDate: new Date().toISOString().slice(0, 10),
            tags: "",
          });
        },
        onError: (err) => {
          showSnackbar(getApiErrorMessage(err, "Không thể tạo công việc"), "error");
        },
      },
    );
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateStatus(
      { id, status },
      {
        onSuccess: () => showSnackbar("Cập nhật trạng thái thành công", "success"),
        onError: (err) =>
          showSnackbar(getApiErrorMessage(err, "Không thể cập nhật"), "error"),
      },
    );
  };

  if (isLoading) {
    return <PageLoader color="#f44336" />;
  }

  if (isError || !data) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error, "Không thể tải danh sách công việc")}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          sx={{ textTransform: "none" }}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AssignmentIcon sx={{ color: "#f44336", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Công việc
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý nhiệm vụ nội bộ
            </Typography>
          </Box>
          {isFetching && <CircularProgress size={18} sx={{ color: "#f44336" }} />}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isFetching}
            sx={{ textTransform: "none" }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{
              bgcolor: "#f44336",
              textTransform: "none",
              "&:hover": { bgcolor: "#d32f2f" },
            }}
          >
            Tạo công việc
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "Tổng", value: data.summary.total, color: "#607d8b" },
          { label: "Chờ làm", value: data.summary.todo, color: "#ff9800" },
          { label: "Đang làm", value: data.summary.inProgress, color: "#2196f3" },
          { label: "Hoàn thành", value: data.summary.done, color: "#4caf50" },
          { label: "Quá hạn", value: data.summary.overdue, color: "#f44336" },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 6, sm: 4, md: 2 }}>
            <Paper sx={{ p: 2, borderTop: `4px solid ${item.color}`, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, v) => handleTabChange(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .Mui-selected": { color: "#f44336 !important" },
            "& .MuiTabs-indicator": { bgcolor: "#f44336" },
          }}
        >
          <Tab label="Tất cả" sx={{ textTransform: "none" }} />
          <Tab label="Chờ làm" sx={{ textTransform: "none" }} />
          <Tab label="Đang làm" sx={{ textTransform: "none" }} />
          <Tab label="Hoàn thành" sx={{ textTransform: "none" }} />
          <Tab label="Đã hủy" sx={{ textTransform: "none" }} />
        </Tabs>
      </Paper>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Người thực hiện</TableCell>
                <TableCell>Ưu tiên</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hạn</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Chưa có công việc nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{task.title}</Typography>
                      {task.description && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {task.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{task.assigneeName}</TableCell>
                    <TableCell>
                      <Chip
                        label={getTaskPriorityLabel(task.priority)}
                        size="small"
                        color={priorityChipColor(task.priority)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTaskStatusLabel(task.status)}
                        size="small"
                        color={statusChipColor(task.status)}
                      />
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {task.tags?.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{task.createdBy}</TableCell>
                    <TableCell>
                      {task.status === "TODO" && (
                        <Button
                          size="small"
                          sx={{ textTransform: "none" }}
                          onClick={() =>
                            handleStatusChange(task.id, "IN_PROGRESS")
                          }
                        >
                          Bắt đầu
                        </Button>
                      )}
                      {task.status === "IN_PROGRESS" && (
                        <Button
                          size="small"
                          color="success"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleStatusChange(task.id, "DONE")}
                        >
                          Hoàn thành
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>Tạo công việc mới</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Tiêu đề"
            fullWidth
            size="small"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            size="small"
            multiline
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <FormControl fullWidth size="small">
            <InputLabel>Người thực hiện</InputLabel>
            <Select
              label="Người thực hiện"
              value={form.assigneeId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, assigneeId: e.target.value }))
              }
              MenuProps={{ disableScrollLock: true }}
            >
              {staffUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Ưu tiên</InputLabel>
            <Select
              label="Ưu tiên"
              value={form.priority}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  priority: e.target.value as Task["priority"],
                }))
              }
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="HIGH">Cao</MenuItem>
              <MenuItem value="MEDIUM">Trung bình</MenuItem>
              <MenuItem value="LOW">Thấp</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Hạn hoàn thành"
            type="date"
            fullWidth
            size="small"
            value={form.dueDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Tags (phân cách bằng dấu phẩy)"
            fullWidth
            size="small"
            value={form.tags}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tags: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#f44336" }}
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? "Đang tạo..." : "Tạo công việc"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
