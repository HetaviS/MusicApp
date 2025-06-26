export default function removeExtraFields(data: any, remove_fields: string[]) {
    for (const field of remove_fields) {
        delete data[field];
    }
    return data;
}