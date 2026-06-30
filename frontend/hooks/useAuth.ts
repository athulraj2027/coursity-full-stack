import { useCallback } from "react";
import {
  emailSchema,
  loginSchema,
  passwordSchema,
  registerSchema,
} from "@/validations/auth.schema";
import { toast } from "sonner";
import {
  logoutApi,
  resetPasswordApi,
  setNewPasswordApi,
  signinApi,
  SigninResponse,
  signupApi,
  SignupResponse,
} from "@/services/auth.services";
import { useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const signupUser = useCallback(
    async (
      formData: FormData,
    ): Promise<SignupResponse | { success: false }> => {
      const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };
      const result = registerSchema.safeParse(rawData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError: string = Object.values(fieldErrors)[0]?.[0];
        if (firstError) {
          console.log(firstError);
          toast.error(firstError);
          return { success: false };
        }
      }

      const data = result.data;
      console.log("data : ", data);
      if (!data) return { success: false };

      try {
        const res = await signupApi({
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password,
        });
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        console.log("res : ", res);
        toast.success("Account created successfully ");
        return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [queryClient],
  );

  const signinUser = useCallback(
    async (
      formData: FormData,
    ): Promise<SigninResponse | { success: false }> => {
      const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const result = loginSchema.safeParse(rawData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError: string = Object.values(fieldErrors)[0]?.[0];
        if (firstError) {
          console.log(firstError);
          toast.error(firstError);
          return { success: false };
        }
      }
      const data = result.data;
      console.log("data : ", data);
      if (!data) return { success: false };

      try {
        const res = await signinApi({
          email: data.email,
          password: data.password,
        });

        await queryClient.invalidateQueries({ queryKey: ["me"] });

        console.log("res : ", res);
        toast.success("Logged in successfully ");
        return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [queryClient],
  );

  const logoutUser = useCallback(async () => {
    try {
      await logoutApi();
      queryClient.removeQueries({ queryKey: ["me"] });
      console.log("logged out ");
      toast.success("Logged out successfully");
      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Logout failed");
      console.log(err);
      return { success: false };
    }
  }, [queryClient]);

  const createResetLink = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (formData: FormData): Promise<any> => {
      const rawData = { email: formData.get("email") };
      const result = emailSchema.safeParse(rawData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError: string = Object.values(fieldErrors)[0]?.[0];
        if (firstError) {
          console.log(firstError);
          toast.error(firstError);
          return { success: false };
        }
      }
      const data = result.data;
      console.log("data : ", data);
      if (!data) return { success: false };

      try {
        const res = await resetPasswordApi({ email: data.email });
        toast.success("Email has been sent. Please check your email");
        return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [],
  );

  const resetPassword = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (formData: FormData, token: string): Promise<any> => {
      const rawData = {
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };

      const result = passwordSchema.safeParse(rawData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError: string = Object.values(fieldErrors)[0]?.[0];
        if (firstError) {
          console.log(firstError);
          toast.error(firstError);
          return { success: false };
        }
      }
      const data = result.data;
      console.log("data : ", data);
      if (!data) return { success: false };

      try {
        const res = await setNewPasswordApi({ password: data.password, token });
        toast.success("New password has been set. Try logging in now");
        return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [],
  );

  return { signupUser, signinUser, logoutUser, createResetLink, resetPassword };
};
