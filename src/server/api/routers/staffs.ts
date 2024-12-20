import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { idValidator, searchValidator } from "../validators";

const dataModel = z.object({
  name: z.string().optional(),
  school_code: z.string(),
  code: z.string().optional(),
  dob: z.coerce.date().nullish(), // Date in ISO format
  gender: z.string().optional(),
  employmentstatus: z.string().optional(),
  idcard: z.string().optional(),
  pid: z.string().optional(),
  email: z.string().optional(),
  phonenumber: z.string().optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  socialinsurancenumber: z.string().optional(),
  address: z.string().optional(),
  hometown: z.string().optional()
});

const toEntity = (input) => ({
  ...input,
  dob: input.dob ? new Date(input.dob).getTime() : undefined
});

export const staffsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("staffs").select("*").eq("school_code", input);

    if (error) {
      throw new Error(`Failed to retrieve staffs for school_code: ${error.message}`);
    }

    return data;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("staffs").select("*").eq("id", input).single();

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
      const { error, data } = await ctx.supabase.from("staffs").insert(toEntity(input)).single();

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
        .from("staffs")
        .update(toEntity(data))
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to update school with ID ${id}: ${error.message}`);
      }

      return { data: updatedData }; // Return the updated school data
    }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("staffs").delete().eq("id", input.id).select().single();

    if (error) {
      throw new Error(`Failed to delete staff with ID ${input.id}: ${error.message}`);
    }

    return data;
  }),

  updateSchoolCode: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(), // ID của bản ghi cần cập nhật
        school_code: z.string() // Mã trường mới
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, school_code } = input;

      try {
        // Cập nhật trường `school_code`
        const { error, data: updatedData } = await ctx.supabase
          .from("staffs") // Tên bảng
          .update({ school_code }) // Chỉ cập nhật `school_code`
          .eq("id", id) // Điều kiện theo ID
          .single();
        if (error) {
          throw new Error(`Failed to update school code for ID ${id}: ${error.message}`);
        }
        return { data: updatedData }; // Trả về dữ liệu sau khi cập nhật
      } catch (err) {
        throw new Error(`Unexpected error`);
      }
    })
});
