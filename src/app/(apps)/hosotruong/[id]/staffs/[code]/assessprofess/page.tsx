"use client";

import { ImportExcelPopup } from "@/components/common";
import PageHeader from "@/components/layout/PageHeader";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
// import useImportExcel from "@/hooks/useImportExcel";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { AccessProcess } from "@/types";
import { Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MRT_PaginationState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import AccessProfessForm from "./AccessProfessForm";

const headers = [];

const AccessProcessPage = (params) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const [globalFilter, setGlobalFilter] = useState("");
  const { confirmDelete, actionForm } = useModal();

  const { data, isLoading, isFetching, isError } = api.accessProfess.getAll.useQuery(params.id as string);

  console.log(data);

  const { mutateAsync: create, isLoading: isCreating } = api.accessProfess.create.useMutation({
    onSuccess: async () => {
      await utils.accessProfess.getAll.invalidate();
      close();
      notifyResult(Action.Create, "đánh giá chuẩn nghề nghiệp", true);
    },
    onError: (e) => {
      notifyResult(Action.Create, "đánh giá chuẩn nghề nghiệp", false, e.message);
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.accessProfess.update.useMutation({
    onSuccess: async () => {
      await utils.accessProfess.getAll.invalidate();
      close();
      notifyResult(Action.Update, "đánh giá chuẩn nghề nghiệp", true);
    },
    onError: (e) => {
      notifyResult(Action.Update, "đánh giá chuẩn nghề nghiệp", false, e.message);
    }
  });

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.accessProfess.delete.useMutation({
    onSuccess: async () => {
      await utils.accessProfess.getAll.invalidate();
      notifyResult(Action.Delete, "đánh giá chuẩn nghề nghiệp", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "đánh giá chuẩn nghề nghiệp", false, e.message);
    }
  });

  const handleDelete = async (row: AccessProcess) => {
    confirmDelete(
      "đánh giá chuẩn nghề nghiệp",
      async () => {
        await deleteOne({ id: row.id });
      },
      row.evaluationcontent
    );
  };

  const columns = useMemo<MRT_ColumnDef<AccessProcess>[]>(
    () => [
      {
        accessorKey: "criteria",
        header: "Tiêu chí"
      },
      {
        accessorKey: "evaluationcontent",
        header: "Nội dung đánh giá"
      },
      {
        accessorKey: "evaluationlevel",
        header: "Mức độ đánh giá"
      },
      {
        accessorKey: "proof",
        header: "Minh chứng"
      }
    ],
    []
  );

  const table = useCustomTable<AccessProcess>({
    columns,
    data: data ?? [],
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
            ? notifyResult(
                Action.Update,
                "đánh giá chuẩn nghề nghiệp",
                false,
                "Có lỗi khi sửa đánh giá chuẩn nghề nghiệp!"
              )
            : actionForm(
                "update-AccessProfess",
                "Đánh giá chuẩn nghề nghiệp",
                AccessProfessForm,
                isUpdating,
                async (values) => {
                  const res = await update(values);
                  if (!res.error) modals.close("update-AccessProcess");
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
            "create-AccessProfess",
            "Đánh giá chuẩn nghề nghiệp",
            AccessProfessForm,
            isCreating,
            async (values) => {
              const res = await create(values);
              if (!res.error) modals.close("create-AccessProcess");
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
      <PageHeader title="Đánh giá chuẩn nghề nghiệp" />

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

export default AccessProcessPage;
