import { api } from '../api/axios';

export async function getColumns() {
    try {
        const response = await api.get('/columns')
        return response.data

    } catch (error) {
        console.error('Error in columns.getColumns:', error);
        throw error
    }
}

export async function postColumn(newColumnData) {
    try {
        const response = await api.post('/columns', newColumnData)
        return response.data
    } catch (error) {
        console.log('Error in columns.postColumn:', error)
        throw error
    }
}

export async function deleteColumn(columnId) {
    try {
        const response = await api.delete(`/columns/${columnId}`)
        return response.data
    } catch (error) {
        console.log('Error in columns.deleteColumn:', error)
        throw error
    }
}