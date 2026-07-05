/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adformat from "../adformat.js";
import type * as assets from "../assets.js";
import type * as check from "../check.js";
import type * as deepseek from "../deepseek.js";
import type * as knowledge from "../knowledge.js";
import type * as pipeline from "../pipeline.js";
import type * as projects from "../projects.js";
import type * as prompts from "../prompts.js";
import type * as types from "../types.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adformat: typeof adformat;
  assets: typeof assets;
  check: typeof check;
  deepseek: typeof deepseek;
  knowledge: typeof knowledge;
  pipeline: typeof pipeline;
  projects: typeof projects;
  prompts: typeof prompts;
  types: typeof types;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
