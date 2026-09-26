import User from "../User.model.js"

export const searchuser = async (QueryData) => {
    const { firstName = '', lastName = '', middleName = '' } = QueryData
    const searhQuery = `
    SELECT*
    FROM blog
    WHERE first_name like ? OR last_name like ? OR middle_name like ?
    `;
    const searhQueryResult = await User.execute(
        searhQuery,
        [`%${firstName}%`, `%${lastName}%`, `%${middleName}%`]
    )
    if (!searhQueryResult[0].length) {
        throw new Error("no users found", {
            cause: {
                statuscode: 404,
            }
        })
    }
    return searhQueryResult
}