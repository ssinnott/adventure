// An async suite that rejects.
export async function rejects(): Promise<void> {
  await Promise.resolve();
  throw new Error('rejected after an await');
}
