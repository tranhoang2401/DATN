"use client";

import { ImportExcelPopup } from "@/components/common";
import PageHeader from "@/components/layout/PageHeader";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
// import useImportExcel from "@/hooks/useImportExcel";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { Facility } from "@/types";
import { Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MRT_PaginationState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import FacilitiesForm from "./FacilitiesForm";

const headers = [];

const FacilitiesPage = (params) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const [globalFilter, setGlobalFilter] = useState("");
  const { confirmDelete, actionForm } = useModal();

  const { data: schoolData } = api.schools.getById.useQuery(params.id as string);

  const { data, isLoading, isFetching, isError } = api.facilities.get.useQuery(schoolData?.school_code as string);

  console.log(data);

  const { mutateAsync: create, isLoading: isCreating } = api.facilities.create.useMutation({
    onSuccess: async () => {
      await utils.facilities.get.invalidate();
      close();
      notifyResult(Action.Create, "cơ sở vật chất", true);
    },
    onError: (e) => {
      notifyResult(Action.Create, "cơ sở vật chất", false, e.message);
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.facilities.update.useMutation({
    onSuccess: async () => {
      await utils.facilities.get.invalidate();
      close();
      notifyResult(Action.Update, "cơ sở vật chất", true);
    },
    onError: (e) => {
      notifyResult(Action.Update, "cơ sở vật chất", false, e.message);
    }
  });

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.facilities.delete.useMutation({
    onSuccess: async () => {
      await utils.facilities.get.invalidate();
      notifyResult(Action.Delete, "cơ sở vật chất", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "cơ sở vật chất", false, e.message);
    }
  });

  const handleDelete = async (row: Facility) => {
    confirmDelete(
      "cơ sở vật chất",
      async () => {
        await deleteOne({ id: row.id });
      },
      row.semester
    );
  };

  const columns = useMemo<MRT_ColumnDef<Facility>[]>(
    () => [
      {
        accessorKey: "semester",
        header: "Kì học"
      },
      {
        accessorKey: "classnumber",
        header: "Số lớp học"
      },
      {
        accessorKey: "roomnumber",
        header: "Số phòng học"
      },
      {
        accessorKey: "numberstaffrooms",
        header: "Số phòng giáo viên"
      },
      {
        accessorKey: "tablenumber",
        header: "Số lượng bàn ghế"
      }
    ],
    []
  );

  const table = useCustomTable<Facility>({
    columns,
    data: [],
    // rowCount: data?.count || 0,
    state: {
      isLoading,
      isSaving: isCreating || isUpdating || isDeleting,
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
            ? notifyResult(Action.Update, "cơ sở vật chất", false, "Có lỗi khi sửa cơ sở vật chất!")
            : actionForm(
                "update-Facilities",
                "cơ sở vật chất",
                FacilitiesForm,
                isUpdating,
                async (values) => {
                  const res = await update(values);
                  if (!res) modals.close("update-Facilities");
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
            "create-Facilities",
            "Cơ sở vật chất",
            FacilitiesForm,
            isCreating,
            async (values) => {
              const res = await create(values);
              if (!res) modals.close("create-Facilities");
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
      <PageHeader title="Quản lí cơ sở vật chất của các kì" />

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

export default FacilitiesPage;
