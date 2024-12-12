import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { idValidator } from "../validators";

const dataModel = z.object({
  criteria: z.string().optional(),
  evaluationcontent: z.string().optional(),
  evaluationlevel: z.string().optional(),
  proof: z.string().optional()
});

export const assessProfessRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("assessprofessionalstandards").select("*").eq("code", input);
    if (error) {
      throw error;
    }
    return data ? data : [];
  }),

  getById: protectedProcedure.input(idValidator).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from("assessprofessionalstandards")
      .select("*")
      .eq("id", input.id)
      .single();
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
      const { error, data } = await ctx.supabase.from("assessprofessionalstandards").insert(input).single();

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
        .from("assessprofessionalstandards")
        .update(data)
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to update school with ID ${id}: ${error.message}`);
      }

      return { data: updatedData }; // Return the updated school data
    }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("assessprofessionalstandards").delete().eq("id", input.id);
    if (error) {
      throw error;
    } else return data;
  })
});
