"use client";

import { ImportExcelPopup } from "@/components/common";
import PageHeader from "@/components/layout/PageHeader";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
// import useImportExcel from "@/hooks/useImportExcel";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { Staff } from "@/types";
import { Paper, Stack } from "@mantine/core";
import { MRT_PaginationState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const headers = [];

const SchoolPage = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const router = useRouter();
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const [globalFilter, setGlobalFilter] = useState("");
  const { confirmDelete } = useModal();
  const params = useParams();

  const { data: schoolData } = api.schools.getById.useQuery(params.id as string);

  const { data, isLoading, isFetching, isError } = api.staffs.get.useQuery(schoolData?.school_code as string);
  console.log(data);

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.staffs.delete.useMutation({
    onSuccess: async () => {
      await utils.staffs.get.invalidate();
      notifyResult(Action.Delete, "giáo viên", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "giáo viên", false, e.message);
    }
  });

  const handleDelete = async (row: Staff) => {
    confirmDelete(
      "giáo viên",
      async () => {
        await deleteOne({ id: row.id });
      },
      row.name
    );
  };

  const columns = useMemo<MRT_ColumnDef<Staff>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Mã định danh"
      },
      {
        accessorKey: "name",
        header: "Tên giáo viên"
      },
      {
        accessorKey: "gender",
        header: "Giới tính"
      },
      {
        accessorKey: "employmentstatus",
        header: "Trạng thái hoạt động"
      },
      {
        accessorKey: "phonenumber",
        header: "Số diện thoại"
      }
    ],
    []
  );

  const table = useCustomTable<Staff>({
    columns,
    data: data ?? [],
    // rowCount: data?.count || 0,
    state: {
      isLoading,
      globalFilter,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      columnPinning: {
        right: ["mrt-row-actions"]
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    renderRowActions: ({ row }) => (
      <TableRowActions
        onUpdate={() => router.push(`/hosotruong/${schoolData?.id}/staffs/${row.id}`)}
        onDelete={() => handleDelete(row.original)}
      />
    ),
    renderTopToolbar: () => (
      <TableToolbar table={table} onCreate={() => router.push(`/hosotruong/${schoolData?.id}/staffs/create`)} />
    )
  });

  return (
    <Stack>
      <PageHeader title="Danh sách giáo viên" />

      <Paper>
        <MantineReactTable table={table} />
      </Paper>

      {/* <ImportExcelPopup
        importMethod={importMethod}
        opened={showImportPopup}
        setShowImportPopup={setShowImportPopup}
        headerCols={headers}
        resetRef={resetRef}
        handleFileChange={handleFileChange}
        setDataUpload={setDataUpload}
        dataUpload={dataUpload}
        setImportMethod={setImportMethod}
      /> */}
    </Stack>
  );
};

export default SchoolPage;
