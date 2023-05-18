import type { PaginatedResponse } from "./common";

export interface SigningInfo {
    address: string,
    start_height: string,
    index_offset: string,
    jailed_until: string,
    tombstoned: boolean,
    missed_blocks_counter: string
}

export interface SlashingParam{
    signed_blocks_window: string,
    min_signed_per_window: string,
    downtime_jail_duration: string,
    slash_fraction_double_sign: string,
    slash_fraction_downtime: string
  }

export interface PaginatedSigningInfo extends PaginatedResponse {
    info: SigningInfo[]
}