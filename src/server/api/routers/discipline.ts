import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { idValidator } from "../validators";

const dataModel = z.object({
  code: z.string(),
  disciplinetype: z.string(),
  disciplinereason: z.string(),
  decisioncode: z.string(),
  decisiondate: z.coerce.date().nullish()
});

const toEntity = (input) => ({
  ...input,
  decisiondate: input.decisiondate ? new Date(input.decisiondate).getTime() : undefined
});

export const disciplineRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("discipline").select("*").eq("code", input);
    if (error) {
      throw error;
    }
    return data ? data : [];
  }),

  getById: protectedProcedure.input(idValidator).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("discipline").select("*").eq("id", input.id).single();
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
      const { error, data } = await ctx.supabase.from("discipline").insert(toEntity(input)).single();

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
      z.object({
        id: z.string().uuid(), // ID của trường học cần cập nhật
        data: z.object({ ...dataModel.shape }).partial() // Dữ liệu trường học cần cập nhật
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error, data } = await ctx.supabase.from("discipline").update(toEntity(input.data)).eq("id", input.id).single();
      if (error) {
        throw new Error(`Failed to update school with ID ${input.id}: ${error.message}`);
      }
      return { data, error }; // Trả về trường học sau khi cập nhật
    }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("discipline").delete().eq("id", input.id);
    if (error) {
      throw error;
    } else return data;
  })
});
