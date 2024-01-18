import type {Database} from "$lib/supabase-types"
import type {SupabaseClient, Session} from "@supabase/supabase-js"
import type { S } from "vitest/dist/types-71ccd11d";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession() : Promise<Session | null>;
		} 
		
		interface PageData {
			session:Session | null;
		}
		// interface Platform {}
	}
}

export {};
