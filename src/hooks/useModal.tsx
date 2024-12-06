"use client";
import { useTranslation } from "@/i18n";
import { TRPCReactProvider } from "@/trpc/react";
import { Alert, MantineSize } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconExclamationCircle } from "@tabler/icons-react";
import { cookies } from "next/headers";
export enum DeleteAction {
  Delete = "delete",
  DeleteAll = "deleteAll",
  Revoke = "revoke",
  Leave = "leave"
}

const useModal = () => {
  const { t } = useTranslation("common");

  const confirmDelete = (
    object: string,
    onConfirm: () => void,
    name?: string | null,
    action: DeleteAction = DeleteAction.Delete,
    extraMessage?: string,
    onCancel?: () => void
  ) => {
    const actionText = t(`deleteAction.${action}`);
    modals.openConfirmModal({
      title: t("confirmDelete.title", { action: actionText }),
      centered: true,
      children: (
        <Alert variant="light" color="red" title={t("confirmDelete.contentTitle")} icon={<IconExclamationCircle />}>
          {t("confirmDelete.content", {
            action: actionText.toLowerCase(),
            object: object.toLowerCase(),
            name: name ? " " + name : ""
          })}
          {extraMessage && (
            <>
              <br />
              {extraMessage}
            </>
          )}
        </Alert>
      ),
      labels: { confirm: `${actionText} ${object}`, cancel: t("cancel") },
      confirmProps: { color: "red" },
      onConfirm,
      onCancel
    });
  };

  const actionForm = (
    modalId: string,
    name: string,
    Form: React.ComponentType<any>,
    isSubmitting: boolean,
    onSubmit: (values) => void,
    data?: any,
    size?: MantineSize | (string & {}) | number,
    orgType?: string[],
    disableType?: boolean,
    form?: any,
    path?: string,
    parentData?: any
  ) => {
    modals.open({
      modalId,
      title: !data ? t("addNewTitle", { object: name }) : t("editTitle", { object: name }),
      centered: true,
      closeOnClickOutside: false,
      size,
      children: (
        <Form
          data={data}
          orgType={orgType}
          disableType={disableType}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onClose={() => modals.close(modalId)}
          form={form}
          path={path}
          parentData={parentData}
        />
      )
    });
  };

  return {
    confirmDelete,
    actionForm
  };
};

export default useModal;
