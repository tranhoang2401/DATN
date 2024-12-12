"use client";

import { ImportExcelPopup } from "@/components/common";
import PageHeader from "@/components/layout/PageHeader";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
// import useImportExcel from "@/hooks/useImportExcel";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { AdvancedTrain } from "@/types";
import { Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MRT_PaginationState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import AdvancedTrainingForm from "./AdvancedTrainingForm";

const headers = [];

const AdvancedTrainingPage = (params) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const [globalFilter, setGlobalFilter] = useState("");
  const { confirmDelete, actionForm } = useModal();

  const { data, isLoading, isFetching, isError } = api.advancedTraining.getAll.useQuery(params.id as string);

  console.log(data);

  const { mutateAsync: create, isLoading: isCreating } = api.advancedTraining.create.useMutation({
    onSuccess: async () => {
      await utils.advancedTraining.getAll.invalidate();
      close();
      notifyResult(Action.Create, "quá trình bồi dưỡng nâng cao", true);
    },
    onError: (e) => {
      notifyResult(Action.Create, "quá trình bồi dưỡng nâng cao", false, e.message);
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.advancedTraining.update.useMutation({
    onSuccess: async () => {
      await utils.advancedTraining.getAll.invalidate();
      close();
      notifyResult(Action.Update, "quá trình bồi dưỡng nâng cao", true);
    },
    onError: (e) => {
      notifyResult(Action.Update, "quá trình bồi dưỡng nâng cao", false, e.message);
    }
  });

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.advancedTraining.delete.useMutation({
    onSuccess: async () => {
      await utils.advancedTraining.getAll.invalidate();
      notifyResult(Action.Delete, "quá trình bồi dưỡng nâng cao", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "quá trình bồi dưỡng nâng cao", false, e.message);
    }
  });

  const handleDelete = async (row: AdvancedTrain) => {
    confirmDelete(
      "quá trình bồi dưỡng nâng cao",
      async () => {
        await deleteOne({ id: row.id });
      },
      row.name
    );
  };

  const columns = useMemo<MRT_ColumnDef<AdvancedTrain>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Khóa đào tạo, bồi dưỡng"
      },
      {
        accessorKey: "trainingform",
        header: "Loại hình bồi dưỡng"
      },
      {
        accessorKey: "project",
        header: "Đơn vị bồi dưỡng"
      },
      {
        accessorKey: "description",
        header: "Kết quả đạt được"
      }
    ],
    []
  );

  const table = useCustomTable<AdvancedTrain>({
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
                "quá trình bồi dưỡng nâng cao",
                false,
                "Có lỗi khi sửa quá trình bồi dưỡng nâng cao!"
              )
            : actionForm(
                "update-advancedTraining",
                "Quá trình bồi dưỡng nâng cao NLNN, NLSP",
                AdvancedTrainingForm,
                isUpdating,
                async (values) => {
                  const res = await update(values);
                  if (!res) modals.close("update-AdvancedTraining");
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
            "create-advancedTraining",
            "Quá trình bồi dưỡng nâng cao NLNN, NLSP",
            AdvancedTrainingForm,
            isCreating,
            async (values) => {
              const res = await create(values);
              if (!res.error) modals.close("create-AdvancedTraining");
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
      <PageHeader title="Quá trình bồi dưỡng nâng cao NLNN, NLSP" />

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

export default AdvancedTrainingPage;
