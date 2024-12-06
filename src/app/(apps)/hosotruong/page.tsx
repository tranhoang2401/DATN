"use client";

import { ImportExcelPopup } from "@/components/common";
import PageHeader from "@/components/layout/PageHeader";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
// import useImportExcel from "@/hooks/useImportExcel";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { Schools } from "@/types";
import { Anchor, Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MRT_PaginationState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useMemo, useState } from "react";
import SchoolsForm from "./SchoolForm";
import Link from "next/link";

const headers = [];

const SchoolPage = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const [globalFilter, setGlobalFilter] = useState("");
  // const router = useRouter();
  const { confirmDelete, actionForm } = useModal();

  const { data, isLoading, isFetching, isError } = api.schools.get.useQuery({
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const { mutateAsync: create, isLoading: isCreating } = api.schools.create.useMutation({
    onSuccess: async () => {
      await utils.schools.get.invalidate();
      close();
      notifyResult(Action.Create, "trường học", true);
    },
    onError: (e) => {
      notifyResult(Action.Create, "trường học", false, e.message);
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.schools.update.useMutation({
    onSuccess: async () => {
      await utils.schools.get.invalidate();
      close();
      notifyResult(Action.Update, "trường học", true);
    },
    onError: (e) => {
      notifyResult(Action.Update, "trường học", false, e.message);
    }
  });

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.schools.delete.useMutation({
    onSuccess: async () => {
      await utils.schools.get.invalidate();
      notifyResult(Action.Delete, "trường học", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "trường học", false, e.message);
    }
  });

  const handleDelete = async (row: Schools) => {
    confirmDelete(
      "trường học",
      async () => {
        await deleteOne({ id: row.id });
      },
      row.school_name
    );
  };

  const columns = useMemo<MRT_ColumnDef<Schools>[]>(
    () => [
      {
        accessorKey: "school_code",
        header: "Mã định danh"
      },
      {
        accessorKey: "school_name",
        header: "Tên trường",
        Cell: ({ row }) => (
          <Anchor component={Link} href={`hosotruong/${row.original.id}`} fw={500}>
            {row.original.school_name}
          </Anchor>
        )
      },
      {
        accessorKey: "principal_name",
        header: "Tên hiệu trưởng"
      },
      {
        accessorKey: "phone_number",
        header: "Hotline trường"
      },
      {
        accessorKey: "email",
        header: "Email"
      }
    ],
    []
  );

  const table = useCustomTable<Schools>({
    columns,
    data: data?.queryData ?? [],
    rowCount: data?.count || 0,
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
          actionForm(
            "update-schools",
            "schools",
            SchoolsForm,
            isUpdating,
            async (values) => {
              const res = await update(values);
              if (!res.error) modals.close("update-schools");
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
            "create-schools",
            "trường học",
            SchoolsForm,
            isCreating,
            async (values) => {
              const res = await create(values);
              if (!res.error) modals.close("create-schools");
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
      <PageHeader title="Danh sách trường" />

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
