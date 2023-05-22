import {
    createTaskSchema,
    getSingleTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
} from "../../../schema/todo";
import { t, authedProcedure } from "../trpc"

export const todoRouter = t.router({
    // 認証を実行して、タスクを追加する
    createTask: authedProcedure
        .input(createTaskSchema)
        .mutation(async ({ ctx, input }) => {
            const task = await ctx.prisma.task.create({
                data: {
                    ...input,
                    user: {
                        connect: {
                            id: ctx.session?.user?.id
                        }
                    }
                }
            })
            return task
        }),
    // 認証を実行せず、タスク一覧を取得する
    getTasks: t.procedure.query(({ ctx }) => {
        return ctx.prisma.task.findMany({
            where: {
                userId: ctx.session?.user?.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }),
    // 認証を実行して、特定のタスクを取得する
    getSingleTask: authedProcedure
        .input(getSingleTaskSchema)
        .query(({ ctx, input }) => {
            return ctx.prisma.task.findUnique({
                where: {
                    id: input.taskId,
                }
            })
        }),
    // 認証を実行して、タスクを更新する
    updateTask: authedProcedure
        .input(updateTaskSchema)
        .mutation(async ({ ctx, input }) => {
            const task = await ctx.prisma.task.update({
                where: {
                    id: input.taskId,
                },
                data: {
                    title: input.title,
                    body: input.body,
                },
            });
            return task;
        }),
    // 認証を実行して、タスクを削除する
    deleteTask: authedProcedure
        .input(deleteTaskSchema)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.task.delete({
                where: {
                    id: input.taskId,
                },
            });
        }),
})
