import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { idValidator, searchValidator } from "../validators";

const dataModel = z.object({
  fullname: z.string().optional(),
  school_code: z.string(),
  code: z.string().optional(),
  dob: z.coerce.date().nullish(), // Date in ISO format
  gradelevel: z.number(),
  studentstatus: z.string().optional(),
  class: z.string().optional(),
  ethnicity: z.string().optional(),
  nationality: z.string().optional(),
  permanentresidenceaddress: z.string().optional(),
  gender: z.string().optional()
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
    const { data, error } = await ctx.supabase.from("students").select("*").eq("id", input).single();

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
      z
        .object({
          id: z.string()
        })
        .extend(dataModel.shape)
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const { error, data: updatedData } = await ctx.supabase
        .from("students")
        .update(toEntity(data))
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to update school with ID ${id}: ${error.message}`);
      }

      return { data: updatedData }; // Return the updated school data
    }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("students").delete().eq("id", input.id).select().single();

    if (error) {
      throw new Error(`Failed to delete staff with ID ${input.id}: ${error.message}`);
    }

    return data;
  })
});
