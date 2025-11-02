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

// Reference Library Types

export type ReferenceSubmissionType = 'maker' | 'pattern' | 'hallmark' | 'correction'

export type RarityLevel = 'common' | 'uncommon' | 'rare' | 'very_rare' | 'extremely_rare'

export interface ReferenceCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image_url?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ReferenceMaker {
  id: string
  category_id: string
  name: string
  slug: string
  description?: string
  founding_year?: number
  closing_year?: number
  country?: string
  logo_url?: string
  website_url?: string
  history?: string
  meta_title?: string
  meta_description?: string
  view_count: number
  search_count: number
  created_at: string
  updated_at: string
  // Relations
  category?: ReferenceCategory
  patterns?: ReferencePattern[]
  hallmarks?: ReferenceHallmark[]
}

export interface ReferencePattern {
  id: string
  maker_id: string
  name: string
  slug: string
  description?: string
  year_introduced?: number
  year_discontinued?: number
  materials?: string[]
  colors?: string[]
  style_period?: string
  rarity?: RarityLevel
  estimated_value_min?: number
  estimated_value_max?: number
  value_notes?: string
  identification_tips?: string
  meta_title?: string
  meta_description?: string
  view_count: number
  search_count: number
  created_at: string
  updated_at: string
  // Relations
  maker?: ReferenceMaker
  images?: ReferenceImage[]
}

export interface ReferenceImage {
  id: string
  pattern_id: string
  image_url: string
  thumbnail_url?: string
  alt_text: string
  caption?: string
  item_type?: string // 'plate', 'cup', 'teapot', etc.
  view_angle?: string // 'front', 'back', 'side', 'detail', 'hallmark'
  is_primary: boolean
  sort_order: number
  uploaded_by?: string
  source_attribution?: string
  created_at: string
}

export interface ReferenceHallmark {
  id: string
  maker_id: string
  image_url: string
  description: string
  date_range_start?: number
  date_range_end?: number
  country_code?: string
  mark_type?: string
  identification_notes?: string
  view_count: number
  created_at: string
  // Relations
  maker?: ReferenceMaker
}

export interface ReferenceSubmission {
  id: string
  submitted_by: string
  submission_type: ReferenceSubmissionType
  data: any // JSON payload
  related_maker_id?: string
  related_pattern_id?: string
  status: ModerationStatus
  reviewed_by?: string
  reviewed_at?: string
  reviewer_notes?: string
  created_at: string
}

export interface ReferenceSearchResult {
  type: 'maker' | 'pattern'
  id: string
  name: string
  description?: string
  image_url?: string
  maker_name?: string
  category_name?: string
  rank: number
}
