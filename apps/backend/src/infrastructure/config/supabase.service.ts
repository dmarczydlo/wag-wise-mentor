import { Injectable, Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import supabaseConfig from "./supabase.config";

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(
    @Inject(supabaseConfig.KEY)
    private config: ConfigType<typeof supabaseConfig>
  ) {
    this.initializeClient();
  }

  private initializeClient(): void {
    if (!this.config.url) {
      throw new Error("Supabase URL is required");
    }

    if (!this.config.serviceRoleKey) {
      throw new Error("Supabase service role key is required");
    }

    this.client = createClient(this.config.url, this.config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async executeQuery<T>(
    query: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    const { data, error } = await query(this.client);

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned from Supabase");
    }

    return data;
  }

  async executeCommand(
    command: (client: SupabaseClient) => Promise<{ error: any }>
  ): Promise<void> {
    const { error } = await command(this.client);

    if (error) {
      throw new Error(`Supabase command failed: ${error.message}`);
    }
  }
}

