import { Storage, Storable, StorableConstructor, StorageListOptions, StorageQuery } from "@padloc/core/src/storage";
import { Err, ErrorCode } from "@padloc/core/src/error";

declare var NativeStorage: any;

export class UserDefaultsStorage implements Storage {
    private initNativeStorage() {
        NativeStorage.initWithSuiteName("group.local.app.padloc");
    }

    async save(s: Storable) {
        await new Promise((resolve, reject) => {
            this.initNativeStorage();
            NativeStorage.putString(`${s.kind}_${s.id}`, JSON.stringify(s.toRaw()), resolve, reject);
        });
    }

    async get<T extends Storable>(cls: T | StorableConstructor<T>, id: string) {
        const s = cls instanceof Storable ? cls : new cls();
        const key = `${s.kind}_${id}`;
        const data = await new Promise<string>((resolve, reject) => {
            this.initNativeStorage();
            NativeStorage.getString(key, resolve, reject);
        });
        if (!data) {
            throw new Err(ErrorCode.NOT_FOUND);
        }
        return s.fromRaw(JSON.parse(data));
    }

    async delete(s: Storable) {
        this.initNativeStorage();
        await new Promise((resolve, reject) => {
            this.initNativeStorage();
            NativeStorage.remove(`${s.kind}_${s.id}`, resolve, reject);
        });
    }

    async clear() {
        await new Promise((resolve, reject) => {
            this.initNativeStorage();
            NativeStorage.clear(resolve, reject);
        });
    }

    async list<T extends Storable>(_cls: StorableConstructor<T>, _: StorageListOptions): Promise<T[]> {
        throw new Err(ErrorCode.NOT_SUPPORTED);
    }

    async count<T extends Storable>(_cls: StorableConstructor<T>, _: StorageQuery): Promise<number> {
        throw new Err(ErrorCode.NOT_SUPPORTED);
    }
}
