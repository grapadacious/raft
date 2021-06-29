async function wait(duration: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export async function retry<T>(action: () => Promise<T>, retries: number = 3, backoff: number = 300): Promise<T> {
    try {
        const result = await action();

        return result;
    } catch (error) {
        if (retries === 0) throw error;

        await wait(backoff);

        return await retry(action, retries - 1, backoff * 2);
    }
}