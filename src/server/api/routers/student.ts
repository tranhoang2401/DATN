import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { idValidator, searchValidator } from "../validators";

const dataModel = z.object({
  name: z.string().optional(),
  school_code: z.string(),
  code: z.string().optional(),
  dob: z.coerce.date().nullish(), // Date in ISO format
  gender: z.string().optional(),
  employmentStatus: z.string().optional(),
  idcard: z.string().optional(),
  pid: z.string().optional(),
  email: z.string().optional(),
  phonenumber: z.string().optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  address: z.string().optional(),
  hometown: z.string().optional()
});

const toEntity = (input) => ({
  ...input,
  dob: input.dob ? new Date(input.dob).getTime() : undefined
});

export const studentsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("students").select("*").eq("school_code", input);

    if (error) {
      throw new Error(`Failed to retrieve students for school_code: ${error.message}`);
    }

    return data;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("students").select("*").eq("code", input).single();

    if (error) {
      throw new Error(`Failed to retrieve staff with ID: ${error.message}`);
    }

    return data;
  }),

  create: protectedProcedure
    .input(
      z.object({
        ...dataModel.shape
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error, data } = await ctx.supabase.from("students").insert(toEntity(input)).single();

      if (error) {
        if (error.code === "23505") {
          // Trường hợp vi phạm khóa duy nhất (trùng tên trường)
          const uniqueErrorMessage = "Đã có lỗi khi thêm thông tin giáo viên";
          throw new Error(uniqueErrorMessage);
        }
        throw error; // Ném ra lỗi nếu không phải mã lỗi trùng lặp
      }

      return { data, error }; // Trả về dữ liệu trường học vừa tạo
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(), // ID của trường học cần cập nhật
        data: z.object({ ...dataModel.shape }).partial() // Dữ liệu trường học cần cập nhật
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error, data } = await ctx.supabase
        .from("students")
        .update(toEntity(input.data))
        .eq("id", input.id)
        .single();
      if (error) {
        throw new Error(`Failed to update school with ID ${input.id}: ${error.message}`);
      }
      return { data, error }; // Trả về trường học sau khi cập nhật
    }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("students").delete().eq("id", input.id).select().single();

    if (error) {
      throw new Error(`Failed to delete staff with ID ${input.id}: ${error.message}`);
    }

    return data;
  })
});
