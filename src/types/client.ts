export default interface Client {
    id: String,
    username: String,
    email: String,
    points: Record<string, number>
}