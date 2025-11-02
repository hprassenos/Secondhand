export type ListingType =
  | 'antique_shop'
  | 'thrift_store'
  | 'consignment_shop'
  | 'flea_market'
  | 'auction_house'
  | 'estate_sale_company'

export type EventType = 'yard_sale' | 'estate_sale'

export type ModerationStatus = 'pending' | 'approved' | 'rejected'

export type AccountType = 'user' | 'shop_owner' | 'admin'

export interface Listing {
  id: string
  name: string
  type: ListingType
  address: string
  city: string
  state: string
  zip_code: string
  latitude?: number
  longitude?: number
  phone?: string
  website?: string
  description?: string
  hours?: BusinessHours
  parent_id?: string
  claimed: boolean
  verified: boolean
  featured: boolean
  photo_urls: string[]
  tags?: Tag[]
}

export interface BusinessHours {
  monday?: DayHours
  tuesday?: DayHours
  wednesday?: DayHours
  thursday?: DayHours
  friday?: DayHours
  saturday?: DayHours
  sunday?: DayHours
}

export interface DayHours {
  open: string // e.g., "09:00"
  close: string // e.g., "17:00"
  closed?: boolean
}

export interface Event {
  id: string
  type: EventType
  title: string
  description?: string
  address: string
  city: string
  state: string
  zip_code: string
  latitude?: number
  longitude?: number
  start_time: string
  end_time: string
  photo_urls: string[]
  created_by: string
  moderation_status: ModerationStatus
  tags?: Tag[]
}

export interface Tag {
  id: string
  name: string
  usage_count: number
}

export interface GuestbookEntry {
  id: string
  listing_id: string
  user_id: string
  description?: string
  photo_urls: string[]
  social_links?: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  moderation_status: ModerationStatus
  created_at: string
}

export interface Route {
  id: string
  user_id: string
  name: string
  event_ids: string[]
  custom_stops?: CustomStop[]
  route_data?: RouteData
}

export interface CustomStop {
  type: 'bank' | 'store' | 'restaurant' | 'other'
  name: string
  address: string
  duration: number // minutes
  time_constraint?: string // e.g., "before 12:00"
}

export interface RouteData {
  total_distance: number // miles
  total_time: number // minutes
  optimized_order: string[] // event IDs in order
  warnings?: string[]
}
