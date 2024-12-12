import { Database } from "./supabase";

export * from "./base";

export type Schools = Database["public"]["Tables"]["schools"]["Row"];
export type Discipline = Database["public"]["Tables"]["discipline"]["Row"];
export type Staff = Database["public"]["Tables"]["staffs"]["Row"];
export type AccessProcess = Database["public"]["Tables"]["assessprofessionalstandards"]["Row"];
export type AdvancedTrain = Database["public"]["Tables"]["advancedtraining"]["Row"];
export type Student = Database["public"]["Tables"]["students"]["Row"];
export type Facility = Database["public"]["Tables"]["facilities"]["Row"];
