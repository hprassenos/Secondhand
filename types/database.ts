export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          verified: boolean
          account_type: 'user' | 'shop_owner' | 'admin'
          idme_verified: boolean
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          verified?: boolean
          account_type?: 'user' | 'shop_owner' | 'admin'
          idme_verified?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          verified?: boolean
          account_type?: 'user' | 'shop_owner' | 'admin'
          idme_verified?: boolean
        }
      }
      listings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          type: 'antique_shop' | 'thrift_store' | 'consignment_shop' | 'flea_market' | 'auction_house' | 'estate_sale_company'
          address: string
          city: string
          state: string
          zip_code: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          website: string | null
          description: string | null
          hours: Json | null
          parent_id: string | null
          claimed: boolean
          claimed_by: string | null
          verified: boolean
          featured: boolean
          photo_urls: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          type: 'antique_shop' | 'thrift_store' | 'consignment_shop' | 'flea_market' | 'auction_house' | 'estate_sale_company'
          address: string
          city: string
          state: string
          zip_code: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          description?: string | null
          hours?: Json | null
          parent_id?: string | null
          claimed?: boolean
          claimed_by?: string | null
          verified?: boolean
          featured?: boolean
          photo_urls?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          type?: 'antique_shop' | 'thrift_store' | 'consignment_shop' | 'flea_market' | 'auction_house' | 'estate_sale_company'
          address?: string
          city?: string
          state?: string
          zip_code?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          description?: string | null
          hours?: Json | null
          parent_id?: string | null
          claimed?: boolean
          claimed_by?: string | null
          verified?: boolean
          featured?: boolean
          photo_urls?: string[]
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          type: 'yard_sale' | 'estate_sale'
          title: string
          description: string | null
          address: string
          city: string
          state: string
          zip_code: string
          latitude: number | null
          longitude: number | null
          start_time: string
          end_time: string
          photo_urls: string[]
          created_by: string
          moderation_status: 'pending' | 'approved' | 'rejected'
          listing_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          type: 'yard_sale' | 'estate_sale'
          title: string
          description?: string | null
          address: string
          city: string
          state: string
          zip_code: string
          latitude?: number | null
          longitude?: number | null
          start_time: string
          end_time: string
          photo_urls?: string[]
          created_by: string
          moderation_status?: 'pending' | 'approved' | 'rejected'
          listing_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          type?: 'yard_sale' | 'estate_sale'
          title?: string
          description?: string | null
          address?: string
          city?: string
          state?: string
          zip_code?: string
          latitude?: number | null
          longitude?: number | null
          start_time?: string
          end_time?: string
          photo_urls?: string[]
          created_by?: string
          moderation_status?: 'pending' | 'approved' | 'rejected'
          listing_id?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          usage_count?: number
          created_at?: string
        }
      }
      listing_tags: {
        Row: {
          listing_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          listing_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          listing_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      event_tags: {
        Row: {
          event_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          event_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          event_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      guestbook_entries: {
        Row: {
          id: string
          created_at: string
          listing_id: string
          user_id: string
          description: string | null
          photo_urls: string[]
          social_links: Json | null
          moderation_status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          listing_id: string
          user_id: string
          description?: string | null
          photo_urls?: string[]
          social_links?: Json | null
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          listing_id?: string
          user_id?: string
          description?: string | null
          photo_urls?: string[]
          social_links?: Json | null
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
      }
      routes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          event_ids: string[]
          custom_stops: Json | null
          route_data: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          event_ids: string[]
          custom_stops?: Json | null
          route_data?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          event_ids?: string[]
          custom_stops?: Json | null
          route_data?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      listing_type: 'antique_shop' | 'thrift_store' | 'consignment_shop' | 'flea_market' | 'auction_house' | 'estate_sale_company'
      event_type: 'yard_sale' | 'estate_sale'
      account_type: 'user' | 'shop_owner' | 'admin'
      moderation_status: 'pending' | 'approved' | 'rejected'
    }
  }
}
