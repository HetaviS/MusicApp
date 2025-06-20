import { History } from "../models/history";
import { IHistory } from "../types";

async function addToHistory(songId: number, userId: number, albumId?: number | null, songTime?: string | null): Promise<IHistory | null> {
    try {
        const historyEntry = await History.create({ song_id: songId, user_id: userId, album_id: albumId, song_time: songTime });
        if (historyEntry) return historyEntry.toJSON() as IHistory;
        return null;
    } catch (err) {
        throw err;
    }
}

async function getUserHistory(userId: number): Promise<IHistory[] | null> {
    try {
        const history = await History.findAll({ where: { user_id: userId }, include: ['song', 'album'], order: [['createdAt', 'DESC']] });
        if (history) return history.map(entry => entry.toJSON() as IHistory);
        return null;
    } catch (err) {
        throw err;
    }
}

async function updateHistoryTime(history_id: number, time: string): Promise<IHistory | null> {
    try {
        const [updatedCount, updatedEntries] = await History.update({ song_time: time }, { where: { history_id }, returning: true });
        if (updatedCount > 0 && updatedEntries.length > 0) {
            return updatedEntries[0].toJSON() as IHistory;
        }
        return null;
    } catch (err) {
        throw err;
    }
}

export default { addToHistory, getUserHistory, updateHistoryTime };