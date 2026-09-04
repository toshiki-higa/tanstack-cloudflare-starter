import { hc } from "hono/client";

import type { Api } from "../server/api/index.ts";

export const apiClient = hc<Api>("/api");
