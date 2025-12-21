interface MongooseCache {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

export { };
