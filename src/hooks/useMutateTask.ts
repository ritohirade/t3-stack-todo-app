import useStore from "../store";
import { trpc } from "../utils/trpc";

export const useMutateTask = () => {
    // 更新などをする際に、React Queryによってフロントエンドに、キャッシュされているデータに更新する必要があるため、ここでアクセスできるようにする
    const utils = trpc.useContext()
    // ZustandのStoreで作成したStateをリセットする
    const reset = useStore((state) => state.resetEditedTask)

    // サーバーサイドで定義した関数をクライアントからRemote Procedure Callで呼び出す
    const createTaskMutation = trpc.todo.createTask.useMutation({
        onSuccess: (res) => {
            // タスク一覧の既存のキャッシュを取得
            const previousTodos = utils.todo.getTasks.getData()
            if (previousTodos) {
                // キャッシュを更新
                utils.todo.getTasks.setData([res, ...previousTodos])
            }
            // zustandのStoreの中のEditedTaskのStateをリセットする
            reset();
        }
    })
    const updateTaskMutation = trpc.todo.updateTask.useMutation({
        onSuccess: (res) => {
            const previousTodos = utils.todo.getTasks.getData()
            if (previousTodos) {
                utils.todo.getTasks.setData(
                    previousTodos.map((task) => (task.id === res.id ? res : task))
                )
            }
            reset()
        }
    })
    const deleteTaskMutation = trpc.todo.deleteTask.useMutation({
        // 第一引数は返り値、第二引数はdeleteTaskに渡されたinputの値（削除したいタスクのid）
        onSuccess: (_, variables) => {
            const previousTodos = utils.todo.getTasks.getData()
            if (previousTodos) {
                utils.todo.getTasks.setData(
                    previousTodos.filter((task) => task.id !== variables.taskId)
                )
            }
            reset()
        }
    })
    return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
