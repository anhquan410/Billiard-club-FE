import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render: (row: T, index: number) => ReactNode;
};

type ReportDataTableProps<T> = {
  title: string;
  columns: Column<T>[];
  rows: T[];
};

export default function ReportDataTable<T>({
  title,
  columns,
  rows,
}: ReportDataTableProps<T>) {
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Typography variant="h6" fontWeight={600} sx={{ p: 2, pb: 1 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align || "left"}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align || "left"}>
                    {col.render(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
