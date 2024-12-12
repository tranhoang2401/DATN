import { useServerTranslation } from "@/i18n/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { idValidator, searchValidator } from "../validators";
import { v4 as uuidv4 } from "uuid";

const dataModel = z.object({
  school_code: z.string(),
  classnumber: z.string(), // Số lớp học là số nguyên không âm
  roomnumber: z.string(), // Số phòng là số nguyên không âm
  numberstaffrooms: z.string(), // Số phòng giáo viên là số nguyên không âm
  tablenumber: z.string(), // Số bàn là số nguyên không âm
  projector: z.string(), // Máy chiếu chuyển từ boolean sang int4 (0 hoặc 1)
  functionroom: z.string(), // Phòng chức năng chuyển từ boolean sang int4 (0 hoặc 1)
  semester: z.string()
});

const toEntity = (input) => ({
  ...input,
  classnumber: Number(input.classnumber), // Số lớp học là số nguyên không âm
  roomnumber: Number(input.roomnumber), // Số phòng là số nguyên không âm
  numberstaffrooms: Number(input.numberstaffrooms), // Số phòng giáo viên là số nguyên không âm
  tablenumber: Number(input.tablenumber), // Số bàn là số nguyên không âm
  projector: Number(input.projector), // Máy chiếu chuyển từ boolean sang int4 (0 hoặc 1)
  functionroom: Number(input.functionroom) // Phòng chức năng chuyển từ boolean sang int4 (0 hoặc 1)
});

export const facilitiesRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("staffs").select("*").eq("school_code", input);

    if (error) {
      throw new Error(`Failed to retrieve staffs for school_code: ${error.message}`);
    }

    return data;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("facilities").select("*").eq("id", input).single();
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
      const { error, data: updatedData } = await ctx.supabase
        .from("facilities")
        .update(toEntity(data))
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to update school with ID ${id}: ${error.message}`);
      }

      return { data: updatedData }; // Return the updated school data
    }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const { error } = await ctx.supabase.from("facilities").delete().eq("id", input.id);
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
      const { error, data } = await ctx.supabase.from("facilities").insert(toEntity(input)).single();

      if (error) {
        if (error.code === "23505") {
          // Trường hợp vi phạm khóa duy nhất (trùng tên trường)
          const uniqueErrorMessage = "Đã có lỗi khi thêm cơ sở vật chất";
          throw new Error(uniqueErrorMessage);
        }
        throw error; // Ném ra lỗi nếu không phải mã lỗi trùng lặp
      }

      return { data, error }; // Trả về dữ liệu trường học vừa tạo
    })
});
