import { Storage, Storable, StorableConstructor, StorageListOptions, StorageQuery } from "@padloc/core/src/storage";
import { Err, ErrorCode } from "@padloc/core/src/error";
import { NativeBridge } from "./native-bridge";

export class NativeStorage implements Storage {
    async save(s: Storable) {
        await NativeBridge.userDefaultsSetString(`${s.kind}_${s.id}`, JSON.stringify(s.toRaw()));
    }

    async get<T extends Storable>(cls: T | StorableConstructor<T>, id: string) {
        const s = cls instanceof Storable ? cls : new cls();
        const key = `${s.kind}_${id}`;
        const data = await NativeBridge.userDefaultsGetString(key);
        if (!data) {
            throw new Err(ErrorCode.NOT_FOUND);
        }
        return s.fromRaw(JSON.parse(data));
    }

    async delete(s: Storable) {
        await NativeBridge.userDefaultsRemove(`${s.kind}_${s.id}`);
    }

    async clear() {
        await NativeBridge.userDefaultsClear();
    }

    async list<T extends Storable>(_cls: StorableConstructor<T>, _: StorageListOptions): Promise<T[]> {
        throw new Err(ErrorCode.NOT_SUPPORTED);
    }

    async count<T extends Storable>(_cls: StorableConstructor<T>, _: StorageQuery): Promise<number> {
        throw new Err(ErrorCode.NOT_SUPPORTED);
    }
}
