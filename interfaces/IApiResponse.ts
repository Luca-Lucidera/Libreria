export default interface IApiResponse<T> {
    statusCode: 200 | 302 | 400 | 404 | 405 |440 | 500
    data?: T,
    message?: string
}