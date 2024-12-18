"use client";

import { ImportExcelPopup } from "@/components/common";
import PageHeader from "@/components/layout/PageHeader";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
// import useImportExcel from "@/hooks/useImportExcel";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { Discipline } from "@/types";
import { Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MRT_PaginationState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useMemo, useState } from "react";
import DisciplineForm from "./DisciplineForm";

const headers = [];

const DisciplinePage = (params) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const [globalFilter, setGlobalFilter] = useState("");
  const { confirmDelete, actionForm } = useModal();

  const { data: staffData } = api.staffs.getById.useQuery(params.code);

  const { data, isLoading, isFetching, isError } = api.discipline.getAll.useQuery(staffData?.id as string);

  const { mutateAsync: create, isLoading: isCreating } = api.discipline.create.useMutation({
    onSuccess: async () => {
      await utils.discipline.getAll.invalidate();
      close();
      notifyResult(Action.Create, "kỉ luật", true);
    },
    onError: (e) => {
      notifyResult(Action.Create, "kỉ luật", false, e.message);
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.discipline.update.useMutation({
    onSuccess: async () => {
      await utils.discipline.getAll.invalidate();
      close();
      notifyResult(Action.Update, "kỉ luật", true);
    },
    onError: (e) => {
      notifyResult(Action.Update, "kỉ luật", false, e.message);
    }
  });

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.discipline.delete.useMutation({
    onSuccess: async () => {
      await utils.discipline.getAll.invalidate();
      notifyResult(Action.Delete, "kỉ luật", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "kỉ luật", false, e.message);
    }
  });

  const handleDelete = async (row: Discipline) => {
    confirmDelete(
      "kỉ luật",
      async () => {
        await deleteOne({ id: row.id });
      },
      row.disciplinetype
    );
  };

  const columns = useMemo<MRT_ColumnDef<Discipline>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Mã định danh"
      },
      {
        accessorKey: "disciplinetype",
        header: "Loại kỉ luật"
      },
      {
        accessorKey: "disciplinereason",
        header: "Lí do kỉ luật"
      },
      {
        accessorKey: "decisioncode",
        header: "Số quyết định"
      }
    ],
    []
  );

  const table = useCustomTable<Discipline>({
    columns,
    data: [],
    // rowCount: data?.count || 0,
    state: {
      isLoading,
      isSaving: isCreating || isUpdating,
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
        onUpdate={() =>
          data
            ? notifyResult(Action.Update, "kỉ luật", false, "Có lỗi khi sửa kỉ luật!")
            : actionForm(
                "update-discipline",
                "discipline",
                DisciplineForm,
                isUpdating,
                async (values) => {
                  const res = await update(values);
                  if (!res) modals.close("update-discipline");
                },
                row.original,
                "lg"
              )
        }
        onDelete={() => handleDelete(row.original)}
      />
    ),
    renderTopToolbar: () => (
      <TableToolbar
        table={table}
        onCreate={() =>
          actionForm(
            "create-discipline",
            "kỉ luật",
            DisciplineForm,
            isCreating,
            async (values) => {
              const res = await create(values);
              if (!res.error) modals.close("create-discipline");
            },
            undefined,
            "lg"
          )
        }
        // onImport={() => setShowImportPopup(true)}
        // onDeleteAll={data?.data?.length! > 0 ? handleDeleteAll : undefined}
      />
    )
  });

  return (
    <Stack>
      <PageHeader title="Danh sách kỉ luật" />

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

export default DisciplinePage;
