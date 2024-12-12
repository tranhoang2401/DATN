import { useServerTranslation } from "@/i18n/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { idValidator, searchValidator } from "../validators";
import { v4 as uuidv4 } from "uuid";

const dataModel = z.object({
  school_code: z.string(),
  school_name: z.string(),
  school_type: z.string(),
  school_category: z.string(),
  principal_name: z.string(),
  principal_phone: z.string(),
  address: z.string(),
  district: z.string(),
  commune: z.string(),
  phone_number: z.string(),
  email: z.string(),
  website: z.string(),
  region: z.string(),
  international_school: z.boolean(),
  national_standard_level: z.string(),
  quality_assurance: z.string(),
  minimum_quality_level: z.boolean(),
  has_party_committee: z.boolean()
});

export const schoolsRouter = createTRPCRouter({
  get: protectedProcedure.input(searchValidator).query(async ({ ctx, input }) => {
    const { search, pageIndex, pageSize } = input;
    let query = ctx.supabase.from("schools").select("*");
    if (search) {
      query = query.or(
        `school_code.ilike.${search},school_name.ilike.${search},principal_name.ilike.${search},phone_number.ilike.${search}`
      );
    }
    const count = (await query).count;
    const data = (await query.limit(pageSize).range(pageIndex * pageSize, (pageIndex + 1) * pageSize)).data;

    return { count: count, queryData: data };
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("schools").select("*").eq("id", input).single();
    if (error) {
      throw new Error(`Failed to retrieve school with ID ${error.message}`);
    }
    return data; // Returns the specific school by ID
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
      const { error, data: updatedData } = await ctx.supabase.from("schools").update(data).eq("id", id).single();

      if (error) {
        throw new Error(`Failed to update school with ID ${id}: ${error.message}`);
      }

      return { data: updatedData }; // Return the updated school data
    }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const { error } = await ctx.supabase.from("schools").delete().eq("id", input.id);
    return error;
  }),

  create: protectedProcedure
    .input(
      z.object({
        ...dataModel.shape // Đưa các trường từ schoolDataModel vào
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Chèn trường mới vào cơ sở dữ liệu Supabase
      const { error, data } = await ctx.supabase.from("schools").insert(input).single();

      if (error) {
        if (error.code === "23505") {
          // Trường hợp vi phạm khóa duy nhất (trùng tên trường)
          const uniqueErrorMessage = "Đã có lỗi khi thêm trường";
          throw new Error(uniqueErrorMessage);
        }
        throw error; // Ném ra lỗi nếu không phải mã lỗi trùng lặp
      }

      return { data, error }; // Trả về dữ liệu trường học vừa tạo
    })
});
