import { api } from '../api/axios'

export async function updateColumnTasks(columnId, updatedTasksArray) {
    try {
        const response = await api.patch(`/columns/${columnId}`, { tasks: updatedTasksArray });
        return response.data;
    } catch (error) {
        console.error('Error in tasks.updateColumnTasks:', error);
        throw error;
    }
}