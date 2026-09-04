import handler, { createServerEntry } from "@tanstack/solid-start/server-entry";

import { env } from "../server/env.ts";
import { createApp } from "../server/index.ts";

const app = createApp(handler.fetch);

export default createServerEntry({
  fetch: async (request) => await app.fetch(request, env),
});
