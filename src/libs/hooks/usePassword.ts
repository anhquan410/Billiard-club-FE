import { useMutation } from "@tanstack/react-query";
import { changePassword as changePasswordApi } from "../api/password";
import type { PasswordChangeRequest } from "../types";

export const usePassword = () => {
  const { mutate: changeUserPassword, isPending: isChangingPassword } =
    useMutation({
      mutationFn: ({
        id,
        passwordChangeRequest,
      }: {
        id: string;
        passwordChangeRequest: PasswordChangeRequest;
      }) => changePasswordApi(id, passwordChangeRequest),
    });

  return {
    changeUserPassword,
    isChangingPassword,
  };
};
