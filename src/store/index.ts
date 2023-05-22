import create from 'zustand'
import { UpdateTaskInput } from '../schema/todo'

type State = {
    editedTask: UpdateTaskInput
    updateEditedTask: (payload: UpdateTaskInput) => void
    resetEditedTask: () => void
}

const useStore = create<State>((set) => ({
    // 初期値のセット
    editedTask: { taskId: '', title: '', body: '' },
    // 引数で受け取ったpayloadを、editedTaskにセット
    updateEditedTask: (payload) =>
        set({
            editedTask: payload,
        }),
    // editedTaskを初期化
    resetEditedTask: () =>
        set({ editedTask: { taskId: '', title: '', body: '' } })
}))
export default useStore
