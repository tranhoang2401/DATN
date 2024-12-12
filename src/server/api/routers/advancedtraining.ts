import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { idValidator } from "../validators";

const dataModel = z.object({
  code: z.string(),
  date: z.coerce.date().nullish(),
  name: z.string(),
  trainingform: z.string(),
  project: z.string(),
  description: z.string()
});

const toEntity = (input) => ({
  ...input,
  date: input.date ? new Date(input.date).getTime() : undefined
});

export const advancedtrainingRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("advancedtraining").select("*").eq("code", input);
    if (error) {
      throw error;
    }
    return data ? data : [];
  }),

  getById: protectedProcedure.input(idValidator).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("advancedtraining").select("*").eq("id", input.id).single();
    if (error) {
      throw error;
    } else return data;
  }),

  create: protectedProcedure
    .input(
      z.object({
        ...dataModel.shape // Đưa các trường từ schoolDataModel vào
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Chèn trường mới vào cơ sở dữ liệu Supabase
      const { error, data } = await ctx.supabase.from("advancedtraining").insert(toEntity(input)).single();

      if (error) {
        if (error.code === "23505") {
          // Trường hợp vi phạm khóa duy nhất (trùng tên trường)
          const uniqueErrorMessage = "Đã có lỗi khi thêm trường";
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
        .from("advancedtraining")
        .update(toEntity(data))
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to update school with ID ${id}: ${error.message}`);
      }

      return { data: updatedData }; // Return the updated school data
    }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("advancedtraining").delete().eq("id", input.id);
    if (error) {
      throw error;
    } else return data;
  })
});
