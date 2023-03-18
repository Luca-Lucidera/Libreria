export default interface ServiceResponse<T> {
    isError: boolean,
    data?: T,
    message?: string
}