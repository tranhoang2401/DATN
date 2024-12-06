import { pingRouter } from "@/server/api/routers/ping";
import { createTRPCRouter } from "@/server/api/trpc";
import { schoolsRouter } from "./routers/school";
import { staffsRouter } from "./routers/staffs";
import { disciplineRouter } from "./routers/discipline";
import { assessProfessRouter } from "./routers/assessprofessionalstandards";
import { advancedtrainingRouter } from "./routers/advancedtraining";
import { studentsRouter } from "./routers/student";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ping: pingRouter,
  schools: schoolsRouter,
  staffs: staffsRouter,
  discipline: disciplineRouter,
  accessProfess: assessProfessRouter,
  advancedTraining: advancedtrainingRouter,
  student: studentsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
