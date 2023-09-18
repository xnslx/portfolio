import type {SanityImageCrop, SanityImageHotspot} from '@sanity/asset-utils'
import type {Image} from '@sanity/types'

export interface SanityAssetImage {
  _type: 'image'
  altText?: string
  blurDataURL: string
  height: number
  url: string
  width: number
  blurHash: string
  crop?: SanityImageCrop
  options: any
  hotspot: SanityImageHotspot
}
