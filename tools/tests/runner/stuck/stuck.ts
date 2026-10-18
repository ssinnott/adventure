// A suite that awaits a promise that never settles: the run dies inside it, with Node's exit 13, and
// its name must be the last line the run printed (#895). In a folder of its own, as it ends the run.
export async function stuck(): Promise<void> {
  await new Promise<void>(() => {});
}
